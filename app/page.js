"use client"
import { useEffect, useState } from "react"
import { AppShell, MantineProvider } from "@mantine/core"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Sidebar from "./components/Sidebar"
import Canvas from "./components/Canvas"
import Timeline from "./components/Timeline"
import Header from "./components/Header"
import MediaPropertiesPanel from "./components/MediaPropertiesPanel"

export default function Home() {
  const [mediaItems, setMediaItems] = useState([])
  const [selectedMediaId, setSelectedMediaId] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(60) // Default 60 seconds
  const [stopTime, setStopTime] = useState(null) // Stop time when "use client" is detected

  const selectedMedia = mediaItems.find((item) => item.id === selectedMediaId)

  const handleAddMedia = (file) => {
    const newMedia = {
      id: `media-${Date.now()}`,
      type: file.type.startsWith("video") ? "video" : "image",
      src: URL.createObjectURL(file),
      position: { x: 100, y: 100 },
      size: { width: 320, height: 240 },
      startTime: 0,
      endTime: file.type.startsWith("video") ? 10 : 5, // Default 10s for video, 5s for images
      filename: file.name,
    }

    setMediaItems([...mediaItems, newMedia])
    setSelectedMediaId(newMedia.id)
  }

  const handleUpdateMedia = (updatedMedia) => {
    setMediaItems(mediaItems.map((item) => (item.id === updatedMedia.id ? updatedMedia : item)))
  }

  const handleDeleteMedia = (id) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id))
    if (selectedMediaId === id) {
      setSelectedMediaId(null)
    }
  }

  useEffect(() => {
    let interval

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1
          const maxEndTime = Math.max(...mediaItems.map((item) => item.endTime), duration)

          // Stop when the video reaches "use client" timestamp
          if (stopTime !== null && newTime >= stopTime) {
            setIsPlaying(false)
            return stopTime
          }

          if (newTime >= maxEndTime) {
            setIsPlaying(false)
            return maxEndTime
          }

          return newTime
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, duration, mediaItems, stopTime])

  // Simulating getting the timestamp of "use client" in the video
  useEffect(() => {
    // Assume we get the timestamp dynamically from subtitles or an API
    const fetchTimestamp = async () => {
      // Replace this with real logic to extract the timestamp of "use client"
      const detectedTimestamp = 5.2 // Example: Stop at 5.2s
      setStopTime(detectedTimestamp)
    }

    fetchTimestamp()
  }, [])

  return (
    <MantineProvider>
      <DndProvider backend={HTML5Backend}>
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: "sm" }} padding={0}>
          <AppShell.Header>
            <Header />
          </AppShell.Header>

          <AppShell.Navbar>
            <Sidebar onAddMedia={handleAddMedia} />
          </AppShell.Navbar>

          <AppShell.Main style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flex: 1 }}>
              <div style={{ flex: 1, backgroundColor: "#1a1a1a", position: "relative" }}>
                <Canvas
                  mediaItems={mediaItems}
                  selectedMediaId={selectedMediaId}
                  setSelectedMediaId={setSelectedMediaId}
                  onUpdateMedia={handleUpdateMedia}
                  currentTime={currentTime}
                />
              </div>

              {selectedMedia && (
                <MediaPropertiesPanel
                  media={selectedMedia}
                  onUpdateMedia={handleUpdateMedia}
                  onDeleteMedia={handleDeleteMedia}
                />
              )}
            </div>

            <Timeline
              mediaItems={mediaItems}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              duration={duration}
              selectedMediaId={selectedMediaId}
              setSelectedMediaId={setSelectedMediaId}
            />
          </AppShell.Main>
        </AppShell>
      </DndProvider>
    </MantineProvider>
  )
}
