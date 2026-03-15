import {create} from "zustand"
import {immer} from "zustand/middleware/immer"
import {temporal} from "zundo"
import {createRef} from "react"
import type {PlayerRef} from "@remotion/player"
import type {EditorStore, MediaItem, Clip, LabelOverlay, Track} from "./types"
import {wouldOverlap} from "@/lib/timeline-utils"

let idCounter = 0
export function generateId() {
  return `id_${Date.now()}_${idCounter++}`
}

const MIN_DURATION = 30 * 30 // minimum 30 seconds

const initialTracks: Track[] = [
  {id: "track-video-0", type: "video", clips: []},
  {id: "track-video-1", type: "video", clips: []},
  {id: "track-audio-0", type: "audio", clips: []},
]

/** Recalculate project duration based on content, with padding */
function recalcDuration(state: {tracks: Track[]; fps: number; durationInFrames: number}) {
  const contentEnd = state.tracks.reduce((max, track) => {
    const trackEnd = track.clips.reduce((m, c) => Math.max(m, c.from + c.durationInFrames), 0)
    return Math.max(max, trackEnd)
  }, 0)
  state.durationInFrames = Math.max(MIN_DURATION, contentEnd + 5 * state.fps)
}

export const useEditorStore = create<EditorStore>()(
  temporal(
  immer((set, get) => ({
    // -- Project --
    fps: 30,
    width: 1920,
    height: 1080,
    durationInFrames: 30 * 30,
    setDurationInFrames: (frames: number) => set({durationInFrames: frames}),

    // -- Tracks --
    tracks: initialTracks,

    addClipToTrack: (trackId: string, clip: Clip) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (track) track.clips.push(clip)
      }),

    removeClip: (trackId: string, clipId: string) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (track) track.clips = track.clips.filter((c) => c.id !== clipId)
        recalcDuration(state)
      }),

    addTrack: (type: "video" | "audio") => {
      const track: Track = {id: generateId(), type, clips: []}
      set((state) => {
        state.tracks.push(track)
      })
      return track
    },

    removeTrack: (id: string) =>
      set((state) => {
        state.tracks = state.tracks.filter((t) => t.id !== id)
        recalcDuration(state)
      }),

    moveClip: (fromTrackId: string, toTrackId: string, clipId: string, newFrom: number) =>
      set((state) => {
        const fromTrack = state.tracks.find((t) => t.id === fromTrackId)
        if (!fromTrack) return
        const clipIndex = fromTrack.clips.findIndex((c) => c.id === clipId)
        if (clipIndex === -1) return
        const clip = fromTrack.clips[clipIndex]
        clip.from = Math.max(0, newFrom)

        if (fromTrackId !== toTrackId) {
          const toTrack = state.tracks.find((t) => t.id === toTrackId)
          if (!toTrack) return
          fromTrack.clips.splice(clipIndex, 1)
          toTrack.clips.push(clip)
        }
        recalcDuration(state)
      }),

    resizeClipLeft: (trackId: string, clipId: string, newFrom: number, newTrimStart: number, newDuration: number) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (!track) return
        const clip = track.clips.find((c) => c.id === clipId)
        if (!clip) return
        clip.from = Math.max(0, newFrom)
        clip.trimStart = Math.max(0, newTrimStart)
        clip.durationInFrames = Math.max(1, newDuration)
        recalcDuration(state)
      }),

    resizeClipRight: (trackId: string, clipId: string, newDuration: number) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (!track) return
        const clip = track.clips.find((c) => c.id === clipId)
        if (!clip) return
        let clamped = Math.max(1, newDuration)
        if (clip.maxDurationInFrames) {
          const trimStart = clip.trimStart || 0
          clamped = Math.min(clamped, clip.maxDurationInFrames - trimStart)
        }
        clip.durationInFrames = clamped
        recalcDuration(state)
      }),

    splitClip: (trackId: string, clipId: string, frame: number) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (!track) return
        const clipIndex = track.clips.findIndex((c) => c.id === clipId)
        if (clipIndex === -1) return
        const clip = track.clips[clipIndex]

        // Frame must be within the clip
        if (frame <= clip.from || frame >= clip.from + clip.durationInFrames) return

        const splitPoint = frame - clip.from
        const originalTrimStart = clip.trimStart || 0

        const secondClip: Clip = {
          id: `id_${Date.now()}_${idCounter++}`,
          mediaId: clip.mediaId,
          src: clip.src,
          type: clip.type,
          from: frame,
          durationInFrames: clip.durationInFrames - splitPoint,
          trimStart: originalTrimStart + splitPoint,
          name: clip.name,
        }

        // Shorten original clip
        clip.durationInFrames = splitPoint

        // Insert second clip after the original
        track.clips.splice(clipIndex + 1, 0, secondClip)
      }),

    toggleTrackMute: (trackId: string) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (track) track.muted = !track.muted
      }),

    duplicateClip: (trackId: string, clipId: string) =>
      set((state) => {
        const track = state.tracks.find((t) => t.id === trackId)
        if (!track) return
        const clip = track.clips.find((c) => c.id === clipId)
        if (!clip) return
        const newClip: Clip = {
          ...clip,
          id: generateId(),
          from: clip.from + clip.durationInFrames,
        }
        track.clips.push(newClip)
        recalcDuration(state)
      }),

    addMediaToTimeline: (mediaItem: MediaItem) => {
      const {fps, tracks} = get()
      const defaultDuration = mediaItem.type === "image" ? 5 * fps : (mediaItem.durationInSeconds || 10) * fps
      const trackType = mediaItem.type === "audio" ? "audio" : "video"
      const targetTrack = tracks.find((t) => t.type === trackType)
      if (!targetTrack) return

      const lastClipEnd = targetTrack.clips.reduce(
        (max, clip) => Math.max(max, clip.from + clip.durationInFrames),
        0
      )

      const clip: Clip = {
        id: generateId(),
        mediaId: mediaItem.id,
        src: mediaItem.src,
        type: mediaItem.type,
        from: lastClipEnd,
        durationInFrames: Math.round(defaultDuration),
        maxDurationInFrames: Math.round(defaultDuration),
        name: mediaItem.name,
      }

      set((state) => {
        const t = state.tracks.find((t) => t.id === targetTrack.id)
        if (t) t.clips.push(clip)
        recalcDuration(state)
      })
    },

    dropMediaOnTrack: (trackId: string, mediaItem: MediaItem, atFrame: number) => {
      const {fps, tracks} = get()
      const track = tracks.find((t) => t.id === trackId)
      if (!track) return

      // Type enforcement
      if (track.type === "audio" && mediaItem.type !== "audio") return
      if (track.type === "video" && mediaItem.type === "audio") return

      const defaultDuration = mediaItem.type === "image" ? 5 * fps : (mediaItem.durationInSeconds || 10) * fps
      const duration = Math.round(defaultDuration)

      let from = Math.max(0, atFrame)

      // If overlap at drop position, place at end of track
      if (wouldOverlap(track.clips, "", from, duration)) {
        from = track.clips.reduce((max, c) => Math.max(max, c.from + c.durationInFrames), 0)
      }

      const clip: Clip = {
        id: generateId(),
        mediaId: mediaItem.id,
        src: mediaItem.src,
        type: mediaItem.type,
        from,
        durationInFrames: duration,
        maxDurationInFrames: duration,
        name: mediaItem.name,
      }

      set((state) => {
        const t = state.tracks.find((t) => t.id === trackId)
        if (t) t.clips.push(clip)
        recalcDuration(state)
      })
    },

    // -- Playback --
    playerRef: createRef<PlayerRef | null>(),
    isPlaying: false,
    currentFrame: 0,
    setIsPlaying: (playing: boolean) => set({isPlaying: playing}),
    setCurrentFrame: (frame: number) => set({currentFrame: frame}),

    togglePlayback: () => {
      const {playerRef, isPlaying} = get()
      const player = playerRef.current
      if (!player) return
      if (isPlaying) {
        player.pause()
      } else {
        player.play()
      }
      set({isPlaying: !isPlaying})
    },

    seekTo: (frame: number) => {
      const {playerRef} = get()
      const player = playerRef.current
      if (!player) return
      player.seekTo(frame)
      set({currentFrame: frame})
    },

    // -- Media --
    mediaItems: [],
    addMediaItem: (item: MediaItem) =>
      set((state) => {
        state.mediaItems.push(item)
      }),
    removeMediaItem: (id: string) =>
      set((state) => {
        state.mediaItems = state.mediaItems.filter((m) => m.id !== id)
      }),

    // -- Labels --
    labels: [],
    addLabel: (label: LabelOverlay) =>
      set((state) => {
        state.labels.push(label)
      }),
    removeLabel: (id: string) =>
      set((state) => {
        state.labels = state.labels.filter((l) => l.id !== id)
      }),

    // -- UI --
    selectedClipId: null,
    selectedTrackId: null,
    zoomLevel: 1,
    snapEnabled: true,
    draggedMediaItem: null,
    dragTargetTrackId: null,
    setSelectedClip: (clipId: string | null) => set({selectedClipId: clipId}),
    setSelectedTrack: (trackId: string | null) => set({selectedTrackId: trackId}),
    setZoomLevel: (level: number) => set({zoomLevel: level}),
    setSnapEnabled: (enabled: boolean) => set({snapEnabled: enabled}),
    setDraggedMediaItem: (item) => set({draggedMediaItem: item}),
    setDragTargetTrackId: (trackId: string | null) => set({dragTargetTrackId: trackId}),
  })),
  {
    // Only track content state for undo/redo, not UI/playback
    partialize: (state) => ({
      tracks: state.tracks,
      labels: state.labels,
      mediaItems: state.mediaItems,
      durationInFrames: state.durationInFrames,
    }),
    limit: 50,
  })
)
