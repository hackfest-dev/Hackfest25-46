"use client"

import { useState } from "react"
import { Search, Filter, Grid3X3, Grid2X2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CameraPreview } from "@/components/camera-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const cameras = [
  { id: "cam1", name: "Main Entrance", location: "Front Door", active: true },
  { id: "cam2", name: "Parking Lot", location: "North Side", active: true },
  { id: "cam3", name: "Lobby", location: "Reception Area", active: true },
  { id: "cam4", name: "Storage Room", location: "Basement", active: true },
  { id: "cam5", name: "Conference Room", location: "2nd Floor", active: true },
  { id: "cam6", name: "Side Entrance", location: "East Wing", active: false },
  { id: "cam7", name: "Hallway", location: "Main Building", active: true },
  { id: "cam8", name: "Cafeteria", location: "1st Floor", active: true },
]

export default function CamerasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [gridSize, setGridSize] = useState<"2x2" | "3x3">("2x2")

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Camera Feeds</h1>
        <p className="text-muted-foreground">View and search all surveillance cameras</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search cameras by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cameras</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-l-md ${gridSize === "2x2" ? "bg-muted" : ""}`}
              onClick={() => setGridSize("2x2")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-r-md ${gridSize === "3x3" ? "bg-muted" : ""}`}
              onClick={() => setGridSize("3x3")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Cameras</TabsTrigger>
          <TabsTrigger value="indoor">Indoor</TabsTrigger>
          <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
          <TabsTrigger value="alerts">With Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div
            className={`camera-grid ${
              gridSize === "2x2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredCameras.map((camera) => (
              <CameraPreview key={camera.id} name={camera.name} location={camera.location} active={camera.active} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="indoor" className="mt-4">
          <div
            className={`camera-grid ${
              gridSize === "2x2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredCameras
              .filter(
                (camera) =>
                  camera.location.includes("Floor") ||
                  camera.location.includes("Lobby") ||
                  camera.location.includes("Room"),
              )
              .map((camera) => (
                <CameraPreview key={camera.id} name={camera.name} location={camera.location} active={camera.active} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="outdoor" className="mt-4">
          <div
            className={`camera-grid ${
              gridSize === "2x2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredCameras
              .filter(
                (camera) =>
                  camera.location.includes("Parking") ||
                  camera.location.includes("Entrance") ||
                  camera.location.includes("Side"),
              )
              .map((camera) => (
                <CameraPreview key={camera.id} name={camera.name} location={camera.location} active={camera.active} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <div
            className={`camera-grid ${
              gridSize === "2x2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredCameras
              .filter((camera) => camera.id === "cam3" || camera.id === "cam4")
              .map((camera) => (
                <CameraPreview key={camera.id} name={camera.name} location={camera.location} active={camera.active} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

