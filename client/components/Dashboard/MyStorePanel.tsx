import { MyStoreBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Block from "../ui/Block";

const MyStorePanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Flex justifyContent="space-between">
        {MyStoreBlocks.map((block) => (
          <Block key={block.title} title={block.title} value={block.value} />
        ))}
      </Flex>
      <Heading mt="28px" variant="h3" color="white">
        My Store
      </Heading>
      <AuctionItemsAccordion />
    </TabPanel>
  );
};

export default MyStorePanel;
