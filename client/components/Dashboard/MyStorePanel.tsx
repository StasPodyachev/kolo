import { MyStoreBlocks } from "@/constants/shared";
import useDevice from "@/hooks/useDevice";
import { Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";

const MyStorePanel: NextPage = () => {
  const { isDesktopHeader } = useDevice();
  return (
    <TabPanel p={0}>
      <Blocks items={MyStoreBlocks} />
      <Heading mt="28px" variant="h3" color="white">
        My Store
      </Heading>
      <AuctionItemsAccordion />
    </TabPanel>
  );
};

export default MyStorePanel;
