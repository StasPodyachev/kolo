import { ProposalsBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import Blocks from "../ui/Blocks";

const ProposalsPanel = () => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="20px">
        <Blocks items={ProposalsBlocks} />
        <Heading>Recent Proposals</Heading>
      </Flex>
    </TabPanel>
  );
};

export default ProposalsPanel;
