import { ShareIcon } from "@/icons";
import { Flex, Heading, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface IProps {
  title: string;
}

const VotePanel = ({ title }: IProps) => {
  useEffect(() => {
    console.log('title', title)
  }, [title])
  const [comment, setComment] = useState("");
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto" gap="16px">
        <Heading variant="h3" color="white" textAlign="center">
          Vote
        </Heading>
        <Flex flexDir="column">
          <Flex gap="16px" alignItems="center">
            <Heading variant="h5">Proposal #1</Heading>
            <ShareIcon boxSize="24px" />
          </Flex>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default VotePanel;
