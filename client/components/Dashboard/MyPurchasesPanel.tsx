import { MyPurchasesBlocks } from "@/constants/shared";
import { IAuctionItem, IBlock } from "@/types";
import { Heading, TabPanel, Text } from "@chakra-ui/react";
import AuctionItemAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";
import Plug from "../ui/Plug";

interface IProps {
  purchases: IAuctionItem[];
  bids: IAuctionItem[];
  blocks: IBlock[];
}

const MyPurchasesPanel = ({ purchases, bids, blocks }: IProps) => {
  return (
    <TabPanel p={0}>
      <Blocks items={MyPurchasesBlocks} />
      <Heading mt="28px" variant="h3" color="white">
        My Bids
      </Heading>
      {bids.length ? (
        <AuctionItemAccordion deals={bids} />
      ) : (
        <Plug title="make a bid to see it here" />
      )}
      <Heading mt="28px" variant="h3" color="white">
        My Purchases
      </Heading>
      {purchases.length ? (
        <AuctionItemAccordion deals={purchases} />
      ) : (
        <Plug title="buy some item to see it here" />
      )}
    </TabPanel>
  );
};

export default MyPurchasesPanel;
