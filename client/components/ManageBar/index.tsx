import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { SearchIcon } from "@/icons";

const ManageBar: NextPage = () => {
  const { isConnected } = useAccount();
  return (
    <Flex gap="32px" w="max-content">
      <InputGroup minH="52px">
        <InputLeftElement
          position="relative"
          top="6px"
          left="40px"
          children={<SearchIcon boxSize="24px" color="gray.500" />}
        />
        <Input
          minH="52px"
          placeholder="Search"
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="md"
          p="12px 16px 12px 48px"
          _focusVisible={{ boxShadow: "none" }}
        />
      </InputGroup>
      <Box
        w="100%"
        sx={{
          button: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minW: isConnected ? "100%" : "194px",
            height: "52px",
          },
        }}
      >
        <ConnectButton label="CONNECT WALLET" />
      </Box>
    </Flex>
  );
};

export default ManageBar;
