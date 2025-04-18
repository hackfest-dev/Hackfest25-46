"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Send, Mic, ChevronDown, Play, Pause, Maximize2, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type MessageType = {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: Date
  videos?: {
    id: string
    title: string
    timestamp: string
    location: string
  }[]
  anomalies?: {
    type: string
    severity: "low" | "medium" | "high"
    description: string
  }[]
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})

  // Simulate initial message if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery)
    } else {
      // Add welcome message if no initial query
      setMessages([
        {
          id: "welcome",
          role: "ai",
          content:
            "Hello! I'm your AI video assistant. Ask me about any footage or events, and I'll find relevant clips for you.",
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (messageText: string = input) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      // Initialize playing state for any videos
      if (aiResponse.videos) {
        const newPlayingState: Record<string, boolean> = {}
        aiResponse.videos.forEach((video) => {
          newPlayingState[video.id] = true
        })
        setIsPlaying((prev) => ({ ...prev, ...newPlayingState }))
      }
    }, 2000)
  }

  const generateAIResponse = (query: string): MessageType => {
    // Sample responses based on query keywords
    if (query.toLowerCase().includes("after 11")) {
      return {
        id: Date.now().toString(),
        role: "ai",
        content:
          "I found 3 instances of people entering the building after 11 PM last night. Here are the relevant clips:",
        timestamp: new Date(),
        videos: [
          {
            id: "v1",
            title: "Main Entrance - 3 individuals",
            timestamp: "11:05 PM",
            location: "Front Lobby",
          },
          {
            id: "v2",
            title: "Side Entrance - 1 individual",
            timestamp: "11:32 PM",
            location: "Employee Entrance",
          },
        ],
      }
    } else if (query.toLowerCase().includes("parking") || query.toLowerCase().includes("car")) {
      return {
        id: Date.now().toString(),
        role: "ai",
        content: "I found several vehicles in the parking lot. Here are the most recent activities:",
        timestamp: new Date(),
        videos: [
          {
            id: "v3",
            title: "Blue sedan parking",
            timestamp: "2:15 PM",
            location: "North Parking Lot",
          },
        ],
        anomalies: [
          {
            type: "Unauthorized Parking",
            severity: "low",
            description: "Vehicle parked in reserved space",
          },
        ],
      }
    } else if (query.toLowerCase().includes("suspicious") || query.toLowerCase().includes("unusual")) {
      return {
        id: Date.now().toString(),
        role: "ai",
        content: "I detected some unusual activities in the last 24 hours. Here are the relevant clips:",
        timestamp: new Date(),
        videos: [
          {
            id: "v4",
            title: "Unusual movement near storage",
            timestamp: "1:42 AM",
            location: "Storage Area",
          },
        ],
        anomalies: [
          {
            type: "After Hours Activity",
            severity: "high",
            description: "Movement detected in restricted area after closing",
          },
        ],
      }
    } else {
      return {
        id: Date.now().toString(),
        role: "ai",
        content: "I've analyzed the footage based on your query. Here's what I found:",
        timestamp: new Date(),
        videos: [
          {
            id: "v5",
            title: "Recent activity",
            timestamp: "3:20 PM",
            location: "Main Area",
          },
        ],
      }
    }
  }

  const toggleVideoPlayback = (videoId: string) => {
    setIsPlaying((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-bold">AI Video Query Assistant</h1>
        <p className="text-sm text-muted-foreground">Ask about any footage or events to find relevant video clips</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4 pb-20">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-2">
              <div className={message.role === "user" ? "chat-message-user" : "chat-message-ai"}>{message.content}</div>

              {message.videos && message.videos.length > 0 && (
                <div className="ml-4 mt-2 space-y-4">
                  {message.videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="video-container relative aspect-video bg-black">
                        <img
                          src={`/placeholder.svg?height=240&width=420&text=Video+Clip`}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 text-white">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-none bg-primary/20 text-primary-foreground">
                              {video.timestamp}
                            </Badge>
                            <span className="text-xs">{video.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white hover:bg-black/50"
                              onClick={() => toggleVideoPlayback(video.id)}
                            >
                              {isPlaying[video.id] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-black/50">
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{video.title}</h3>
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{video.timestamp}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {message.anomalies && message.anomalies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  <h4 className="text-sm font-medium">Detected Anomalies:</h4>
                  {message.anomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-md border p-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/20">
                        <AlertTriangle className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{anomaly.type}</span>
                          <Badge
                            variant={
                              anomaly.severity === "high"
                                ? "destructive"
                                : anomaly.severity === "medium"
                                  ? "outline"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{anomaly.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-message-ai inline-block">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0" title="Voice input">
            <Mic className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Input
              className="pr-10"
              placeholder="Ask about any event or footage..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => handleSendMessage()}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="mx-auto mt-2 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("Show me all people entering after 11 PM")}>
              People after 11 PM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("Show suspicious activity in the parking lot")}>
              Suspicious activity
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("Find all vehicles in the north parking lot")}>
              Vehicles in parking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

