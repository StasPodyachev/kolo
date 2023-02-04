import addresses from "@/contracts/addresses";
import useDevice from "@/hooks/useDevice";
import { IChatMessage } from "@/types";
import { Box, Button, Flex, Heading, HStack, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import AddressCopy from "../ui/AddressCopy";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import ABI_CHAT from "@/contracts/abi/Chat.json";
import { SendIcon } from "@/icons";
import { useTransactionManager } from "@/context/TransactionManageProvider";

const Chat = ({ id }: {id: number}) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const { isDesktopHeader } = useDevice();
  const [chatMessages, setChatMessages] = useState<IChatMessage[] | []>([]);
  const [message, setMessage] = useState(" ");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { address } = useAccount();

  const { data: chatData } = useContractRead({
    address: addresses[4].address as `0x${string}`,
    abi: ABI_CHAT,
    functionName: "getChat",
    args: [id],
  });

  const { config } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: "sendMessage",
    args: [id, message],
  })

  const { write, isLoading, isSuccess, data } = useContractWrite(config);

  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading, onConfirm])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
      // push('/dashboard')
    }
  }, [data])

  useEffect(() => {

    let id = 1
    if (Array.isArray(chatData)) {
      const decryptedData = chatData?.map((item: any) => {
        const sender = item?.sender.toString();
        const message = item?.message.toString();
        const sendTime = parseInt(item?.timestamp?._hex, 16) * 1000;
        const formattedSendTime = new Date(+sendTime).toLocaleString();
        return {
          message,
          sender,
          time: formattedSendTime,
          id: id++
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
      h="465px"
      minW="400px"
      w="100%"
      bg="gray.800"
      p="32px 0 0 0"
      position="relative"
    >
      <Heading variant="h6" color="white" textAlign="center">Chat</Heading>
      <Box overflowY="scroll" px="24px">
        {chatMessages.map((msg) => (
            <Flex key={msg?.id} flexDir="column" gap="8px" mt="32px">
              <HStack
                spacing="8px"
                h="max-content"
                alignItems="flex-start"
                bg="#D9D9D91A"
                p="8px 6px"
              >
                {msg.sender === "0x0000000000000000000000000000000000000000"
                  ? <Text color="white" minW="max-content">System: </Text>
                  : <AddressCopy address={msg.sender} color={msg.sender === address ? "green.primary" : "gray.50"} />
                }
                <Text color="gray.400">{msg.message}</Text>
              </HStack>
              <Text textStyle="smallText" ml="auto" color="#ccc">
                {msg.time}
              </Text>
            </Flex>
        ))}
      </Box>
      <Flex
        marginTop="auto"
        position="sticky"
        mr="20px"
        minW="100%"
      >
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          w="90%"
          p="24px 18px"
          color="white"
          bg="gray.700"
          marginTop={2}
          borderRadius={0}
          placeholder="SEND MESSAGE..."
          border="none"
          _placeholder={{ color: 'gray.200'}}
          _focusVisible={{ outline: 'none' }}
        />
        <Button
          onClick={() => {
            setIsOpenModal(true);
            write?.();
            setMessage("");
          }}
          mt={2}
          bg="gray.700"
          transition="all .3s"
          data-group
          _hover={{ bg: "gray.700" }}
        >
          <SendIcon
            boxSize="24px"
            transition="all .3s"
            fillOpacity={0.25}
            _groupHover={{ fillOpacity: 1 }}
          />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Chat;
