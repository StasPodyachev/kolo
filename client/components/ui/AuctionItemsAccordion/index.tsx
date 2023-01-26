import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import {
  auctionItems,
  VotesBlockchain,
  VotesParameters,
} from "@/constants/shared";
import AddressCopy from "../AddressCopy";
import Link from "next/link";
import { useState } from "react";

const AuctionItemAccordion: NextPage = () => {
  const [accordionIndex, setAccordionIndex] = useState(-1);
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  return (
    <Accordion mt="16px" index={accordionIndex}>
      {auctionItems.map((item) => (
        <AccordionItem
          border="1px solid"
          borderColor="gray.800"
          key={item.id}
          _first={{ mt: 0 }}
          _notFirst={{ mt: "34px" }}
        >
          <Link href={`/products/${item.id}`}>
            <Flex w="100%" alignItems="center">
              {item.image ? (
                <Image
                  src={item.image}
                  alt="card image"
                  width={121}
                  height={96}
                />
              ) : (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  h="96px"
                  minW="121px"
                  bg="gray.800"
                >
                  <Image src={CardImage} alt="card image" />
                </Flex>
              )}
              <Flex p="20px 30px" alignItems="center" w="100%">
                <Flex justifyContent="space-between" w="100%">
                  <Flex flexDir="column" gap="8px">
                    <Text>{item.title}</Text>
                    <Flex>
                      <Text textStyle="smallText" color="gray.300">
                        CID:&nbsp;
                      </Text>
                      <AddressCopy
                        address={item.ownedBy}
                        textStyle="smallText"
                        color="gray.300"
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDir="column" gap="8px">
                    <HStack spacing="6px" alignSelf="flex-end">
                      <Text textStyle="smallText" color="gray.300">
                        Last price
                      </Text>
                      <Text fontFamily="Roboto Mono" textStyle="bigText">
                        {item.currentPrice}&nbsp;FIL
                      </Text>
                    </HStack>
                    <HStack spacing="24px">
                      <Flex>
                        <Text textStyle="smallText" color="gray.300">
                          Bids:&nbsp;
                        </Text>
                        <Text
                          fontFamily="Roboto Mono"
                          textStyle="smallText"
                          color="gray.300"
                        >
                          {item.totalBids}
                        </Text>
                      </Flex>
                      <Flex>
                        <Text textStyle="smallText" color="gray.300">
                          Sale ends:&nbsp;
                        </Text>
                        <Text
                          fontFamily="Roboto Mono"
                          textStyle="smallText"
                          color="gray.300"
                        >
                          {item.saleEndDate}
                        </Text>
                      </Flex>
                    </HStack>
                  </Flex>
                </Flex>
                <AccordionButton
                  cursor="pointer"
                  onClick={(event) => {
                    event.preventDefault();
                    setNumberOfClicks(1);
                    setAccordionIndex(item.id - 1);
                    if (numberOfClicks % 2 === 1) {
                      if (item.id !== accordionIndex + 1) {
                        setAccordionIndex(item.id - 1);
                        setNumberOfClicks(1);
                      } else {
                        setNumberOfClicks(0);
                        setAccordionIndex(-1);
                      }
                    }
                  }}
                  p={0}
                  w="max-content"
                >
                  <AccordionIcon ml="36px" boxSize="36px" />
                </AccordionButton>
              </Flex>
            </Flex>
          </Link>
          <AccordionPanel bg="inherit" p="16px 20px 18px 36px">
            <Text textStyle="smallText" color="white">
              Description:&nbsp;{item.description}
            </Text>
            <Flex mt="20px" justifyContent="space-between">
              <Flex flexDir="column" gap="20px">
                <Text textStyle="bigText" color="white">
                  Parameters
                </Text>
                <Flex flexDir="column" gap="7px" minW="225px">
                  {VotesParameters.map((param) => (
                    <Flex
                      key={param.title}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Text textStyle="smallText" color="white">
                        {param.title}
                      </Text>
                      <Text
                        fontFamily="Roboto Mono"
                        textStyle="smallText"
                        color="white"
                      >
                        {param.value}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex flexDir="column" gap="20px">
                <Text textStyle="bigText" color="white">
                  Blockchain
                </Text>
                <Flex flexDir="column" gap="7px" minW="225px">
                  {VotesBlockchain.map((block) => (
                    <Flex
                      key={block.title}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Text textStyle="smallText" color="white">
                        {block.title}
                      </Text>
                      <AddressCopy
                        address={block.value}
                        textStyle="smallText"
                      />
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Button
                bg="blue.primary"
                textStyle="button"
                minW="272px"
                alignSelf="flex-end"
                transition="all .3s"
                _hover={{ bg: "blue.hover" }}
              >
                vote
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AuctionItemAccordion;
