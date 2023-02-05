import { IStatus } from "@/types";
import { Button, Flex, Text } from "@chakra-ui/react";

interface IProps {
  title: string;
  id: string;
  status: IStatus;
  buttonText: string;
}

const ProposalItem = ({ title, id, status, buttonText }: IProps) => {
  return (
    <Flex
      justifyContent="space-between"
      p="24px 20px 36px"
      border="1px solid"
      borderColor="gray.700"
    >
      <Flex flexDir="column" justifyContent="space-between">
        <Text textStyle="bigText" color="white">{title}</Text>
        <Text textStyle="smallText" color="gray.300">{id}</Text>
      </Flex>
      <Button variant="blue" textStyle="button" w="272px">
        {buttonText}
      </Button>
    </Flex>
  );
};

export default ProposalItem;
