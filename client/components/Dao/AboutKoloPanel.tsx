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
          {AboutKoloData.map((item) => (
            <Flex flexDir="column" gap="4px">
              <Text textStyle="bigText" color="white">
                {item.title}
              </Text>
              <Text textStyle="smallText" color="gray.500">
                {item.subtitle}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default AboutKoloPanel;
