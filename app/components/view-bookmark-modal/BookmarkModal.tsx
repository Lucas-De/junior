import { fetchBookmarks, fetchBookmarksSummary } from "@/utils/api";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
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
import { ChangeEvent, useCallback, useState } from "react";
import _, { isEmpty } from "lodash";

import AiSummaryButton from "./AiSummaryButton";

interface Props {
  transcriptId: string;
  onClose: () => void;
}

export default function BookmarkModal(props: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const debounceSearch = useCallback(
    _.debounce((e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    }, 1000),
    []
  );

  const { data: directories, isLoading } = useQuery({
    queryKey: ["bookmarks", props.transcriptId, searchQuery],
    queryFn: () => fetchBookmarks(props.transcriptId, searchQuery),
    staleTime: 0, //no caching for now
    retry: false,
  });

  const isEmpty = !directories?.length;

  const exportCsv = () => {
    if (!directories) return;
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const data = directories?.reduce(
      (rows: any, dir) => [
        ...rows,
        ...dir.bookmarks.map((b) => ({
          directory: dir.name,
          text: b.text,
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
        <ModalHeader>
          <div>Bookmarks</div>
          <Flex justify="center" align="center" h="100%" gap={2} mt={4}>
            <Input placeholder="Search" onChange={debounceSearch} />
            <AiSummaryButton
              transcriptId={+props.transcriptId}
              disabled={isEmpty}
            />
          </Flex>
        </ModalHeader>
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
            isDisabled={isEmpty}
            onClick={exportCsv}
          >
            Export to CSV
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
