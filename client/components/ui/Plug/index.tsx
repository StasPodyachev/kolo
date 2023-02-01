import { Flex, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import ConnectBtn from "../ConnectBtn";

interface IProps {
  title: string;
  isNeedConnectBtn?: boolean;
}

const Plug = ({ title, isNeedConnectBtn }: IProps) => {
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
        {title}
      </Heading>
      {isNeedConnectBtn ? (
        <ConnectBtn isCentered isNeedSmallMarginTop />
      ) : null}
    </Flex>
  );
};

export default Plug;
