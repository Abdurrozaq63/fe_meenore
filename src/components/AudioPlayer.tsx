import { useState, useRef, useEffect } from "react"

interface AudioPlayerProps {
  src?: string
  title?: string
  duration?: number
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export default function AudioPlayer({ src, title, duration = 0 }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setTotalDuration(audio.duration || 0)
    const handleEnd = () => setPlaying(false)
    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnd)
    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnd)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || !src) {
      setPlaying((v) => !v)
      return
    }
    if (playing) audio.pause()
    else audio.play()
    setPlaying(!playing)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = barRef.current
    if (!bar || !totalDuration) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newTime = pct * totalDuration
    setCurrentTime(newTime)
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

  return (
    <div
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset" }}
    >
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 flex items-center justify-center transition-colors shadow-lg shadow-blue-900/30"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="2" width="3.5" height="10" rx="1" />
              <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="white"
              style={{ marginLeft: "2px" }}
            >
              <path d="M3 2l9 5-9 5V2z" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-mono text-xs text-[var(--muted-foreground)] mb-1.5 truncate">
              {title}
            </p>
          )}
          <div
            ref={barRef}
            onClick={seek}
            className="relative h-1.5 rounded-full bg-[var(--muted)] cursor-pointer group"
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="text-[var(--muted-foreground)]"
          >
            <path
              d="M2 5.5h3l4-3.5v12l-4-3.5H2V5.5zM12 5a5 5 0 010 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            className="w-16 accent-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
