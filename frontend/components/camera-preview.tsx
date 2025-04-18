"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CameraPreviewProps {
  name: string
  location: string
  active?: boolean
}

export function CameraPreview({ name, location, active = true }: CameraPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="video-container relative aspect-video bg-black">
        <img
          src={`/placeholder.svg?height=180&width=320&text=Camera+Feed`}
          alt={`${name} camera feed`}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 text-white">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${active ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"} border-none`}
            >
              {active ? "LIVE" : "OFFLINE"}
            </Badge>
            <span className="text-xs">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-black/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-black/50">
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </div>
  )
}

