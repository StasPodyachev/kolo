import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { NextPage } from "next";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon } from "@/icons";
import Link from "next/link";

const ItemCard: NextPage = () => {
  return (
    <Link href="/">
      <Box minW="304px" minH="435px" bg="white">
        <Flex
          justifyContent="center"
          alignItems="center"
          h="240px"
          bg="gray.800"
        >
          <Image src={CardImage} alt="card image" />
        </Flex>
        <Flex
          h="195px"
          flexDir="column"
          justifyContent="space-between"
          p="18px 16px"
        >
          <Flex flexDir="column" gap="6px">
            <Flex justifyContent="space-between">
              <Text textStyle="bigText" color="gray.900">
                Tree planting plan
              </Text>
              <Text textStyle="bigText" color="gray.900">
                32 FIL
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text textStyle="smallText" color="gray.300">
                Owned by
              </Text>
              <Text textStyle="smallText" color="gray.300">
                0x9D21...7a88
              </Text>
            </Flex>
            <Flex
              justifyContent="space-between"
              position="relative"
              bottom="112px"
            >
              <Text textStyle="smallText" color="gray.300">
                Sale ends
              </Text>
              <Text textStyle="smallText" color="gray.300">
                28 Feb 2023
              </Text>
            </Flex>
            <Box
              alignSelf="flex-end"
              position="relative"
              bottom="328px"
              left="6px"
            >
              <FileIcon boxSize="32px" />
            </Box>
          </Flex>
          <Button
            w="100%"
            bg="blue.primary"
            color="white"
            textStyle="button"
            transition="all .3s"
            _hover={{ bg: "blue.hover" }}
          >
            buy
          </Button>
        </Flex>
      </Box>
    </Link>
  );
};

export default ItemCard;
