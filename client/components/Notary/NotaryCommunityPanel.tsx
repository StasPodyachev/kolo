import { NotaryCommunityBlocks } from "@/constants/shared";
import { IBlock, INotaryData } from "@/types";
import { Flex, Heading, TabPanel, Text } from "@chakra-ui/react";
import Block from "../ui/Block";
import Blocks from "../ui/Blocks";
import NotaryTable from "./NotaryTable";

interface IProps {
  blocks: IBlock[];
  notaryData: INotaryData[] | INotaryData;
}

const NotaryCommunityPanel = ({ blocks, notaryData }: IProps) => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column">
        <Blocks items={blocks} />
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
            {Array.isArray(notaryData) ? (
              notaryData.length < 10
                ? `${notaryData.length}/${notaryData.length}`
                : `10/${notaryData.length}`
            ) : (
              1/1
            )}
            {/* 10/{Array.isArray(notaryData) ? notaryData?.length : 1} */}
          </Heading>
        </Flex>
        <NotaryTable data={notaryData} />
      </Flex>
    </TabPanel>
  );
};

export default NotaryCommunityPanel;
