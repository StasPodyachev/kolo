import { IAuctionItem } from "@/types";
import { AccordionPanel, Button, Flex, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import AddressCopy from "../AddressCopy";

interface IProps {
  item: IAuctionItem;
  isChangedAccordion: boolean;
}

const AuctionItemPanel = ({ item, isChangedAccordion }: IProps) => {
  return (
    <AccordionPanel bg="inherit" p="16px 20px 18px 36px">
      <Text textStyle="smallText" color="white">
        Description:&nbsp;{item.description}
      </Text>
      <Flex
        mt="20px"
        flexDir="column"
        justifyContent="space-between"
      >
        <Flex flexDir="column" gap="20px">
          <Text textStyle="bigText" color="white" textAlign="center">
            Parameters
          </Text>
          <Flex flexDir={isChangedAccordion ? "column" : "row"} justifyContent="space-between">
            <Flex flexDir="column" gap="7px" minW="272px">
              <Flex
                justifyContent="space-between"
                w="100%"
              >
                <Text textStyle="smallText" color="white">
                  Price Start:
                </Text>
                <Text
                  fontFamily="Roboto Mono"
                  textStyle="smallText"
                  color="white"
                >
                  {item?.priceStart}
                </Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                w="100%"
              >
                <Text textStyle="smallText" color="white">
                  Price Force Stop:
                </Text>
                <Text
                  fontFamily="Roboto Mono"
                  textStyle="smallText"
                  color="white"
                >
                  {item?.priceEnd}
                </Text>
              </Flex>
            </Flex>
            <Flex flexDir="column" gap="7px" minW="272px">
              <Flex
                justifyContent="space-between"
                w="100%"
              >
                <Text textStyle="smallText" color="white">
                  Collateral:
                </Text>
                <Text
                  fontFamily="Roboto Mono"
                  textStyle="smallText"
                  color="white"
                >
                  {+ethers?.utils?.formatEther(item?.collateral)}
                </Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                w="100%"
              >
                <Text textStyle="smallText" color="white">
                  Date End:
                </Text>
                <Text
                  fontFamily="Roboto Mono"
                  textStyle="smallText"
                  color="white"
                >
                  {item?.saleEndDate}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Button
          mt="36px"
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
  );
};

export default AuctionItemPanel;
