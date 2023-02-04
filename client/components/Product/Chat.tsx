import useDevice from "@/hooks/useDevice";
import { IChatMessage } from "@/types";
import { Flex, HStack, Input, Text } from "@chakra-ui/react";
import AddressCopy from "../ui/AddressCopy";

interface IProps {
  sellerAdress: string,
  messages: IChatMessage[],
}

const Chat = ({ sellerAdress, messages }: IProps) => {
  const { isDesktopHeader } = useDevice();
  return (
    <Flex
      flexDir="column"
      gap="8px"
      maxW={isDesktopHeader[0] ? "517px" : "100%"}
      minH="465px"
      minW="400px"
      bg="gray.800"
      p="32px 24px"
    >
      <AddressCopy address={sellerAdress} color="gray.50" />
      {messages.map((msg) => (
        <Flex flexDir="column" gap="8px" mt="32px">
          <HStack spacing="8px">
            <AddressCopy address={msg.sender} color="gray.50" />
            <Text>{msg.time}</Text>
          </HStack>
          <Text>{msg.message}</Text>
        </Flex>
      ))}
      <Flex>
        <Input placeholder="SEND MESSAGE..." />
      </Flex>
    </Flex>
  );
};

export default Chat;
