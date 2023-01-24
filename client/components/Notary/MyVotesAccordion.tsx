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
  useClipboard,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Image from "next/image";
import CardImage from "@/icons/cardImage.svg";
import { CopyIcon } from "@/icons";
import {
  VotesBlockchain,
  VotesItems,
  VotesParameters,
} from "@/constants/shared";

const MyVotesAccordion: NextPage = () => {
  const { onCopy, hasCopied } = useClipboard("");
  return (
    <Accordion allowMultiple mt="16px">
      {VotesItems.map((item) => (
        <AccordionItem
          key={item.address}
          border={0}
          mt={item.isFirstItem ? 0 : "34px"}
        >
          <AccordionButton border="1px solid" borderColor="gray.800" p={0}>
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
                    <Flex
                      gap="8px"
                      alignItems="center"
                      cursor="pointer"
                      title={hasCopied ? "Copied" : "Copy"}
                    >
                      <Text textStyle="smallText" color="gray.300">
                        CID:&nbsp;{item.address}
                      </Text>
                      <CopyIcon onClick={onCopy} boxSize="16px" />
                    </Flex>
                  </Flex>
                  <Flex flexDir="column" gap="8px">
                    <HStack spacing="6px" alignSelf="flex-end">
                      <Text textStyle="smallText" color="gray.300">
                        Last price
                      </Text>
                      <Text textStyle="bigText">{item.lastPrice}&nbsp;FIL</Text>
                    </HStack>
                    <HStack spacing="24px">
                      <Text textStyle="smallText" color="gray.300">
                        Bids:&nbsp;{item.bids}
                      </Text>
                      <Text textStyle="smallText" color="gray.300">
                        Sale ends: {item.saleEnds}
                      </Text>
                    </HStack>
                  </Flex>
                </Flex>
                <AccordionIcon ml="36px" boxSize="36px" />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel bg="white" p="16px 20px 18px 36px">
            <Text textStyle="smallText" color="gray.700">
              Description:&nbsp;{item.description}
            </Text>
            <Flex mt="20px" justifyContent="space-between">
              <Flex flexDir="column" gap="20px">
                <Text textStyle="bigText" color="gray.700">
                  Parameters
                </Text>
                <Flex flexDir="column" gap="7px" minW="225px">
                  {VotesParameters.map((param) => (
                    <Flex
                      key={param.title}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Text textStyle="smallText" color="gray.700">
                        {param.title}
                      </Text>
                      <Text textStyle="smallText" color="gray.700">
                        {param.value}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex flexDir="column" gap="20px">
                <Text textStyle="bigText" color="gray.700">
                  Blockchain
                </Text>
                <Flex flexDir="column" gap="7px" minW="225px">
                  {VotesBlockchain.map((block) => (
                    <Flex
                      key={block.title}
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Text textStyle="smallText" color="gray.700">
                        {block.title}
                      </Text>
                      <Text textStyle="smallText" color="gray.700">
                        {block.value}
                      </Text>
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

export default MyVotesAccordion;
