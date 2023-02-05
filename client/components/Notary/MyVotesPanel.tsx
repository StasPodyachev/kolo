import { IBlock } from "@/types";
import { Heading, TabPanel } from "@chakra-ui/react";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";

interface IProps {
  blocks: IBlock[];
}

const MyVotesPanel = ({ blocks }: IProps) => {
  return (
    <TabPanel p={0}>
      <Blocks items={blocks} />
      <Heading mt="28px" variant="h3">
        My Votes
      </Heading>
      <AuctionItemsAccordion deals={[]} />
    </TabPanel>
  );
};

export default MyVotesPanel;
