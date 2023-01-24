import { NextPage } from "next";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  Flex,
  Text,
  Box,
  Heading,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auctionItems } from "@/constants/shared";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon, UserIcon } from "@/icons";
import BidsTable from "@/components/Products/BidsTable";

const Product: NextPage = () => {
  const router = useRouter();
  const productItem = auctionItems.find(
    (item) => item.id.toString() === router.query.productId
  );
  return (
    <Layout pageTitle="Item">
      <Flex flexDir="column" mt="60px">
        <Flex justifyContent="space-between">
          <Flex flexDir="column">
            {productItem?.image ? (
              <Image
                src={productItem.image}
                alt="card image"
                width={304}
                height={240}
              />
            ) : (
              <Flex
                justifyContent="center"
                alignItems="center"
                h="240px"
                minW="304px"
                bg="gray.800"
              >
                <Image src={CardImage} alt="card image" />
              </Flex>
            )}
            <Flex
              justifyContent="space-between"
              px="16px"
              position="relative"
              bottom="32px"
            >
              <Flex justifyContent="space-between" minW="304px">
                <Text textStyle="smallText" color="gray.300">
                  Sale ends
                </Text>
                <Text textStyle="smallText" color="gray.300">
                  {productItem?.saleEndDate}
                </Text>
              </Flex>
            </Flex>
            <Box position="relative" px="16px" bottom="247px" left="276px">
              <FileIcon boxSize="32px" />
            </Box>
          </Flex>
          <Flex flexDir="column" gap="6px" minW="278px">
            <Heading variant="h4">{productItem?.title}</Heading>
            <HStack spacing="16px">
              <Text textStyle="mediumText" color="gray.500">
                Owned by:
              </Text>
              <Text textStyle="mediumText" color="gray.500">
                {productItem?.ownedBy}
              </Text>
            </HStack>
            <Flex justifyContent="space-between" mt="6px">
              <Heading variant="h6" color="gray.200">
                Current price
              </Heading>
              <Heading variant="h6" color="gray.200">
                {productItem?.currentPrice}&nbsp;FIL
              </Heading>
            </Flex>
            <Flex justifyContent="space-between" mt="6px">
              <Heading variant="h6" color="gray.200">
                Price end
              </Heading>
              <Heading variant="h6" color="gray.200">
                {productItem?.priceEnd}&nbsp;FIL
              </Heading>
            </Flex>
            <Button
              textStyle="button"
              bg="blue.primary"
              mt="39px"
              borderRadius={0}
              transition="all .3s"
              _hover={{ bg: "blue.hover" }}
            >
              place bid
            </Button>
          </Flex>
          <Flex flexDir="column" maxW="278px" gap="34px">
            <Flex
              alignSelf="flex-end"
              w="max-content"
              gap="8px"
              alignItems="center"
              p="8px 18px"
              bg="gray.800"
            >
              <Box
                boxSize="10px"
                borderRadius="50%"
                bg={
                  productItem?.status === "active"
                    ? "green.active"
                    : "red.active"
                }
              />
              <Text textStyle="smallText" textTransform="capitalize">
                {productItem?.status}
              </Text>
            </Flex>
            <Text textStyle="smallText" color="gray.300">
              {productItem?.description}
            </Text>
            <Button
              mt="35px"
              bg="blue.secondaryDark"
              textStyle="button"
              transition="all .3s"
              _hover={{ bg: "blue.active" }}
              borderRadius={0}
            >
              buy now
            </Button>
          </Flex>
        </Flex>
        <Flex justify="space-between">
          <Box minW="400px">
            <Flex justify="space-between" w="100%">
              <Heading variant="h6">Bids</Heading>
              <Flex alignItems="center">
                <UserIcon width="21px" height="20px" />
                <Heading variant="h6">20</Heading>
              </Flex>
            </Flex>
            <BidsTable />
          </Box>
          <Flex
            flexDir="column"
            gap="8px"
            maxW="517px"
            minH="465px"
            bg="gray.800"
            p="32px 24px"
          >
            <Text color="gray.50">0x9D21...7a88:</Text>
            <Text textStyle="smallText" color="gray.400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              pulvinar commodo lacus eu dapibus. Aliquam vestibulum, lectus at
              tempor vestibulum, sapien purus.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};
export default Product;
