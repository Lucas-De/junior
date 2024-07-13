import { Bookmark } from "@/utils/types";
import { VStack, Text } from "@chakra-ui/react";

interface Props {
  bookmark: Bookmark;
}

export default function BookmarkListItem({ bookmark }: Props) {
  return (
    <VStack
      key={bookmark.id}
      align="stretch"
      borderWidth={1}
      borderRadius="md"
      spacing={0}
      p={2}
      bg="gray.100"
      boxShadow="sm"
    >
      <Text fontSize="medium">&quot;{bookmark.quote}&quot;</Text>
      <Text fontSize="smaller" color="gray.500">
        {bookmark.question}
      </Text>
    </VStack>
  );
}
