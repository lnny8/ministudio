import type {PlayerRef} from "@remotion/player"

export type MediaItem = {
  id: string
  name: string
  type: "video" | "image" | "audio"
  src: string
  durationInSeconds?: number
}

export type Clip = {
  id: string
  mediaId: string
  src: string
  type: "video" | "image" | "audio"
  from: number // start frame on timeline
  durationInFrames: number
  trimStart?: number // trim from beginning in frames
  maxDurationInFrames?: number // total source media length in frames
  name: string
}

export type Track = {
  id: string
  type: "video" | "audio"
  clips: Clip[]
  muted?: boolean
}

export type LabelOverlay = {
  id: string
  text: string
  color: string
  from: number
  durationInFrames: number
  x: number
  y: number
  paddingX: number
  paddingY: number
  borderRadius: number
}

// -- Store slice types --

export type ProjectSlice = {
  fps: number
  width: number
  height: number
  durationInFrames: number
  setDurationInFrames: (frames: number) => void
}

export type TracksSlice = {
  tracks: Track[]
  addClipToTrack: (trackId: string, clip: Clip) => void
  removeClip: (trackId: string, clipId: string) => void
  addTrack: (type: "video" | "audio") => Track
  removeTrack: (id: string) => void
  addMediaToTimeline: (mediaItem: MediaItem) => void
  dropMediaOnTrack: (trackId: string, mediaItem: MediaItem, atFrame: number) => void
  moveClip: (fromTrackId: string, toTrackId: string, clipId: string, newFrom: number) => void
  resizeClipLeft: (trackId: string, clipId: string, newFrom: number, newTrimStart: number, newDuration: number) => void
  resizeClipRight: (trackId: string, clipId: string, newDuration: number) => void
  splitClip: (trackId: string, clipId: string, frame: number) => void
  duplicateClip: (trackId: string, clipId: string) => void
  toggleTrackMute: (trackId: string) => void
}

export type PlaybackSlice = {
  playerRef: React.RefObject<PlayerRef | null>
  isPlaying: boolean
  currentFrame: number
  setIsPlaying: (playing: boolean) => void
  setCurrentFrame: (frame: number) => void
  togglePlayback: () => void
  seekTo: (frame: number) => void
}

export type MediaSlice = {
  mediaItems: MediaItem[]
  addMediaItem: (item: MediaItem) => void
  removeMediaItem: (id: string) => void
}

export type LabelsSlice = {
  labels: LabelOverlay[]
  addLabel: (label: LabelOverlay) => void
  removeLabel: (id: string) => void
}

export type UISlice = {
  selectedClipId: string | null
  selectedTrackId: string | null
  zoomLevel: number
  draggedMediaItem: MediaItem | null
  dragTargetTrackId: string | null
  setSelectedClip: (clipId: string | null) => void
  setSelectedTrack: (trackId: string | null) => void
  setZoomLevel: (level: number) => void
  snapEnabled: boolean
  setSnapEnabled: (enabled: boolean) => void
  setDraggedMediaItem: (item: MediaItem | null) => void
  setDragTargetTrackId: (trackId: string | null) => void
}

export type EditorStore = ProjectSlice &
  TracksSlice &
  PlaybackSlice &
  MediaSlice &
  LabelsSlice &
  UISlice
