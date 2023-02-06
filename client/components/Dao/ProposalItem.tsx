import { sliceVoteId } from "@/helpers";
import { IStatus } from "@/types";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  title: string;
  id: string;
  status?: IStatus;
  buttonText?: string;
  onClickHandler: Dispatch<SetStateAction<boolean>>;
  setVoteTitle: Dispatch<SetStateAction<string>>;
}

const ProposalItem = ({ title, id, status, buttonText, onClickHandler, setVoteTitle }: IProps) => {
  return (
    <Flex flexDir="column">
      <Box
        mr="20px"
        alignSelf="flex-end"
        bg={status?.color}
        color="white"
        minW="120px"
        minH="16px"
        textAlign="center"
      >
        {status?.title}
      </Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="24px 20px 36px"
        border="1px solid"
        borderColor="gray.700"
      >
        <Flex flexDir="column" gap="12px">
          <Text textStyle="bigText" color="white">{title}</Text>
          <Text textStyle="smallText" color="gray.300">{sliceVoteId(id)}</Text>
        </Flex>
        {buttonText ?
          <Button variant="blue" textStyle="button" w="272px">
            {buttonText}
          </Button>
          : buttonText === "vote" && onClickHandler
            ? <Button variant="blue" textStyle="button" w="272px" onClick={() => {
                setVoteTitle(title);
                onClickHandler(true);
              }}>
                {buttonText}
              </Button>
            : <Box minW="272px" />
        }
      </Flex>
    </Flex>
  );
};

export default ProposalItem;
