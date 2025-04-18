"use client"

import { useState, useEffect } from "react"
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: {
    id: string
    title: string
    timestamp: string
    location: string
  }
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("00:00")
  const [duration, setDuration] = useState("02:15")

  useEffect(() => {
    if (isOpen && isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 100
          }
          return prev + 0.5
        })

        // Update current time based on progress
        const totalSeconds = 135 // 2:15 in seconds
        const currentSeconds = Math.floor((progress / 100) * totalSeconds)
        const minutes = Math.floor(currentSeconds / 60)
        const seconds = currentSeconds % 60
        setCurrentTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isOpen, isPlaying, progress])

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black">
        <div className="relative">
          {/* Video content */}
          <div className="aspect-video bg-black">
            <img
              src={`/placeholder.svg?height=720&width=1280&text=Video+Playback`}
              alt={video.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-none">
                {video.timestamp}
              </Badge>
              <span className="text-white text-sm">{video.location}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-black/50" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">{currentTime}</span>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="flex-1"
                  onValueChange={(value) => setProgress(value[0])}
                />
                <span className="text-white text-xs">{duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-black/50" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-black/50" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>
                <div>
                  <h3 className="text-white font-medium">{video.title}</h3>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-black/50" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

