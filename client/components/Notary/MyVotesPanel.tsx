import { NotaryVotesBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";

const MyVotesPanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Blocks items={NotaryVotesBlocks} />
      <Heading mt="28px" variant="h3">
        My Votes
      </Heading>
      <AuctionItemsAccordion />
    </TabPanel>
  );
};

export default MyVotesPanel;
