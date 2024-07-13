import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { BsBookmarkPlus, BsPlus } from "react-icons/bs";
import CreateBookmarkModal from "./create-bookmark-modal/CreateBookmarkModal";
import { TranscriptQA } from "@/utils/types";

interface Props {
  visible: boolean;
  text?: string;
  quote?: TranscriptQA;
}

export default function CreateBookmarkButton({ visible, text, quote }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!text || !quote) return;

  return (
    <>
      {isModalOpen && (
        <CreateBookmarkModal
          quote={quote}
          text={text}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Button
        size="xs"
        variant="solid"
        colorScheme="yellow"
        ml={2}
        visibility={visible ? "visible" : "hidden"}
        onClick={() => setIsModalOpen(true)}
      >
        Add Selection to Bookmarks
      </Button>
    </>
  );
}
