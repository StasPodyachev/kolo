import { Button, Flex, Heading, TabPanel, VStack } from "@chakra-ui/react";
import PanelInput from "./Panelnput";

const CreatePanel = () => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto">
        <Heading variant="h3" color="white" textAlign="center">
          Create Proposal
        </Heading>
        <Flex flexDir="column" gap="24px" mt="24px">
          <PanelInput
            title="Description"
            placeholder="Description up to 256 characters"
          />
          <PanelInput
            title="Address Target"
            placeholder="Address"
          />
          <PanelInput
            title="Values"
            placeholder="uint256"
          />
          <PanelInput
            title="Calldatas"
            placeholder="bytes"
          />
          <Button
            mt="32px"
            variant="blue"
            textStyle="button"
            w="100%"
          >
            create proposal
          </Button>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default CreatePanel;
