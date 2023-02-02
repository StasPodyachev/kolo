import useDevice from "@/hooks/useDevice";
import { IAuctionItem, IBidTableData } from "@/types";
import { Box, Button, Flex, FormControl, Heading, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon, UserIcon } from "@/icons";
import AddressCopy from "../ui/AddressCopy";
import NumberInput from "../ui/NumberInput/NumberInput";
import { useSigner } from "wagmi";
import Tooltip from "../ui/Tooltip";
import BidsTable from "../Products/BidsTable";
import PlaceBid from "./PlaceBid";

interface IProps {
  item: IAuctionItem,
  bid: string,
  setBid: (value: string) => void,
  currentBid: number,
  bidsTableData: IBidTableData[];
  bidsAmount: number;
}

const Product = ({ item, bid, setBid, currentBid, bidsTableData, bidsAmount }: IProps) => {
  const { isDesktopHeader } = useDevice();
  const isItemsInColumn = useMediaQuery("(max-width: 899px)");
  const signer = useSigner();
  const isBidError = +bid <= +currentBid;
  return (
    <Flex flexDir="column">
      <Flex
        height="240px"
        flexDir={isDesktopHeader[0] ? "row" : "column"}
        gap={isDesktopHeader[0] ? "56px" : 0}
      >
        <Flex
          flexDir="column"
          alignItems={isDesktopHeader[0] ? "normal" : "center"}
        >
          {item?.image ? (
            <Image
              style={{ position: 'absolute' }}
              src={item?.image}
              alt="card image"
              width={336}
              height={240}
            />
          ) : (
            <Flex
              position="fixed"
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
            top="208px"
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
            w="max-content"
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
          <Flex flexDir="column" gap="6px" minW="380px" maxH="240px" justifyContent="space-between">
            <Heading variant="h4" color="white" display="flex">
              <div style={{"marginRight" : "12px"}}>{item?.title}</div>
              <div style={{"color" : "gray"}}>#{item?.id}</div>
            </Heading>
            <HStack spacing="16px">
              <Text textStyle="mediumText" color="gray.500">
                Owned by:
              </Text>
              <AddressCopy address={item?.ownedBy!} color="gray.500" />
            </HStack>
            <Flex justifyContent="space-between">
              <Heading variant="h6" color="gray.200">
                Current price
              </Heading>
              <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                {item?.price}&nbsp;FIL
              </Heading>
            </Flex>
            <Flex justifyContent="space-between">
              <Heading variant="h6" color="gray.200">
                Price end
              </Heading>
              <Heading fontFamily="Roboto Mono" variant="h6" color="gray.200">
                {item?.priceEnd}&nbsp;FIL
              </Heading>
            </Flex>
            <Flex gap="24px">
              <NumberInput
                value={bid}
                setValue={setBid}
                // minValue={Number(bid)}
                width="200px"
              />
              <PlaceBid
                isDisabled={!signer || isBidError}
                bid={bid}
                id={item?.id}/>
            </Flex>
          </Flex>
          <Flex
            mt={isItemsInColumn[0] ? "32px" : 0}
            flexDir="column"
            minW="252px"
            maxW={isItemsInColumn[0] ? "100%" : "230px"}
            gap="34px"
            maxH="240px"
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
                  item?.status === "Active"
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
            <Text
              textStyle="smallText"
              color="gray.300"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item?.description}
            </Text>
            <Tooltip
              label="Connect wallet to buy"
              isHidden={signer ? true : false}
            >
              <Button
                mt="auto"
                isDisabled={!signer}
                minH="48px"
                bg="green.primary"
                color="white"
                textStyle="button"
                transition="all .3s"
                _hover={{ bg: "green.hover" }}
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
        gap={isDesktopHeader[0] ? "162px" : "52px"}
        mt={isDesktopHeader[0] ? "36px" : "52px"}
      >
        <Box minW="400px">
          <Flex justify="space-between" w="100%">
            <Heading variant="h6" color="white">
              Bids
            </Heading>
            <Flex alignItems="center">
              <UserIcon width="21px" height="20px" />
              <Heading variant="h6" color="white">
                {bidsAmount}
              </Heading>
            </Flex>
          </Flex>
          <BidsTable data={bidsTableData} />
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
  );
};

export default Product;
