import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useMediaQuery,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { CloseIcon, SearchIcon } from "@/icons";
import { useState } from "react";
import ConnectBtn from "../ui/ConnectBtn";
import useDevice from "@/hooks/useDevice";

const ManageBar: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDesktop } = useDevice();
  const isShortenedInput = useMediaQuery("(max-width: 1470px)");
  return (
    <Flex gap={isDesktop[0] ? "32px" : "16px"} ml="auto">
      <InputGroup minH="52px" width="max-content" data-group>
        <InputLeftElement
          position="absolute"
          top="6px"
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
          position="relative"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          minH="52px"
          minW={isShortenedInput[0] ? "180px" : "304px"}
          maxW={isShortenedInput[0] ? "180px" : "304px"}
          placeholder="Search"
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="md"
          p={isDesktop[0] ? "12px 16px 12px 48px" : "12px 34px 12px 34px"}
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
      <ConnectBtn isHeaderButton />
    </Flex>
  );
};

export default ManageBar;
