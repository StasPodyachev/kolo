import { ProposalsBlocks, ProposalsItems } from "@/constants/shared";
import { IProposalItem } from "@/types";
import { Button, Flex, Heading, TabPanel } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import Blocks from "../ui/Blocks";
import ProposalItem from "./ProposalItem";

interface IProps {
  setIndex: Dispatch<SetStateAction<number>>;
}

const ProposalsPanel = ({ setIndex }: IProps) => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="20px">
        <Blocks items={ProposalsBlocks} />
        <Heading variant="h3" color="white">Recent Proposals</Heading>
        <Flex flexDir="column" gap="36px">
          {ProposalsItems.map((item: IProposalItem) => (
            <ProposalItem
              title={item.title}
              id={item.id}
              buttonText={item.buttonText}
              status={item.status}
            />
          ))}
        </Flex>
        <Button
          textStyle="button"
          variant="blue"
          minW="272px"
          m="24px auto 0"
          onClick={() => setIndex(1)}
        >
          create proposal
        </Button>
      </Flex>
    </TabPanel>
  );
};

export default ProposalsPanel;
