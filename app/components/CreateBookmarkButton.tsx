import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsBookmarkPlus, BsPlus } from "react-icons/bs";
import CreateBookmarkModal from "./create-bookmark-modal/CreateBookmarkModal";
import { TranscriptQA } from "@/utils/types";

interface Props {
  visible: boolean;
  text?: string;
  quote?: TranscriptQA;
  onToggleModal: (active: boolean) => void;
}

export default function CreateBookmarkButton({
  visible,
  text,
  quote,
  onToggleModal,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!text || !quote) return;

  const openModal = () => {
    setIsModalOpen(true);
    onToggleModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onToggleModal(false);
  };

  return (
    <>
      {isModalOpen && (
        <CreateBookmarkModal quote={quote} text={text} onClose={closeModal} />
      )}

      <Button
        size="xs"
        variant="solid"
        colorScheme="yellow"
        position="absolute"
        bottom={2}
        right={2}
        visibility={visible ? "visible" : "hidden"}
        onClick={openModal}
      >
        Add Selection to Bookmarks
      </Button>
    </>
  );
}
