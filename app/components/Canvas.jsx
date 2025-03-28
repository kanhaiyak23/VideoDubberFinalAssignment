"use client"

import { useEffect } from "react"



import { useRef, useState } from "react"
import { useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import { Box } from "@mantine/core"



export default function Canvas({
  mediaItems,
  selectedMediaId,
  setSelectedMediaId,
  onUpdateMedia,
  currentTime,
}) {
  const canvasRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedMediaId(null)
    }
  }

  return (
    <Box
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      {mediaItems.map((media) => {
        // Only show media if current time is between start and end time
        const isVisible = currentTime >= media.startTime && currentTime <= media.endTime

        if (!isVisible) return null

        return (
          <MediaItemComponent
            key={media.id}
            media={media}
            isSelected={media.id === selectedMediaId}
            onClick={() => setSelectedMediaId(media.id)}
            onUpdate={onUpdateMedia}
          />
        )
      })}
    </Box>
  )
}



function MediaItemComponent({ media, isSelected, onClick, onUpdate }) {
  const [resizing, setResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "MEDIA",
      item: media,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        const delta = monitor.getDifferenceFromInitialOffset()

        if (delta) {
          onUpdate({
            ...media,
            position: {
              x: media.position.x + delta.x,
              y: media.position.y + delta.y,
            },
          })
        }
      },
    }),
    [media, onUpdate],
  )

  // Use empty image as drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
    setInitialSize({ width: media.size.width, height: media.size.height })
  }

  const handleResizeMove = (e) => {
    if (!resizing) return

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y

    onUpdate({
      ...media,
      size: {
        width: Math.max(50, initialSize.width + deltaX),
        height: Math.max(50, initialSize.height + deltaY),
      },
    })
  }

  const handleResizeEnd = () => {
    setResizing(false)
  }

  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleResizeMove)
      window.addEventListener("mouseup", handleResizeEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove)
      window.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [resizing])

  return (
    <div
      ref={drag}
      onClick={onClick}
      style={{
        position: "absolute",
        left: media.position.x,
        top: media.position.y,
        width: media.size.width,
        height: media.size.height,
        border: isSelected ? "2px solid #4dabf7" : "none",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      {media.type === "video" ? (
        <video src={media.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls={false} />
      ) : (
        <img
          src={media.src || "/placeholder.svg"}
          alt="Media"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {isSelected && (
        <>
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              width: 16,
              height: 16,
              backgroundColor: "white",
              border: "2px solid #4dabf7",
              borderRadius: "50%",
              cursor: "nwse-resize",
              zIndex: 20,
            }}
          />
        </>
      )}
    </div>
  )
}

