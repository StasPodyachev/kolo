import { ShareIcon } from "@/icons";
import { Button, Flex, FormControl, FormLabel, Heading, Switch, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CustomInput } from "../NewPoduct/NewPoduct";

interface IProps {
  title: string;
}

const VotePanel = ({ title }: IProps) => {
  const [switchValue, setSwitchValue] = useState(-1);
  const [comment, setComment] = useState("");
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto" gap="16px">
        <Heading variant="h3" color="white" textAlign="center">
          Vote
        </Heading>
        <Flex flexDir="column" gap="32px">
          <Flex gap="16px" alignItems="center">
            <Heading variant="h5">Proposal #1</Heading>
            <ShareIcon boxSize="24px" />
          </Flex>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 0} value={switchValue} onChange={() => {
              setSwitchValue(0);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 0 ? "white" : "gray.500"}>
                For
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 1} value={switchValue} onChange={() => {
              setSwitchValue(1);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 1 ? "white" : "gray.500"}>
                Against
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 2} value={switchValue} onChange={() => {
              setSwitchValue(2);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 2 ? "white" : "gray.500"}>
                Abstained
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel>
              <Heading variant="h6" color="gray.200">Add comment</Heading>
            </FormLabel>
            <CustomInput
              placeholder="Text the community  what are your thoughts"
              value={comment}
              onChange={(event: any) => setComment(event.target.value)}
            />
          </FormControl>
          <Button variant="blue" textStyle="button" w="100%" isDisabled={switchValue === -1 ? true : false}>
            submit your vote
          </Button>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default VotePanel;
