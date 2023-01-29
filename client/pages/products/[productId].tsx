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
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auctionItems } from "@/constants/shared";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon, UserIcon } from "@/icons";
import BidsTable from "@/components/Products/BidsTable";
import AddressCopy from "@/components/ui/AddressCopy";
import { useAccount } from "wagmi";
import Tooltip from "@/components/ui/Tooltip";
import useDevice from "@/hooks/useDevice";

const Product: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const productItem = auctionItems.find(
    (item) => item.id.toString() === router.query.productId
  );
  const { isDesktopHeader } = useDevice();
  const isItemsInColumn = useMediaQuery("(max-width: 899px)");
  return (
    <Layout pageTitle="Item">
      <Flex flexDir="column">
        <Flex
          flexDir={isDesktopHeader[0] ? "row" : "column"}
          gap={isDesktopHeader[0] ? "56px" : 0}
        >
          <Flex
            flexDir="column"
            alignItems={isDesktopHeader[0] ? "normal" : "center"}
          >
            {productItem?.image ? (
              <Image
                src={productItem.image}
                alt="card image"
                width={336}
                height={240}
              />
            ) : (
              <Flex
                justifyContent="center"
                alignItems="center"
                h="240px"
                w="336px"
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
            <Box
              position="relative"
              px="16px"
              bottom="247px"
              left={isDesktopHeader[0] ? "276px" : "142px"}
            >
              <FileIcon boxSize="32px" />
            </Box>
          </Flex>
          <Flex
            flexDir={isItemsInColumn[0] ? "column" : "row"}
            gap={isDesktopHeader[0] ? "56px" : 0}
            justifyContent={isDesktopHeader[0] ? "normal" : "space-between"}
          >
            <Flex flexDir="column" gap="6px" minW="278px">
              <Heading variant="h4" color="white">
                {productItem?.title}
              </Heading>
              <HStack spacing="16px">
                <Text textStyle="mediumText" color="gray.500">
                  Owned by:
                </Text>
                <AddressCopy address={productItem?.ownedBy!} color="gray.500" />
              </HStack>
              <Flex justifyContent="space-between" mt="6px">
                <Heading variant="h6" color="gray.200">
                  Current price
                </Heading>
                <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                  {productItem?.currentPrice}&nbsp;FIL
                </Heading>
              </Flex>
              <Flex justifyContent="space-between" mt="6px">
                <Heading variant="h6" color="gray.200">
                  Price end
                </Heading>
                <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                  {productItem?.priceEnd}&nbsp;FIL
                </Heading>
              </Flex>
              <Tooltip
                isHidden={isConnected ? true : false}
                label="Connect wallet to place bid"
              >
                <Button
                  isDisabled={!isConnected}
                  textStyle="button"
                  bg="blue.primary"
                  color="white"
                  mt="39px"
                  borderRadius={0}
                  transition="all .3s"
                  _hover={{ bg: "blue.hover" }}
                >
                  place bid
                </Button>
              </Tooltip>
            </Flex>
            <Flex
              mt={isItemsInColumn[0] ? "32px" : 0}
              flexDir="column"
              minW="278px"
              maxW={isItemsInColumn[0] ? "100%" : "278px"}
              gap="34px"
            >
              <Flex
                alignSelf="flex-end"
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
                <Text
                  textStyle="smallText"
                  color="white"
                  textTransform="capitalize"
                >
                  {productItem?.status}
                </Text>
              </Flex>
              <Text textStyle="smallText" color="gray.300">
                {productItem?.description}
              </Text>
              <Tooltip
                label="Connect wallet to buy"
                isHidden={isConnected ? true : false}
              >
                <Button
                  isDisabled={!isConnected}
                  mt="35px"
                  bg="blue.secondaryDark"
                  color="white"
                  textStyle="button"
                  transition="all .3s"
                  _hover={{ bg: "blue.active" }}
                  borderRadius={0}
                >
                  buy now
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDir={isDesktopHeader[0] ? "row" : "column"}
          gap={isDesktopHeader[0] ? "88px" : "52px"}
          mt={isDesktopHeader[0] ? 0 : "52px"}
        >
          <Box minW="400px">
            <Flex justify="space-between" w="100%">
              <Heading variant="h6" color="white">
                Bids
              </Heading>
              <Flex alignItems="center">
                <UserIcon width="21px" height="20px" />
                <Heading variant="h6" color="white">
                  {productItem?.totalBids}
                </Heading>
              </Flex>
            </Flex>
            <BidsTable />
          </Box>
          <Flex
            flexDir="column"
            gap="8px"
            maxW={isDesktopHeader[0] ? "517px" : "100%"}
            minH="465px"
            bg="gray.800"
            p="32px 24px"
          >
            <AddressCopy address={productItem?.ownedBy!} color="gray.50" />
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
