import {
  Button,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import _ from "lodash";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBookmark, fetchBookmarksDirectories } from "@/utils/api";
import { TranscriptQA } from "@/utils/types";

interface Props {
  quote: TranscriptQA;
  text: string;
  onClose: () => void;
}

export default function CreateBookmarkModal({ text, quote, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewFolder, setIsNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number>();

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const dir = isNewFolder
        ? { newName: newFolderName }
        : { id: selectedDirectoryId };
      await addBookmark(text, +quote.transcript_id, +quote.id, dir);
    },
    onSuccess: onClose,
  });

  const { data: directories, isLoading } = useQuery({
    queryKey: ["bookmarks-dir", quote.transcript_id],
    queryFn: () => fetchBookmarksDirectories(quote.transcript_id),
    staleTime: 0,
    retry: false,
  });

  return (
    <Modal isOpen={true} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <VStack p={3} gap={3} align="stretch">
          <Text fontSize={20}>“{text}”</Text>

          {isNewFolder ? (
            <Input
              autoFocus
              placeholder="New Folder"
              size="sm"
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          ) : (
            <Select
              placeholder="Select Folder"
              isRequired
              size="sm"
              icon={isLoading ? <Spinner /> : undefined}
              onChange={(e) => setSelectedDirectoryId(+e.target.value)}
            >
              {directories?.map((d) => (
                <option value={d.id} key={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          )}

          <Flex justify="end" gap={2}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNewFolder((v) => !v)}
            >
              {isNewFolder ? "Select Existing Folder" : "New Folder"}
            </Button>
            <Button
              variant="solid"
              size="sm"
              colorScheme="blue"
              isLoading={isSaving}
              onClick={() => save()}
            >
              Save
            </Button>
          </Flex>
        </VStack>
      </ModalContent>
    </Modal>
  );
}
