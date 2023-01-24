import { NotaryCommunityBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import NotaryBlock from "./NotaryBlock";
import NotaryTable from "./NotaryTable";

const NotaryCommunityPanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column">
        <Flex justifyContent="space-between">
          {NotaryCommunityBlocks.map((block) => (
            <NotaryBlock
              key={block.title}
              title={block.title}
              value={block.value}
            />
          ))}
        </Flex>
        <Flex mt="28px" justifyContent="space-between" alignItems="center">
          <Heading variant="h3">List of Notaries</Heading>
          <Heading variant="h6">20/325</Heading>
        </Flex>
        <NotaryTable />
      </Flex>
    </TabPanel>
  );
};

export default NotaryCommunityPanel;
