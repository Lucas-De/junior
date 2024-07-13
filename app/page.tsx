"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fetchTranscript } from "@/utils/api";
import { TranscriptQA, TranscriptWithQA } from "@/utils/types";
import { BsBookmark } from "react-icons/bs";
import CreateBookmarkButton from "./components/CreateBookmarkButton";
import BookmarkModal from "./components/view-bookmark-modal/BookmarkModal";

interface SelectedTextState {
  quote: TranscriptQA;
  selection: string;
}

const Home = () => {
  const [transcripts, setTranscripts] = useState<TranscriptWithQA[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [bookmarkModalId, setBookmarkModalId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<SelectedTextState | null>(
    null
  );

  //save text selection when user highlights quote substring
  const captureQuoteSelection = (quote: TranscriptQA) => {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText({ quote, selection });
  };

  //reset text selection when user clicks somewhere  on page
  const handleSelectionChange = () => {
    const selection = window.getSelection()?.toString();
    if (!selection) setSelectedText(null);
  };

  useEffect(() => {
    // document.addEventListener("mouseup", handleSelectionChange);
    setLoading(true);
    fetchTranscript()
      .then((data) => {
        setTranscripts(data.transcripts);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      // document.removeEventListener("mouseup", handleSelectionChange);
    };
  }, []);

  return (
    <HStack align="flex-start" height="full" width="full" spacing={0}>
      {/* Navigation Sidebar */}
      <Box
        maxWidth="250px"
        width="full"
        bg="gray.100"
        p={4}
        height="100vh"
        position="sticky"
        top={0}
      >
        <VStack align="stretch" width="full" spacing={2}>
          {transcripts?.map(({ transcript }) => (
            <Link
              p={2}
              key={transcript.id}
              href={`#${transcript.id}`}
              borderRadius="md"
              _hover={{ bg: "teal.100" }}
            >
              <Text fontSize="sm">{transcript.interview_name}</Text>
            </Link>
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
      <VStack
        p={8}
        spacing={8}
        align="stretch"
        bg="gray.50"
        borderRadius="md"
        boxShadow="lg"
        w="full"
      >
        {bookmarkModalId && (
          <BookmarkModal
            transcriptId={bookmarkModalId}
            onClose={() => setBookmarkModalId(null)}
          />
        )}

        {loading && <Box>Loading...</Box>}

        {transcripts?.map(({ transcript, quotes }) => (
          <Box
            id={transcript.id}
            key={transcript.id}
            p={6}
            bg="white"
            borderRadius="md"
            boxShadow="md"
          >
            <Heading size="md" mb={4} color="teal.600">
              Interview
            </Heading>
            <Text fontSize="lg" mb={6} color="gray.700">
              {transcript.interview_name}
            </Text>

            <Flex gap={4} mb={4} align="center">
              <Heading size="md" color="teal.600">
                Quotes
              </Heading>
              <Button
                variant="ghost"
                size="xs"
                leftIcon={<BsBookmark fontWeight={900} />}
                onClick={() => setBookmarkModalId(transcript.id)}
              >
                View Bookmarks
              </Button>
            </Flex>

            <VStack align="stretch" spacing={6}>
              {quotes?.map((quote) => (
                <VStack
                  key={quote.id}
                  align="stretch"
                  borderWidth={1}
                  borderRadius="md"
                  spacing={4}
                  p={6}
                  bg="gray.100"
                  boxShadow="sm"
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color="teal.700"
                    display="inline"
                  >
                    {quote.question}{" "}
                    <CreateBookmarkButton
                      quote={selectedText?.quote}
                      text={selectedText?.selection}
                      visible={selectedText?.quote.id == quote.id}
                    />
                  </Text>
                  <Text
                    fontSize="md"
                    color="gray.800"
                    onMouseUp={(e) => captureQuoteSelection(quote)}
                  >
                    {quote.answer}
                  </Text>
                </VStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </HStack>
  );
};

export default Home;
