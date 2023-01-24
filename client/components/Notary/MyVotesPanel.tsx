import { NotaryVotesBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import MyVotesAccordion from "./MyVotesAccordion";
import NotaryBlock from "./NotaryBlock";

const MyVotesPanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Flex justifyContent="space-between">
        {NotaryVotesBlocks.map((block) => (
          <NotaryBlock
            key={block.title}
            title={block.title}
            value={block.value}
          />
        ))}
      </Flex>
      <Heading mt="28px" variant="h3">
        My Votes
      </Heading>
      <MyVotesAccordion />
    </TabPanel>
  );
};

export default MyVotesPanel;
