import { fetchBookmarks } from "@/utils/api";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import BookmarkDirectoryListItem from "./BookmarkDirectoryListItem";
import { mkConfig, generateCsv, download } from "export-to-csv";

interface Props {
  transcriptId: string;
  onClose: () => void;
}

export default function BookmarkModal(props: Props) {
  const { data: directories, isLoading } = useQuery({
    queryKey: ["bookmarks", props.transcriptId],
    queryFn: () => fetchBookmarks(props.transcriptId),
    staleTime: 0,
    retry: false,
  });

  const exportCsv = () => {
    if (!directories) return;
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const data = directories?.reduce(
      (rows: any, dir) => [
        ...rows,
        ...dir.bookmarks.map((b) => ({
          directory: dir.name,
          quote: b.quote,
          question: b.question,
        })),
      ],
      []
    );
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  return (
    <Modal
      isOpen={true}
      onClose={props.onClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bookmarks</ModalHeader>
        <ModalCloseButton />
        <Box display="block" overflowY="scroll" h={400} px={6} pb={6}>
          {isLoading && (
            <Flex justify="center" align="center" h="100%">
              <Spinner />
            </Flex>
          )}

          {directories && (
            <VStack gap={4} align="stretch">
              {directories.map((directory) => (
                <BookmarkDirectoryListItem
                  directory={directory}
                  key={directory.id}
                />
              ))}
            </VStack>
          )}
        </Box>
        <ModalFooter>
          <Button
            variant="ghost"
            size="sm"
            disabled={!directories}
            onClick={exportCsv}
          >
            Export to CSV
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
