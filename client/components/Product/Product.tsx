import useDevice from "@/hooks/useDevice";
import { IAuctionItem, IBidTableData } from "@/types";
import { Box, Flex, Heading, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon, UserIcon } from "@/icons";
import AddressCopy from "../ui/AddressCopy";
import NumberInput from "../ui/NumberInput/NumberInput";
import { useAccount, useSigner } from "wagmi";
import BidsTable from "../Products/BidsTable";
import PlaceBid from "./PlaceBid";
import BuyNow from "./BuyNow";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Dispute from "./Dispute";
import Finalize from "./Finalize";
import Vote from "./Vote";
import Cancel from "./Cancel";
import Link from "next/link";
import { LinkIcon } from "@chakra-ui/icons";
interface IProps {
  item: IAuctionItem,
  bid: string,
  setBid: (value: string) => void,
  currentBid: number,
  bidsTableData: IBidTableData[];
  bidsAmount: number;
}

const Bids = ({isDesktopHeader, bidsAmount, bidsTableData, id} : any) => {
  return (
    <Flex
      justifyContent={isDesktopHeader[0] ? "space-between" : "normal"}
      flexDir={isDesktopHeader[0] ? "row" : "column"}
      gap={isDesktopHeader[0] ? 0 : "52px"}
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
        <Chat id={id} />
    </Flex>
  )
}

const Product = ({ item, bid, setBid, currentBid, bidsTableData, bidsAmount }: IProps) => {
  const { isDesktopHeader } = useDevice();
  const isItemsInColumn = useMediaQuery("(max-width: 899px)");
  const signer = useSigner();
  const isBidError = +bid <= +currentBid;
  const { address } = useAccount();

  const [ isSeller, setIsSeller ] = useState(false);
  const [ isBuyer, setIsBuyer ] = useState(false);
  const [ isNotary, setIsNotary ] = useState(true);

  useEffect(() => {
    if (item?.buyer === address) setIsBuyer(true)
  }, [item, address])

  useEffect(() => {
    if (item?.ownedBy === address) setIsSeller(true)
  }, [item, address])

  useEffect(() => {
    if (item?.cid) {

    }
  }, [item])

  return (
    <Flex margin={"0 auto 0"} flexDir="column" w={isDesktopHeader[0] ? "fit-content" : "100%"}>
      <Flex
        w={isDesktopHeader[0] ? "max-content" : "100%"}
        height="240px"
        flexDir={isDesktopHeader[0] ? "row" : "column"}
        gap={isDesktopHeader[0] ? "56px" : 0}>
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
              position="absolute"
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

              <Flex height={'48px'} justifyContent="space-between">
                {
                  item?.pastTime ?
                  <Finalize id={item?.id} collateral={item?.collateral} /> :
                  item?.status?.title === "Open" && !isSeller ?
                    <>
                      <NumberInput
                        value={bid}
                        setValue={setBid}
                        minValue={Number(bid)}
                        width="200px"
                      />
                      <PlaceBid
                        id={item?.id}
                        price={bid}
                        isDisabled={!signer || isBidError || item?.ownedBy === address}
                      />
                    </>
                  : isBuyer && item?.id ?
                  <Dispute id={item?.id} collateral={item?.collateral} />
                  : isSeller && item?.status?.title === "Open" ?
                  <Cancel id={item?.id} /> 
                  : isNotary && item?.status?.title === "Dispute" ? (
                    <Vote
                      id={item?.id}
                      mark={false}
                      variant="blue"
                      title="vote for seller"
                    />
                  ) : null
                }
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
                bg={item?.status?.color}
              />
              <Text
                textStyle="smallText"
                color="white"
                textTransform="capitalize"
              >
                {item?.status?.title}
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
              { item?.pastTime ? null :
                item?.status?.title == "Open" && !isSeller ?
                <BuyNow
                  isDisabled={!signer || item?.ownedBy === address}
                  id={item?.id}
                  price={item?.priceEnd}
                  />
                :  isNotary && item?.status?.title === "Dispute" ? (
                    <Vote
                      id={item?.id}
                      mark
                      variant="darkBlue"
                      title="vote for buyer"
                      isNeededMarginTop
                    />
                  ) : null
              }
          </Flex>
        </Flex>
      </Flex>
      <Flex mt={5}>
        <Link style={{"display" : "flex", "alignItems": "center"}} target="_blank" href={`https://files.lighthouse.storage/viewFile/${item?.cid}`}>
          <Text color={"#ccc"} mr={2}>Cid Link:</Text>
          <Text mr={2}> {item?.cid?.slice(0, 22)} ...</Text>
          <LinkIcon />
        </Link>
      </Flex>
      <Bids isDesktopHeader={isDesktopHeader} bidsAmount={bidsAmount}
        bidsTableData={bidsTableData} id={item?.id}
        />
    </Flex>
  );
};

export default Product;
