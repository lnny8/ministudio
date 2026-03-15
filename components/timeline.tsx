"use client"
import {AudioWave01Icon, Delete02Icon, HelpSquareIcon, VideotapeIcon, Scissor01Icon, Add01Icon, VolumeOffIcon, VolumeHighIcon, EyeIcon, ViewOffSlashIcon} from "@hugeicons/core-free-icons"
import {HugeiconsIcon} from "@hugeicons/react"
import {useCallback, useEffect, useRef, useState} from "react"
import {useEditorStore} from "@/lib/store"
import type {Track as TrackType, Clip as ClipType} from "@/lib/store/types"
import {frameToPx, pxToFrame, getSnapTargets, snapToTargets, wouldOverlap} from "@/lib/timeline-utils"

// Minimum pixels-per-frame at zoom 1 for the visible area
const BASE_PPF = 0.8
// Icon (25px) + gap-3 (12px) = 37px offset from track container left to clip area
const TRACK_OFFSET_PX = 37

// --- Helpers for cross-track drag ---
type CachedTrackRect = {trackId: string; trackType: string; top: number; bottom: number}

function cacheTrackRects(): CachedTrackRect[] {
  const elements = document.querySelectorAll<HTMLElement>("[data-track-id]")
  const rects: CachedTrackRect[] = []
  for (const el of elements) {
    const rect = el.getBoundingClientRect()
    rects.push({
      trackId: el.dataset.trackId!,
      trackType: el.dataset.trackType!,
      top: rect.top,
      bottom: rect.bottom,
    })
  }
  return rects
}

function findTrackInCache(y: number, cache: CachedTrackRect[]): {trackId: string; trackType: string} | null {
  for (const r of cache) {
    if (y >= r.top && y <= r.bottom) return {trackId: r.trackId, trackType: r.trackType}
  }
  return null
}

function isCompatibleType(clipType: string, trackType: string): boolean {
  if (trackType === "audio") return clipType === "audio"
  if (trackType === "video") return clipType === "video" || clipType === "image"
  return false
}

