import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Flex,
  HStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import AddressCopy from "../AddressCopy";
import Link from "next/link";
import { useState } from "react";
import { IAuctionItem, ISvg } from "@/types";
import AuctionItemPanel from "./AuctionItemPanel";

interface IProps {
  deals: IAuctionItem[];
  image?: ISvg;
}

const AuctionItemAccordion = ({ deals, image }: IProps) => {
  const [accordionIndex, setAccordionIndex] = useState(-1);
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const isChangedAccordion = useMediaQuery("(max-width: 1000px)");
  const isAccordionTextInColumn = useMediaQuery("(max-width: 810px)");

  return (
    <Accordion mt="16px" index={accordionIndex}>
      {deals?.map((item, index) => {
        return (
          <Flex key={item.id} flexDir="column" _first={{ mt: 0 }} _notFirst={{ mt: "34px" }}>
            <Box
              bg={item?.status?.color}
              color="white"
              alignSelf="flex-end"
              minW="120px"
              minH="16px"
              mr="20px"
              textAlign="center"
            >
              {item?.status?.title}
            </Box>
            <AccordionItem
              border="1px solid"
              borderColor="gray.800"
            >
              <Link href={`/products/${item.id}`}>
                <Flex
                  w="100%"
                  h="10vh"
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
                      h="100%"
                      w="121px"
                      bg="gray.800"
                    >
                      {item.icon ? (
                        <Image src={item?.icon} alt="card image" sizes="100%" />
                      ) : null}
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
              <AuctionItemPanel item={item} isChangedAccordion={isChangedAccordion[0]} />
            </AccordionItem>
          </Flex>
        )
      })}
    </Accordion>
  );
};

export default AuctionItemAccordion;
