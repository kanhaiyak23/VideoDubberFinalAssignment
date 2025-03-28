"use client"

import { useState, useEffect } from "react"
import { Box, Stack, Text, NumberInput, Group, Button } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"


export default function MediaPropertiesPanel({ media, onUpdateMedia, onDeleteMedia }) {
  const [width, setWidth] = useState(media.size.width)
  const [height, setHeight] = useState(media.size.height)
  const [startTime, setStartTime] = useState(media.startTime)
  const [endTime, setEndTime] = useState(media.endTime)

  // Update local state when selected media changes
  useEffect(() => {
    setWidth(media.size.width)
    setHeight(media.size.height)
    setStartTime(media.startTime)
    setEndTime(media.endTime)
  }, [media])

  const handleWidthChange = (value) => {
    if (!value || value < 50) return
    setWidth(value)
    onUpdateMedia({
      ...media,
      size: {
        ...media.size,
        width: value,
      },
    })
  }

  const handleHeightChange = (value) => {
    if (!value || value < 50) return
    setHeight(value)
    onUpdateMedia({
      ...media,
      size: {
        ...media.size,
        height: value,
      },
    })
  }

  const handleStartTimeChange = (value) => {
    if (value === undefined || value < 0) return
    const newStartTime = Math.min(value, endTime)
    setStartTime(newStartTime)
    onUpdateMedia({
      ...media,
      startTime: newStartTime,
    })
  }

  const handleEndTimeChange = (value) => {
    if (value === undefined || value < startTime) return
    setEndTime(value)
    onUpdateMedia({
      ...media,
      endTime: value,
    })
  }

  return (
    <Box
      w={250}
      p="md"
      style={{
        borderLeft: "1px solid #e0e0e0",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Stack spacing="md">
        <Text fw={600} size="lg">
          Media Properties
        </Text>

        <Box>
          <Text fw={500} size="sm" mb={5}>
            Dimensions
          </Text>
          <Group grow>
            <NumberInput label="Width" value={width} onChange={handleWidthChange} min={50} step={1} rightSection="px" />
            <NumberInput
              label="Height"
              value={height}
              onChange={handleHeightChange}
              min={50}
              step={1}
              rightSection="px"
            />
          </Group>
        </Box>

        <Box>
          <Text fw={500} size="sm" mb={5}>
            Timing
          </Text>
          <Group grow>
            <NumberInput
              label="Start Time"
              value={startTime}
              onChange={handleStartTimeChange}
              min={0}
              step={0.1}
              precision={1}
              rightSection="s"
            />
            <NumberInput
              label="End Time"
              value={endTime}
              onChange={handleEndTimeChange}
              min={startTime}
              step={0.1}
              precision={1}
              rightSection="s"
            />
          </Group>
        </Box>

        <Box>
          <Text fw={500} size="sm" mb={5}>
            File Info
          </Text>
          <Text size="sm">Type: {media.type}</Text>
          <Text size="sm" truncate>
            Name: {media.filename}
          </Text>
        </Box>

        <Button
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => onDeleteMedia(media.id)}
          variant="outline"
        >
          Delete Media
        </Button>
      </Stack>
    </Box>
  )
}

