import { NotaryCommunityBlocks } from "@/constants/shared";
import { Flex, Heading, TabPanel, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Block from "../ui/Block";
import NotaryTable from "./NotaryTable";

const NotaryCommunityPanel: NextPage = () => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column">
        <Flex justifyContent="space-between">
          {NotaryCommunityBlocks.map((block) => (
            <Block key={block.title} title={block.title} value={block.value} />
          ))}
        </Flex>
        <Flex mt="28px" justifyContent="space-between" alignItems="center">
          <Heading variant="h3" color="white">
            List of Notaries
          </Heading>
          <Heading
            fontFamily="Roboto Mono"
            variant="h6"
            pos="relative"
            top="2px"
            color="white"
          >
            20/325
          </Heading>
        </Flex>
        <NotaryTable />
      </Flex>
    </TabPanel>
  );
};

export default NotaryCommunityPanel;
