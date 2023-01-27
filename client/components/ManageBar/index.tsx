import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { CloseIcon, SearchIcon } from "@/icons";
import { useState } from "react";

const ManageBar: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Flex gap="32px" ml="auto">
      <InputGroup minH="52px" data-group>
        <InputLeftElement
          position="relative"
          top="6px"
          left="40px"
          children={
            <SearchIcon
              boxSize="24px"
              color="gray.500"
              transition="all .3s"
              _groupFocusWithin={{ color: "white" }}
            />
          }
        />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          minH="52px"
          placeholder="Search"
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="md"
          p="12px 16px 12px 48px"
          transition="all .3s"
          _focusVisible={{ boxShadow: "none" }}
          _focusWithin={{ borderColor: "white" }}
        />
        {searchQuery.length ? (
          <InputRightElement
            cursor="pointer"
            top="6px"
            right="4px"
            children={
              <CloseIcon
                boxSize="24px"
                color="gray.500"
                transition="all .3s"
                _hover={{ color: "white" }}
              />
            }
            onClick={() => setSearchQuery("")}
          />
        ) : null}
      </InputGroup>
      <Box
        w="100%"
        sx={{
          div: {
            height: "100%",
            alignItems: "center",
          },
          button: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minW: "fit-content",
            minH: "52px",
            borderRadius: "md",
          },
        }}
      >
        <ConnectButton label="CONNECT WALLET" />
      </Box>
    </Flex>
  );
};

export default ManageBar;