export default function Timeline() {
  const tracks = useEditorStore((s) => s.tracks)
  const durationInFrames = useEditorStore((s) => s.durationInFrames)
  const fps = useEditorStore((s) => s.fps)
  const zoomLevel = useEditorStore((s) => s.zoomLevel)
  const setZoomLevel = useEditorStore((s) => s.setZoomLevel)
  const snapEnabled = useEditorStore((s) => s.snapEnabled)
  const setSnapEnabled = useEditorStore((s) => s.setSnapEnabled)
  const selectedClipId = useEditorStore((s) => s.selectedClipId)
  const setSelectedClip = useEditorStore((s) => s.setSelectedClip)
  const removeClip = useEditorStore((s) => s.removeClip)
  const splitClip = useEditorStore((s) => s.splitClip)
  const addTrack = useEditorStore((s) => s.addTrack)
  const removeTrack = useEditorStore((s) => s.removeTrack)

  const scrollRef = useRef<HTMLDivElement>(null)

  const pixelsPerFrame = BASE_PPF * zoomLevel
  const contentWidth = frameToPx(durationInFrames, pixelsPerFrame)

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Undo: Ctrl+Z
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        useEditorStore.temporal.getState().undo()
        return
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === "y" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        useEditorStore.temporal.getState().redo()
        return
      }

      if (!selectedClipId) return
      // Duplicate clip: Ctrl+C / Ctrl+V (both duplicate in place)
      if ((e.key === "c" || e.key === "v") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const state = useEditorStore.getState()
        for (const track of state.tracks) {
          if (track.clips.some((c) => c.id === selectedClipId)) {
            state.duplicateClip(track.id, selectedClipId)
            break
          }
        }
        return
      }
      // Delete selected clip
      if (e.key === "Delete" || e.key === "Backspace") {
        for (const track of useEditorStore.getState().tracks) {
          if (track.clips.some((c) => c.id === selectedClipId)) {
            removeClip(track.id, selectedClipId)
            setSelectedClip(null)
            break
          }
        }
      }
      // Split at playhead
      if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        const state = useEditorStore.getState()
        for (const track of state.tracks) {
          const clip = track.clips.find((c) => c.id === selectedClipId)
          if (clip && state.currentFrame > clip.from && state.currentFrame < clip.from + clip.durationInFrames) {
            splitClip(track.id, selectedClipId, state.currentFrame)
            break
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedClipId, removeClip, setSelectedClip, splitClip])

  // Zoom with Ctrl+Scroll — keeps the point under cursor stable
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const container = scrollRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const cursorX = e.clientX - rect.left + container.scrollLeft

        const delta = e.deltaY > 0 ? -0.2 : 0.2
        const newZoom = Math.max(0.3, Math.min(10, zoomLevel + delta * zoomLevel))
        const scale = newZoom / zoomLevel

        setZoomLevel(newZoom)
        // Adjust scroll so cursor stays over the same frame
        requestAnimationFrame(() => {
          container.scrollLeft = cursorX * scale - (e.clientX - rect.left)
        })
      }
    },
    [zoomLevel, setZoomLevel]
  )

  // Deselect on clicking empty area
  function handleBackgroundClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      setSelectedClip(null)
    }
  }

  return (
    <div className="rounded-3xl w-full h-full shadow-hard bg-[#ddd] border-2 border-black p-4 mr-10 flex flex-col gap-1 relative overflow-hidden">
      {/* Toolbar: Snap toggle + Zoom slider */}
      <div className="flex items-center gap-3 mb-1 justify-end pr-1">
        <button
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={`cursor-pointer text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
            snapEnabled ? "bg-[#2a9] text-white border-[#2a9]" : "bg-white text-gray-500 border-gray-300"
          }`}
          title={snapEnabled ? "Snap enabled (hold Alt to disable temporarily)" : "Snap disabled"}>
          Snap
        </button>
        <span className="text-[10px] text-gray-500">Zoom</span>
        <input
          type="range"
          min={0.3}
          max={10}
          step={0.1}
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className="w-20 h-1 accent-[#2a9]"
        />
        <span className="text-[10px] text-gray-500 w-8">{Math.round(zoomLevel * 100)}%</span>
      </div>

      {/* Scrollable timeline area */}
      <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden relative" onWheel={handleWheel}>
        <div style={{width: contentWidth, minWidth: "100%"}} className="relative">
          {/* Time ruler - clickable for seeking */}
          <TimeRuler durationInFrames={durationInFrames} fps={fps} pixelsPerFrame={pixelsPerFrame} scrollRef={scrollRef} />

          {/* Tracks */}
          <div className="flex flex-col gap-2 relative" onClick={handleBackgroundClick}>
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                pixelsPerFrame={pixelsPerFrame}
                canDelete={tracks.filter((t) => t.type === track.type).length > 1}
                onDelete={() => removeTrack(track.id)}
              />
            ))}

            {/* Add track buttons */}
            <div className="flex gap-2 mt-1 ml-9.25">
              <button
                onClick={() => addTrack("video")}
                className="cursor-pointer flex items-center gap-1 text-xs text-gray-500 hover:text-black px-2 py-1 rounded-lg hover:bg-white/60 transition-colors">
                <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
                Video Track
              </button>
              <button
                onClick={() => addTrack("audio")}
                className="cursor-pointer flex items-center gap-1 text-xs text-gray-500 hover:text-black px-2 py-1 rounded-lg hover:bg-white/60 transition-colors">
                <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
                Audio Track
              </button>
            </div>
          </div>

          {/* Playhead */}
          <Playhead pixelsPerFrame={pixelsPerFrame} scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  )
}

