import addresses from "@/contracts/addresses";
import { IBlock } from "@/types";
import { Box, Heading, TabPanel } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import AuctionItemsAccordion from "../ui/AuctionItemsAccordion";
import Blocks from "../ui/Blocks";
import ABI_NOTARY from "@/contracts/abi/Notary.json";
import { useEffect, useState } from "react";
import Plug from "../ui/Plug";

interface IProps {
  blocks: IBlock[];
}

const MyVotesPanel = ({ blocks }: IProps) => {
  const { address } = useAccount();
  const [myVotes, setMyVotes] = useState([]);
  const { data } = useContractRead({
    address: addresses[2].address as `0x${string}`,
    abi: ABI_NOTARY,
    functionName: 'getVoteInfo',
    args: [address],
  });
  return (
    <TabPanel p={0}>
      <Blocks items={blocks} />
      <Heading mt="28px" variant="h3">
        My Votes
      </Heading>
      {myVotes.length ? (
        <AuctionItemsAccordion deals={myVotes} />
      ) : (
        <Box mt="28px">
          <Plug title="vote to see it here" />
        </Box>
      )}
    </TabPanel>
  );
};

export default MyVotesPanel;
