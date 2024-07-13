import { VStack, Text, Flex } from "@chakra-ui/react";
import { BsChevronDown, BsChevronRight, BsFolder } from "react-icons/bs";
import BookmarkListItem from "./BookmarkListItem";
import { BookmarkDirectory } from "@/utils/types";
import { useState } from "react";

interface Props {
  directory: BookmarkDirectory;
}

export default function BookmarkDirectoryListItem({ directory }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <VStack align="stretch" gap={2} key={directory.id}>
      <Flex
        align="center"
        gap={2}
        onClick={() => setIsOpen((v) => !v)}
        cursor="pointer"
      >
        {isOpen && <BsChevronDown size={14} />}
        {!isOpen && <BsChevronRight size={14} />}
        <Text fontSize="medium" fontWeight="bold">
          {directory.name}
        </Text>
      </Flex>
      {isOpen && (
        <VStack align="stretch" gap={2}>
          {directory.bookmarks.map((bookmark) => (
            <BookmarkListItem bookmark={bookmark} key={bookmark.id} />
          ))}
        </VStack>
      )}
    </VStack>
  );
}