// --- Track Row with drop zone ---
function TrackRow({track, pixelsPerFrame, canDelete, onDelete}: {track: TrackType; pixelsPerFrame: number; canDelete: boolean; onDelete: () => void}) {
  const dropMediaOnTrack = useEditorStore((s) => s.dropMediaOnTrack)
  const dragTargetTrackId = useEditorStore((s) => s.dragTargetTrackId)
  const toggleTrackMute = useEditorStore((s) => s.toggleTrackMute)
  const [isDragOver, setIsDragOver] = useState(false)
  const trackContentRef = useRef<HTMLDivElement>(null)
  const isDropTarget = isDragOver || dragTargetTrackId === track.id

  function handleDragOver(e: React.DragEvent) {
    const draggedItem = useEditorStore.getState().draggedMediaItem
    if (!draggedItem) return
    // Type enforcement
    if (!isCompatibleType(draggedItem.type, track.type)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only hide indicator when actually leaving the track area
    if (trackContentRef.current && !trackContentRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const draggedItem = useEditorStore.getState().draggedMediaItem
    if (!draggedItem) return
    if (!isCompatibleType(draggedItem.type, track.type)) return

    // Calculate frame at drop position
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const dropFrame = pxToFrame(x, pixelsPerFrame)

    dropMediaOnTrack(track.id, draggedItem, dropFrame)
  }

  const muteIcon = track.type === "audio"
    ? (track.muted ? VolumeOffIcon : VolumeHighIcon)
    : (track.muted ? ViewOffSlashIcon : EyeIcon)

  return (
    <div className="group/track flex w-full gap-3 items-center justify-center">
      {getTrackIcon(track.type)}
      <button
        onClick={() => toggleTrackMute(track.id)}
        className={`cursor-pointer p-1 rounded-lg transition-colors shrink-0 ${track.muted ? "bg-red-100" : "hover:bg-white/60"}`}
        title={track.muted ? "Unmute track" : "Mute track"}>
        <HugeiconsIcon icon={muteIcon} size={14} color={track.muted ? "#ef4444" : "#888"} strokeWidth={2} />
      </button>
      <div
        ref={trackContentRef}
        data-track-id={track.id}
        data-track-type={track.type}
        className={`h-14 bg-white border-2 shadow-hard w-full rounded-xl relative overflow-hidden transition-colors ${
          isDropTarget ? "border-[#2a9] bg-[#2a9]/10" : "border-black"
        } ${track.muted ? "opacity-40" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {track.clips.map((clip) => (
          <ClipBlock key={clip.id} clip={clip} track={track} pixelsPerFrame={pixelsPerFrame} />
        ))}
      </div>
      {canDelete && (
        <button
          onClick={onDelete}
          className="cursor-pointer opacity-0 group-hover/track:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg shrink-0"
          title="Remove track">
          <HugeiconsIcon icon={Delete02Icon} size={16} color="#ef4444" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

// --- Clip Block with drag, resize & cross-track support ---
function ClipBlock({
  clip,
  track,
  pixelsPerFrame,
}: {
  clip: ClipType
  track: TrackType
  pixelsPerFrame: number
}) {
  const selectedClipId = useEditorStore((s) => s.selectedClipId)
  const setSelectedClip = useEditorStore((s) => s.setSelectedClip)
  const moveClip = useEditorStore((s) => s.moveClip)
  const resizeClipLeft = useEditorStore((s) => s.resizeClipLeft)
  const resizeClipRight = useEditorStore((s) => s.resizeClipRight)
  const removeClip = useEditorStore((s) => s.removeClip)
  const currentFrame = useEditorStore((s) => s.currentFrame)
  const splitClip = useEditorStore((s) => s.splitClip)

  const isSelected = selectedClipId === clip.id
  const left = frameToPx(clip.from, pixelsPerFrame)
  const width = frameToPx(clip.durationInFrames, pixelsPerFrame)

  function handleDragStart(e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedClip(clip.id)
    const startX = e.clientX
    const startFrom = clip.from
    let currentTrackId = track.id
    const trackRectsCache = cacheTrackRects()

    function onMove(me: MouseEvent) {
      const state = useEditorStore.getState()
      const currentTrack = state.tracks.find((t) => t.id === currentTrackId)
      if (!currentTrack) return
      const currentClip = currentTrack.clips.find((c) => c.id === clip.id)
      if (!currentClip) return

      const deltaPx = me.clientX - startX
      const deltaFrames = pxToFrame(Math.abs(deltaPx), pixelsPerFrame) * (deltaPx < 0 ? -1 : 1)
      const rawNewFrom = startFrom + deltaFrames

      // Snap (disabled when Alt is held or snap is toggled off)
      const shouldSnap = state.snapEnabled && !me.altKey
      let newFrom = rawNewFrom
      if (shouldSnap) {
        const allClips = state.tracks.flatMap((t) => t.clips)
        const targets = getSnapTargets(allClips, clip.id, state.currentFrame)
        const snappedStart = snapToTargets(rawNewFrom, targets, pixelsPerFrame)
        const snappedEnd = snapToTargets(rawNewFrom + currentClip.durationInFrames, targets, pixelsPerFrame)
        newFrom = snappedStart.snapped ? snappedStart.frame : rawNewFrom
        if (!snappedStart.snapped && snappedEnd.snapped) {
          newFrom = snappedEnd.frame - currentClip.durationInFrames
        }
      }
      const maxFrom = useEditorStore.getState().durationInFrames - currentClip.durationInFrames
      newFrom = Math.max(0, Math.min(maxFrom, Math.round(newFrom)))

      // Cross-track detection (using cached rects)
      const trackAtPoint = findTrackInCache(me.clientY, trackRectsCache)
      let targetTrackId = currentTrackId

      if (trackAtPoint && trackAtPoint.trackId !== currentTrackId) {
        if (isCompatibleType(currentClip.type, trackAtPoint.trackType)) {
          // Try cross-track: check overlap on target track
          const targetTrack = state.tracks.find((t) => t.id === trackAtPoint.trackId)
          if (targetTrack && !wouldOverlap(targetTrack.clips, clip.id, newFrom, currentClip.durationInFrames)) {
            targetTrackId = trackAtPoint.trackId
          }
        }
      }

      // Visual feedback for target track
      state.setDragTargetTrackId(targetTrackId !== currentTrackId ? targetTrackId : null)

      // Move clip (cross-track or same-track horizontal)
      const finalTrack = state.tracks.find((t) => t.id === targetTrackId)
      if (finalTrack && !wouldOverlap(finalTrack.clips, clip.id, newFrom, currentClip.durationInFrames)) {
        moveClip(currentTrackId, targetTrackId, clip.id, newFrom)
        currentTrackId = targetTrackId
      }
    }

    function onUp() {
      useEditorStore.getState().setDragTargetTrackId(null)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // --- Left resize ---
  function handleResizeLeft(e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedClip(clip.id)
    const startX = e.clientX
    const startFrom = clip.from
    const startDuration = clip.durationInFrames
    const startTrimStart = clip.trimStart || 0

    function onMove(me: MouseEvent) {
      const deltaPx = me.clientX - startX
      const deltaFrames = Math.round(deltaPx / pixelsPerFrame)

      const newFrom = Math.max(0, startFrom + deltaFrames)
      const actualDelta = newFrom - startFrom
      const newDuration = startDuration - actualDelta
      const newTrimStart = startTrimStart + actualDelta

      if (newDuration >= 1 && newTrimStart >= 0) {
        resizeClipLeft(track.id, clip.id, newFrom, newTrimStart, newDuration)
      }
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // --- Right resize ---
  function handleResizeRight(e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedClip(clip.id)
    const startX = e.clientX
    const startDuration = clip.durationInFrames

    function onMove(me: MouseEvent) {
      const deltaPx = me.clientX - startX
      const deltaFrames = Math.round(deltaPx / pixelsPerFrame)
      const newDuration = Math.max(1, startDuration + deltaFrames)
      resizeClipRight(track.id, clip.id, newDuration)
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // Can split?
  const canSplit = currentFrame > clip.from && currentFrame < clip.from + clip.durationInFrames

  return (
    <div
      className={`absolute top-0 bottom-0 rounded-lg flex items-center group cursor-grab active:cursor-grabbing select-none ${
        isSelected ? "ring-2 ring-black ring-offset-1" : ""
      }`}
      style={{
        left,
        width: Math.max(width, 20),
        backgroundColor: track.type === "video" ? "#2a9" : "#f59e0b",
      }}
      onMouseDown={handleDragStart}>
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-black/20 rounded-l-lg z-10"
        onMouseDown={handleResizeLeft}
      />

      {/* Content */}
      <div className="flex-1 flex items-center px-3 min-w-0 pointer-events-none">
        <span className="text-white text-xs truncate flex-1">{clip.name}</span>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 mr-2 pointer-events-auto">
        {canSplit && (
          <button
            className="cursor-pointer p-0.5 hover:bg-black/20 rounded"
            onClick={(e) => {
              e.stopPropagation()
              splitClip(track.id, clip.id, currentFrame)
            }}>
            <HugeiconsIcon icon={Scissor01Icon} size={12} color="white" strokeWidth={2} />
          </button>
        )}
        <button
          className="cursor-pointer p-0.5 hover:bg-black/20 rounded"
          onClick={(e) => {
            e.stopPropagation()
            removeClip(track.id, clip.id)
            if (isSelected) useEditorStore.getState().setSelectedClip(null)
          }}>
          <HugeiconsIcon icon={Delete02Icon} size={12} color="white" strokeWidth={2} />
        </button>
      </div>

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-black/20 rounded-r-lg z-10"
        onMouseDown={handleResizeRight}
      />
    </div>
  )
}

// --- Time Ruler (click/drag to seek) ---
function TimeRuler({
  durationInFrames,
  fps,
  pixelsPerFrame,
  scrollRef,
}: {
  durationInFrames: number
  fps: number
  pixelsPerFrame: number
  scrollRef: React.RefObject<HTMLDivElement | null>
}) {
  const seekTo = useEditorStore((s) => s.seekTo)
  const playerRef = useEditorStore((s) => s.playerRef)
  const isPlaying = useEditorStore((s) => s.isPlaying)

  const totalSeconds = Math.ceil(durationInFrames / fps)
  // Dynamic interval based on zoom
  const pxPerSecond = pixelsPerFrame * fps
  let interval = 1
  if (pxPerSecond < 15) interval = 30
  else if (pxPerSecond < 30) interval = 10
  else if (pxPerSecond < 80) interval = 5
  else if (pxPerSecond < 200) interval = 2

  const timestamps: {label: string; px: number}[] = []
  for (let s = 0; s <= totalSeconds; s += interval) {
    const min = Math.floor(s / 60)
    const sec = s % 60
    timestamps.push({
      label: `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`,
      px: frameToPx(s * fps, pixelsPerFrame),
    })
  }

  function getFrameFromX(clientX: number) {
    if (!scrollRef.current) return 0
    const rect = scrollRef.current.getBoundingClientRect()
    const scrollLeft = scrollRef.current.scrollLeft
    // Subtract TRACK_OFFSET_PX because the ruler starts at that offset
    const x = clientX - rect.left + scrollLeft - TRACK_OFFSET_PX
    return Math.round(Math.max(0, Math.min(pxToFrame(x, pixelsPerFrame), durationInFrames - 1)))
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const wasPlaying = isPlaying
    if (wasPlaying) playerRef.current?.pause()
    seekTo(getFrameFromX(e.clientX))

    function onMove(me: MouseEvent) {
      seekTo(getFrameFromX(me.clientX))
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      if (wasPlaying) playerRef.current?.play()
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div className="h-7 relative mb-1 cursor-pointer" style={{marginLeft: TRACK_OFFSET_PX}} onMouseDown={handleMouseDown}>
      {timestamps.map((ts, i) => (
        <div key={i} className="absolute top-0 flex items-center gap-1" style={{left: ts.px}}>
          <div className="bg-black h-3 w-0.5" />
          <span className="text-[10px] whitespace-nowrap">{ts.label}</span>
        </div>
      ))}
    </div>
  )
}

// --- Playhead (only handle is draggable) ---
function Playhead({
  pixelsPerFrame,
  scrollRef,
}: {
  pixelsPerFrame: number
  scrollRef: React.RefObject<HTMLDivElement | null>
}) {
  const currentFrame = useEditorStore((s) => s.currentFrame)
  const durationInFrames = useEditorStore((s) => s.durationInFrames)
  const seekTo = useEditorStore((s) => s.seekTo)
  const playerRef = useEditorStore((s) => s.playerRef)
  const isPlaying = useEditorStore((s) => s.isPlaying)

  const [isDragging, setIsDragging] = useState(false)
  const wasPlayingRef = useRef(false)

  const playheadLeft = frameToPx(currentFrame, pixelsPerFrame) + TRACK_OFFSET_PX

  // Auto-scroll to keep playhead visible during playback
  useEffect(() => {
    if (!isPlaying || isDragging) return
    const container = scrollRef.current
    if (!container) return
    const playheadPx = frameToPx(currentFrame, pixelsPerFrame)
    const visibleLeft = container.scrollLeft
    const visibleRight = visibleLeft + container.clientWidth - TRACK_OFFSET_PX
    if (playheadPx > visibleRight - 40) {
      container.scrollLeft = playheadPx - container.clientWidth / 2
    }
  }, [currentFrame, isPlaying, isDragging, pixelsPerFrame])

  function frameFromMouseEvent(e: MouseEvent | React.MouseEvent) {
    if (!scrollRef.current) return 0
    const rect = scrollRef.current.getBoundingClientRect()
    const scrollLeft = scrollRef.current.scrollLeft
    const x = e.clientX - rect.left + scrollLeft - TRACK_OFFSET_PX
    return Math.round(Math.max(0, Math.min(pxToFrame(x, pixelsPerFrame), durationInFrames - 1)))
  }

  // Only the handle starts drag
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    wasPlayingRef.current = isPlaying
    if (isPlaying) playerRef.current?.pause()
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => seekTo(frameFromMouseEvent(e))
    const onUp = () => {
      setIsDragging(false)
      if (wasPlayingRef.current) playerRef.current?.play()
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [isDragging])

  return (
    <div
      className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center -translate-x-1/2"
      style={{left: playheadLeft}}>
      {/* Only the handle responds to mouse events */}
      <div
        className="w-3 h-5 shrink-0 border-black border-2 bg-[#2a9] rounded-md shadow-hard pointer-events-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      />
      <div className="w-0.5 bg-black flex-1 rounded-full" />
    </div>
  )
}

// --- Helpers ---
function getTrackIcon(type: string) {
  switch (type) {
    case "video":
      return <HugeiconsIcon icon={VideotapeIcon} size={25} color="black" strokeWidth={1.5} />
    case "audio":
      return <HugeiconsIcon icon={AudioWave01Icon} size={25} color="black" strokeWidth={1.5} />
    default:
      return <HugeiconsIcon icon={HelpSquareIcon} size={25} color="black" strokeWidth={1.5} />
  }
}
