import { Flex, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import ConnectBtn from "../ConnectBtn";

const PlugNotConnectedUser: NextPage = () => {
  return (
    <Flex
      bg="black"
      p="52px 94px"
      flexDir="column"
      w="max-content"
      m="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Heading variant="h6" color="gray.400" textStyle="button">
        to see your info
      </Heading>
      <ConnectBtn isCentered isNeedSmallMarginTop />
    </Flex>
  );
};

export default PlugNotConnectedUser;
