"use client";

import { useRef } from "react";
import { Box, Group, ActionIcon, Text, Slider, Button } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconScissors,
  IconDownload,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";

export default function Timeline({
  mediaItems,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  duration,
  selectedMediaId,
  setSelectedMediaId,
}) {
  const timelineRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${Math.floor((seconds % 1) * 10)}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentTime(0);
  };

  const handleSkipForward = () => {
    const maxEndTime = Math.max(...mediaItems.map((item) => item.endTime), duration);
    setCurrentTime(maxEndTime);
  };

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // Get click position relative to the timeline
    const newTime = (clickX / rect.width) * duration; // Convert position to time

    setCurrentTime(newTime); // Update currentTime state
  };

  const minStartTime = Math.min(...mediaItems.map((item) => item.startTime), 0);
  const maxEndTime = Math.max(...mediaItems.map((item) => item.endTime), duration);
  const downloadRange = `(${formatTime(minStartTime)} - ${formatTime(maxEndTime)})`;

  return (
    <Box
      style={{
        borderTop: "1px solid #e0e0e0",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Group position="apart" mb={10}>
        <Group>
          <Button leftSection={<IconScissors size={16} />} variant="subtle" size="sm">
            Split
          </Button>
          <Button leftSection={<IconDownload size={16} />} variant="subtle" size="sm">
            Download Section {downloadRange}
          </Button>
        </Group>

        <Group>
          <ActionIcon onClick={handleSkipBack} variant="subtle" size="lg">
            <IconPlayerSkipBack size={20} />
          </ActionIcon>
          <ActionIcon
            onClick={handlePlayPause}
            variant="filled"
            radius="xl"
            size="lg"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
          </ActionIcon>
          <ActionIcon onClick={handleSkipForward} variant="subtle" size="lg">
            <IconPlayerSkipForward size={20} />
          </ActionIcon>
          <Text style={{ minWidth: "120px", textAlign: "center" }}>
            {formatTime(currentTime)} / {formatTime(maxEndTime)}
          </Text>
        </Group>

        <Group>
          <ActionIcon variant="subtle">
            <IconZoomIn size={20} />
          </ActionIcon>
          <Slider defaultValue={50} w={100} size="sm" />
          <ActionIcon variant="subtle">
            <IconZoomOut size={20} />
          </ActionIcon>
          <Button variant="subtle" size="sm">
            Fit
          </Button>
        </Group>
      </Group>

      <Box style={{ position: "relative", marginTop: 20 }} ref={timelineRef} onClick={handleTimelineClick}>
        {/* Time markers */}
        <Group position="apart" style={{ marginBottom: 5 }}>
          {[0, 1, 2, 3, 4, 5].map((time) => (
            <Text
              key={time}
              size="xs"
              c="dimmed"
              style={{
                position: "relative",
                left: time === 0 ? 0 : `${(time / 5) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {time}s
            </Text>
          ))}
        </Group>

        {/* Timeline ruler */}
        <Box
          style={{
            height: 20,
            width: "100%",
            position: "relative",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((time) => (
            <Box
              key={time}
              style={{
                position: "absolute",
                left: `${(time / 5) * 100}%`,
                height: 10,
                width: 1,
                backgroundColor: "#adb5bd",
                top: 0,
              }}
            />
          ))}

          {Array.from({ length: 50 }).map((_, i) => (
            <Box
              key={i}
              style={{
                position: "absolute",
                left: `${(i / 50) * 100}%`,
                height: i % 10 === 0 ? 0 : 5,
                width: 1,
                backgroundColor: "#dee2e6",
                top: 0,
              }}
            />
          ))}
        </Box>

        {/* Media item indicators */}
        <Box style={{ position: "relative", height: 40, marginTop: 10 }}>
          {mediaItems.map((item) => {
            const startPercent = (item.startTime / duration) * 100;
            const endPercent = (item.endTime / duration) * 100;
            const width = endPercent - startPercent;

            return (
              <Box
                key={item.id}
                onClick={() => setSelectedMediaId(item.id)}
                style={{
                  position: "absolute",
                  left: `${startPercent}%`,
                  width: `${width}%`,
                  height: 30,
                  backgroundColor: "#ff6b6b",
                  border: "1px solid #fa5252",
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontSize: 12,
                  color: "white",
                  padding: "0 8px",
                }}
              >
                {item.filename}
              </Box>
            );
          })}
        </Box>

        {/* Current time indicator */}
        <Box
          style={{
            position: "absolute",
            left: `${(currentTime / duration) * 100}%`,
            top: 0,
            height: "100%",
            width: 2,
            backgroundColor: "#4dabf7",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </Box>
    </Box>
  );
}
