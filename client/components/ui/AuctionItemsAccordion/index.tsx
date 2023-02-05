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
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import {
  // auctionItems,
  VotesBlockchain,
  VotesParameters,
} from "@/constants/shared";
import AddressCopy from "../AddressCopy";
import Link from "next/link";
import { useState } from "react";
import { IAuctionItem } from "@/types";

interface IProps {
  deals: IAuctionItem[];
}

const AuctionItemAccordion = ({ deals }: IProps) => {
  const [accordionIndex, setAccordionIndex] = useState(-1);
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const isChangedAccordion = useMediaQuery("(max-width: 1000px)");
  const isAccordionTextInColumn = useMediaQuery("(max-width: 810px)");

  return (
    <Accordion mt="16px" index={accordionIndex}>
      {deals?.map((item, index) => {
        return (
          <AccordionItem
            border="1px solid"
            borderColor="gray.800"
            key={item.id}
            _first={{ mt: 0 }}
            _notFirst={{ mt: "34px" }}
          >
            <Link href={`/products/${item.id}`}>
              <Flex
                w="100%"
                alignItems={isAccordionTextInColumn[0] ? "stretch" : "center"}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt="card image"
                    width={121}
                    sizes="100%"
                  />
                ) : (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    minH="100%"
                    minW="121px"
                    bg="gray.800"
                  >
                    <Image src={CardImage} alt="card image" sizes="100%" />
                  </Flex>
                )}
                <Flex
                  p={isChangedAccordion ? "16px 10px" : "20px 30px"}
                  alignItems="center"
                  w="100%"
                >
                  <Flex
                    justifyContent="space-between"
                    w="100%"
                    flexDir={isAccordionTextInColumn[0] ? "column" : "row"}
                  >
                    <Flex flexDir="column" gap="8px">
                      <Text
                        textStyle={
                          isChangedAccordion ? "smallText" : "mediumText"
                        }
                        color="white"
                      >
                        {item.title}
                      </Text>
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
                      <HStack
                        spacing="6px"
                        alignSelf={
                          isAccordionTextInColumn[0] ? "auto" : "flex-end"
                        }
                        mt={isAccordionTextInColumn[0] ? "8px" : 0}
                      >
                        <Text textStyle="smallText" color="gray.300">
                          Last price
                        </Text>
                        <Text
                          fontFamily="Roboto Mono"
                          textStyle={
                            isChangedAccordion ? "mediumText" : "bigText"
                          }
                          color="white"
                        >
                          {item.price}&nbsp;FIL
                        </Text>
                      </HStack>
                      <HStack spacing={isAccordionTextInColumn[0] ? 0 : "24px"}>
                        <Flex display={isChangedAccordion[0] ? "none" : "flex"}>
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
                      setAccordionIndex(index);
                      if (numberOfClicks % 2 === 1) {
                        if (index !== accordionIndex) {
                          setAccordionIndex(index);
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
                    <AccordionIcon
                      ml={isChangedAccordion[0] ? "10px" : "36px"}
                      boxSize="36px"
                      color="white"
                    />
                  </AccordionButton>
                </Flex>
              </Flex>
            </Link>
            <AccordionPanel bg="inherit" p="16px 20px 18px 36px">
              <Text textStyle="smallText" color="white">
                Description:&nbsp;{item.description}
              </Text>
              <Flex
                mt="20px"
                flexDir={isChangedAccordion ? "column" : "row"}
                justifyContent="space-between"
              >
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
                <Flex
                  flexDir="column"
                  gap="20px"
                  mt="20px"
                >
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
                  mt={isChangedAccordion[0] ? "36px" : 0}
                  bg="blue.primary"
                  color="white"
                  textStyle="button"
                  minW="272px"
                  alignSelf={isChangedAccordion ? "center" : "flex-end"}
                  transition="all .3s"
                  _hover={{ bg: "blue.hover" }}
                >
                  vote
                </Button>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        )
      })}
    </Accordion>
  );
};

export default AuctionItemAccordion;
