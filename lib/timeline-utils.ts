import type {Clip} from "./store/types"

const SNAP_THRESHOLD_PX = 8

export type SnapResult = {
  frame: number
  snapped: boolean
}

/** Collect all clip edge frames + playhead for snapping */
export function getSnapTargets(
  clips: Clip[],
  excludeClipId: string | null,
  playheadFrame: number
): number[] {
  const targets: number[] = [0, playheadFrame]
  for (const clip of clips) {
    if (clip.id === excludeClipId) continue
    targets.push(clip.from)
    targets.push(clip.from + clip.durationInFrames)
  }
  return targets
}

/** Snap a frame value to the nearest target within threshold */
export function snapToTargets(
  frame: number,
  targets: number[],
  pixelsPerFrame: number
): SnapResult {
  let closest = frame
  let minDist = Infinity

  for (const target of targets) {
    const distPx = Math.abs((target - frame) * pixelsPerFrame)
    if (distPx < SNAP_THRESHOLD_PX && distPx < minDist) {
      minDist = distPx
      closest = target
    }
  }

  return {frame: closest, snapped: minDist < Infinity}
}

/** Check if moving a clip to newFrom would overlap any other clip on the track */
export function wouldOverlap(
  clips: Clip[],
  clipId: string,
  newFrom: number,
  duration: number
): boolean {
  const newEnd = newFrom + duration
  for (const other of clips) {
    if (other.id === clipId) continue
    const otherEnd = other.from + other.durationInFrames
    if (newFrom < otherEnd && newEnd > other.from) return true
  }
  return false
}

/** Convert pixel offset within the scrollable track area to frame number */
export function pxToFrame(px: number, pixelsPerFrame: number): number {
  return Math.round(Math.max(0, px / pixelsPerFrame))
}

/** Convert frame to pixel offset */
export function frameToPx(frame: number, pixelsPerFrame: number): number {
  return frame * pixelsPerFrame
}

/** Format frame number as mm:ss */
export function formatTime(frame: number, fps: number): string {
  const totalSeconds = Math.floor(frame / fps)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
