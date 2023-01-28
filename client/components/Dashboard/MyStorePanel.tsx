import { MyStoreBlocks } from "@/constants/shared";
import useDevice from "@/hooks/useDevice";
import { Flex, Grid, Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Block from "../ui/Block";

const MyStorePanel: NextPage = () => {
  const { isDesktopHeader } = useDevice();
  return (
    <TabPanel p={0}>
      <Grid
        gap="32px"
        rowGap="32px"
        justifyContent={isDesktopHeader[0] ? "space-between" : "center"}
        templateColumns="repeat(auto-fill, 250px)"
        templateRows="auto"
      >
        {MyStoreBlocks.map((block) => (
          <Block key={block.title} title={block.title} value={block.value} />
        ))}
      </Grid>
      <Heading mt="28px" variant="h3" color="white">
        My Store
      </Heading>
      <AuctionItemsAccordion />
    </TabPanel>
  );
};

export default MyStorePanel;
