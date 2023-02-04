import addresses from "@/contracts/addresses";
import useDevice from "@/hooks/useDevice";
import { IChatMessage } from "@/types";
import { Flex, HStack, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import AddressCopy from "../ui/AddressCopy";
import ABI_CHAT from "@/contracts/abi/Chat.json";

const Chat = ({ id }: {id: number}) => {
  const { isDesktopHeader } = useDevice();
  const [chatMessages, setChatMessages] = useState<IChatMessage[] | []>([]);

  const { data: chatData } = useContractRead({
    address: addresses[4].address as `0x${string}`,
    abi: ABI_CHAT,
    functionName: "getChat",
    args: [id],
  });

  useEffect(() => {
    if (Array.isArray(chatData)) {
      const decryptedData = chatData?.map((item: any) => {
        const sender = item?.sender.toString();
        const message = item?.message.toString();
        const sendTime = parseInt(item?.timestamp?._hex, 16) * 1000;
       
        const formattedSendTime = new Date(+sendTime).toLocaleDateString();
        console.log(formattedSendTime, message, sendTime)
        return {
          message,
          sender,
          time: formattedSendTime,
        }
      })
      setChatMessages(decryptedData);
    }
  }, [chatData])

  return (
    <Flex
      flexDir="column"
      gap="8px"
      maxW={isDesktopHeader[0] ? "517px" : "100%"}
      minH="465px"
      minW="400px"
      w="100%"
      bg="gray.800"
      p="32px 24px"
    >
      {chatMessages.map((msg) => (
        <>
          <Flex flexDir="column" gap="8px" mt="32px">
            <HStack spacing="8px">
              <AddressCopy address={msg.sender} color="gray.50" />
              <Text>{msg.message}</Text>
            </HStack>
            <Text ml="auto" mt={2} color="#ccc">{msg.time}</Text>
          </Flex>
        </>
      ))}
      <Flex marginTop="auto">
        <Input marginTop={2} borderRadius={0} placeholder="SEND MESSAGE..." />
      </Flex>
    </Flex>
  );
};

export default Chat;
