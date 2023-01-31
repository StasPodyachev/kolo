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
import { readContract } from '@wagmi/core'
import Tooltip from "@/components/ui/Tooltip";
import useDevice from "@/hooks/useDevice";

import BigDecimal from "decimal.js-light";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import addresses from "@/contracts/addresses";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { IAuctionItem } from "@/types";
import { BIG_1E18 } from "@/helpers/misc";

const Product: NextPage = () => {
  const [item, setItem] = useState<IAuctionItem>({} as IAuctionItem);
  const [formattedId, setFormattedId] = useState("");
  const [fetchedData, setFetchedData] = useState<unknown>();
  const [bidsAmount, setBidsAmount] = useState<unknown>();
  const { isConnected } = useAccount();
  const router = useRouter();
  const { isDesktopHeader } = useDevice();
  const isItemsInColumn = useMediaQuery("(max-width: 899px)");

  useEffect(() => {
    if (router.isReady) {
      const productId = Number(router?.query?.productId);
      const numberId = productId.toFixed(18);
      const bigIntId = BigInt(new BigDecimal(numberId).mul(BIG_1E18 + "").toFixed(0)) + "";
      setFormattedId(bigIntId);

      const fetchData = async () => {
        if (formattedId) {
          const data = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getDeal`,
            args: [ formattedId ],
          })
          setFetchedData(data);
          const totalBids = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getBidHistory`,
            args: [ formattedId ],
          })
          setBidsAmount(totalBids);
        }
      }
      fetchData();
    }
  }, [router.isReady, router?.query?.productId, formattedId])

  useEffect(() => {
    if (fetchedData && typeof fetchedData === 'object') {
      const coder = ethers.utils.defaultAbiCoder;
      const result = coder.decode([
        "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        // @ts-ignore
      ], fetchedData?.data);
      const id = +ethers.utils.formatEther(BigNumber?.from(result[0][0]));
      const title = result[0][1];
      const description = result[0][2]
      const ownedBy = result[0][7]
      const saleEndDateNew = result[0][9]
      const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
      const startPrice = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
      const endPrice = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));
      const status = ethers.utils.formatEther(BigNumber?.from(result[0][11]));

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let dateYear = new Date(saleEndDateNew * 1);
      let date = new Date(saleEndDateNew * 1000);
      const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      // Hours part from the timestamp
      let month = monthList[date.getMonth()];
      // Minutes part from the timestamp
      let days = date.getDay();
      let year =  dateYear.getFullYear();
      // Will display time in 10:30:23 format
      let saleEndDate = days + ' ' + month.slice(0, 3) + ' ' +  " " + year

      const decryptedData = {
        id,
        title,
        currentPrice: price < startPrice ? startPrice : price,
        ownedBy,
        saleEndDate,
        price: startPrice,
        priceEnd: endPrice,
        description,
        status,
        totalBids: 20,
      }
      setItem(decryptedData)
    }
  }, [fetchedData]);
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
            {item?.image ? (
              <Image
                src={item?.image}
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
                  {item?.saleEndDate}
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
                {item?.title}
              </Heading>
              <HStack spacing="16px">
                <Text textStyle="mediumText" color="gray.500">
                  Owned by:
                </Text>
                <AddressCopy address={item?.ownedBy!} color="gray.500" />
              </HStack>
              <Flex justifyContent="space-between" mt="6px">
                <Heading variant="h6" color="gray.200">
                  Current price
                </Heading>
                <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                  {item?.currentPrice}&nbsp;FIL
                </Heading>
              </Flex>
              <Flex justifyContent="space-between" mt="6px">
                <Heading variant="h6" color="gray.200">
                  Price end
                </Heading>
                <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                  {item?.priceEnd}&nbsp;FIL
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
                    item?.status === "active"
                      ? "green.active"
                      : "red.active"
                  }
                />
                <Text
                  textStyle="smallText"
                  color="white"
                  textTransform="capitalize"
                >
                  {item?.status}
                </Text>
              </Flex>
              <Text textStyle="smallText" color="gray.300">
                {item?.description}
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
                  {item?.totalBids}
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
            <AddressCopy address={item?.ownedBy!} color="gray.50" />
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
