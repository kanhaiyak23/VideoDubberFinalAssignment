import { Group, Title, Button, ActionIcon } from "@mantine/core"
import {
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
  IconQuestionMark,
  IconShare,
  IconUpgrade,
  IconCheck,
} from "@tabler/icons-react"


export default function Header() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Group justify="space-between" h="100%" px="md" style={{ borderBottom: "1px solid #e0e0e0" }}>
      <Group>
        <Title order={4}>KANHAIYA SINGH's Video - {currentDate}</Title>
      </Group>

      <Group>
        <ActionIcon variant="subtle" color="gray">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray">
          <IconArrowRight size={20} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray">
          <IconSearch size={20} />
        </ActionIcon>
        
        <Button variant="subtle" leftSection={<IconShare size={20} />}>
          Share
        </Button>
        <Button color="orange" 
        leftSection={<IconShare size={20} />}>
          Upgrade
        </Button>
        <Button color="blue" leftSection={<IconCheck size={20} />}>
          Done
        </Button>
      </Group>
    </Group>
  )
}

