import { fetchBookmarksSummary } from "@/utils/api";
import {
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { BsStars } from "react-icons/bs";

interface Props {
  transcriptId: number;
  disabled?: boolean;
}

export default function AiSummaryButton({ transcriptId, disabled }: Props) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["summary", transcriptId],
    queryFn: () => fetchBookmarksSummary(transcriptId),
    staleTime: 60 * 1000, //cache for one minute
    retry: false,
    enabled: false, //manually fetch
  });

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          icon={<BsStars />}
          aria-label={"Summarize"}
          isLoading={isLoading}
          onClick={() => refetch()}
          isDisabled={disabled}
        />
      </PopoverTrigger>

      {data && (
        <PopoverContent>
          <PopoverCloseButton color="white" />
          <PopoverBody>
            <Flex justify="space-between" mb={1}>
              <Text fontWeight="medium" fontSize={16}>
                Summary:
              </Text>
              <PopoverCloseButton />
            </Flex>

            <Text fontWeight="400" fontSize={14}>
              {data.summary}
            </Text>
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
}
