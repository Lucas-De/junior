'use client';

import { useState, useEffect } from 'react';
import { Box, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react';
// import BookmarkForm from '@/components/BookmarkForm';
// import BookmarkList from '@/components/BookmarkList';
import { fetchTranscript, addBookmark, fetchBookmarks } from '@/utils/api';
import { Transcript, TranscriptQA, TranscriptWithQA } from '@/utils/types';

const Home = () => {
  const [transcripts, setTranscripts] = useState<TranscriptWithQA[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTranscript()
      .then((data) => {
        setTranscripts(data.transcripts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
              _hover={{ bg: 'teal.100' }}
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

            <Heading size="md" mb={4} color="teal.600">
              Quotes
            </Heading>

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
                  <Text fontWeight="bold" fontSize="lg" color="teal.700">
                    {quote.question}
                  </Text>
                  <Text fontSize="md" color="gray.800">
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
