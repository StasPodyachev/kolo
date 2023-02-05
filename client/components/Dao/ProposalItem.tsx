import { IStatus } from "@/types";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface IProps {
  title: string;
  id: string;
  status?: IStatus;
  buttonText?: string;
}

const ProposalItem = ({ title, id, status, buttonText }: IProps) => {
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
          <Text textStyle="smallText" color="gray.300">{id}</Text>
        </Flex>
        {buttonText ?
          <Button variant="blue" textStyle="button" w="272px">
            {buttonText}
          </Button>
          : <Box minW="272px" />
        }
      </Flex>
    </Flex>
  );
};

export default ProposalItem;
