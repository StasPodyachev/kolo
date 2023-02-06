import { AboutKoloData } from "@/constants/shared";
import { Flex, Heading, TabPanel, Text } from "@chakra-ui/react";

const AboutKoloPanel = () => {
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto">
        <Heading variant="h3" color="white" textAlign="center">
          KOLO Governance
        </Heading>
        <Flex flexDir="column" gap="20px" mt="40px">
          <Text mt="36px" color="white">
            Kolo is a cutting-edge project being developed by the defx team for the FVM Space Warp. It aims to create a fair and censorship-resistant platform for trading sensitive information, leveraging the power of the Filecoin network and governed by the DAO - community of KOLO tokenholders.

            Any KOLO token holder can initiate a discussion about the protocol development or terms and conditions changes. For instance, one can propose to decrease the system fee to make the protocol more accessible for users. Or change the minimal collateral amount.
            To start the discussion, a token holder has to submit it via special form at the website or directly to the Filecoin blockchain and sign in Metamask or another wallet.
          </Text>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default AboutKoloPanel;
