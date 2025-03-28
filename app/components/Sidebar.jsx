"use client"

import { useState } from "react"
import { Stack, Text, Group, Button, FileButton, Box, ThemeIcon,Flex } from "@mantine/core"
import {
  IconUpload,
  IconVideo,
  IconMusic,
  IconSubtask,
  IconLetterT,
  IconShapes,
  IconSettings,
} from "@tabler/icons-react"
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import {  IconFile, IconX } from "@tabler/icons-react";
import { IconShape } from "@tabler/icons-react"

export default function Sidebar({ onAddMedia }) {
  const [files, setFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach(onAddMedia); // Call onAddMedia for each file
  };


  const sidebarItems = [
    { icon: <IconVideo size={24} />, label: "Video", active: true },
    { icon: <IconMusic size={24} />, label: "Audio" },
    { icon: <IconSubtask size={24} />, label: "Subtitles" },
    { icon: <IconLetterT size={24} />, label: "Text" },
    { icon: <IconShape size={24} />, label: "Elements" },
    { icon: <IconSettings size={24} />, label: "Settings" },
  ]

  return (
<Flex h="100vh" w="100%">
      {/* Sidebar */}
      <Stack
        w={120} // Sidebar width
        h="100%"
        spacing={0}
        style={{ borderRight: "1px solid #eee", paddingTop: 20 }}
      >
        {sidebarItems.map((item, index) => (
          <Stack
            key={index}
            align="center"
            py="md"
            spacing={5}
            style={{
              cursor: "pointer",
              backgroundColor: item.active ? "#f0f0f0" : "transparent",
              width: "100%",
            }}
          >
            {item.icon}
            <Text size="xs">{item.label}</Text>
          </Stack>
        ))}
      </Stack>

      {/* Main Content */}
      <Stack w="100%" h="100%">
        <Box p="md">
          <Text fw={600} size="lg">
            Add Media
          </Text>
        </Box>

        <Box p="md" style={{ flex: 1 }}>
          {/* Dropzone for Drag & Drop Upload */}
          <Dropzone
            onDrop={handleDrop}
            onReject={(files) => console.log("Rejected files:", files)}
            accept={[MIME_TYPES.image, MIME_TYPES.video]}
            maxSize={5 * 1024 ** 2} // 5MB max file size
            style={{
              border: "1px dashed #ccc",
              borderRadius: 8,
              padding: 20,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <Stack align="center" spacing="xs">
              <ThemeIcon size={48} radius="xl" variant="light">
                <IconUpload size={24} />
              </ThemeIcon>
              <Text fw={500}>Upload a File</Text>
              <Text size="sm" c="dimmed">
                Drag & drop a file or click to select
              </Text>
            </Stack>
          </Dropzone>

          
          
        </Box>
      </Stack>
    </Flex>

  )
}

