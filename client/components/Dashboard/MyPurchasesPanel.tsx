import { MyPurchasesBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemAccordion from "../ui/AuctionItemsAccordion";
import Block from "../ui/Block";

const MyPurchasesPanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Flex justifyContent="space-between">
        {MyPurchasesBlocks.map((block) => (
          <Block key={block.title} title={block.title} value={block.value} />
        ))}
      </Flex>
      <Heading mt="28px" variant="h3">
        My Bids
      </Heading>
      <AuctionItemAccordion />
      <Heading mt="28px" variant="h3">
        My Purchases
      </Heading>
      <AuctionItemAccordion />
    </TabPanel>
  );
};

export default MyPurchasesPanel;
