import { MyPurchasesBlocks } from "@/constants/shared";
import useDevice from "@/hooks/useDevice";
import { Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";

const MyPurchasesPanel: NextPage = () => {
  const { isDesktopHeader } = useDevice();
  return (
    <TabPanel p={0}>
      <Blocks items={MyPurchasesBlocks} />
      <Heading mt="28px" variant="h3" color="white">
        My Bids
      </Heading>
      <AuctionItemAccordion />
      <Heading mt="28px" variant="h3" color="white">
        My Purchases
      </Heading>
      <AuctionItemAccordion />
    </TabPanel>
  );
};

export default MyPurchasesPanel;
