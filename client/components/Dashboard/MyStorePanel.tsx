import { IAuctionItem, IBlock, ISvg } from "@/types";
import { Heading, TabPanel } from "@chakra-ui/react";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";
import Plug from "../ui/Plug";

interface IProps {
  deals: IAuctionItem[];
  blocks: IBlock[];
  image: ISvg;
}

const MyStorePanel = ({ deals, blocks, image }: IProps) => {
  return (
    <TabPanel p={0}>
      <Blocks items={blocks} />
      <Heading mt="28px" variant="h3" color="white">
        My Store
      </Heading>
      {deals.length ? (
        <AuctionItemsAccordion deals={deals} image={image} />
      ) : (
        <Plug title="create an auction to see it here" />
      )}
    </TabPanel>
  );
};

export default MyStorePanel;
