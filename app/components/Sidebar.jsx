"use client";

import { useState } from "react";
import { notifications } from "@mantine/notifications";


import {
  Stack,
  Text,
  Box,
  ThemeIcon,
  Flex,
  Group,
  Notification,
  Button,
} from "@mantine/core";
import {
  IconUpload,
  IconVideo,
  IconMusic,
  IconSubtask,
  IconLetterT,
  IconShape,
  IconSettings,
  IconFile,
  IconX,
} from "@tabler/icons-react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

export default function Sidebar({ onAddMedia }) {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

 

const handleDrop = (acceptedFiles) => {
  // Reject files inside folders
  const validFiles = acceptedFiles.filter((file) => !file.webkitRelativePath);

  if (validFiles.length !== acceptedFiles.length) {
    // Show a toast if a folder or its contents were dropped
    // notifications.show({
    //   title: "Folder Upload Not Allowed",
    //   message: "Please upload only individual images or videos.",
    //   color: "red",
    // });
    <Notification title="Folder Upload Not Allowedt">
      Please upload only individual images or videos.
    </Notification>
  }

  if (validFiles.length > 0) {
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    validFiles.forEach(onAddMedia);
  }
};



const handleReject = (rejected) => {
  if (rejected.length > 0) {
    // Show a toast notification when a file is rejected
    notifications.show({
      title: "File Rejected",
      message: "Some files were rejected. Check the list below for details.",
      color: "red",
    });
    <Notification title="Folder Upload Not Allowedt">
      Please upload only individual images or videos.
    </Notification>

    // Store rejected files in state
    setRejectedFiles((prev) => [...prev, ...rejected]);
  }
};

  const handleDismissError = () => {
    setRejectedFiles([]);
  };

  return (
    <Flex h="100vh" w="100%">
      {/* Sidebar */}
      <Stack w={120} h="100%" spacing={0} style={{ borderRight: "1px solid #eee", paddingTop: 20 }}>
        {[{ icon: <IconVideo size={24} />, label: "Video", active: true },
          { icon: <IconMusic size={24} />, label: "Audio" },
          { icon: <IconSubtask size={24} />, label: "Subtitles" },
          { icon: <IconLetterT size={24} />, label: "Text" },
          { icon: <IconShape size={24} />, label: "Elements" },
          { icon: <IconSettings size={24} />, label: "Settings" }].map((item, index) => (
          <Stack key={index} align="center" py="md" spacing={5} style={{ cursor: "pointer", backgroundColor: item.active ? "#f0f0f0" : "transparent", width: "100%" }}>
            {item.icon}
            <Text size="xs">{item.label}</Text>
          </Stack>
        ))}
      </Stack>

      {/* Main Content */}
      <Stack w="100%" h="100%">
        <Box p="md">
          <Text fw={600} size="lg">Add Media</Text>
        </Box>

        <Box p="md" style={{ flex: 1 }}>
          {/* Dropzone with animation */}
          <Dropzone
  onDrop={handleDrop}
  onReject={handleReject}
  accept={["image/*", "video/*"]} // Allow only images and videos
  maxSize={5 * 1024 ** 2} // 5MB max file size
  multiple={true} // Allow multiple files but no folders
  onDragEnter={() => setIsDragging(true)}
  onDragLeave={() => setIsDragging(false)}
  style={{
    border: `2px dashed ${isDragging ? "#228be6" : "#ccc"}`,
    backgroundColor: isDragging ? "#f0f8ff" : "transparent",
    borderRadius: 8,
    padding: 20,
    textAlign: "center",
    marginBottom: 20,
    transition: "border 0.2s ease, background-color 0.2s ease",
  }}
>
  <Stack align="center" spacing="xs">
    <ThemeIcon size={48} radius="xl" variant="light">
      <IconUpload size={24} />
    </ThemeIcon>
    <Text fw={500}>Upload a File</Text>
    <Text size="sm" c="dimmed">Drag & drop an image or video, or click to select</Text>
  </Stack>
</Dropzone>


          {/* Show Rejected Files */}
          {rejectedFiles.length > 0 && (
            <Notification
              color="red"
              title="File Rejected"
              mt="md"
              icon={<IconX size={18} />}
              onClose={handleDismissError}
            >
              {rejectedFiles.map((file, index) => (
                <Text key={index} size="sm">
                  ❌ {file.file.name} - Invalid type or exceeds 5MB
                </Text>
              ))}
            </Notification>
          )}

          {/* List Uploaded Files */}
          {files.length > 0 && (
            <Stack mt="md">
              {files.map((file, index) => (
                <Group key={index} spacing="sm">
                  <IconFile size={20} />
                  <Text size="sm">{file.name}</Text>
                </Group>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}
