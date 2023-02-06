import { FaqAccodionItems } from "@/constants/shared";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { NextPage } from "next";

const FaqAccordion: NextPage = () => {
  const isCompactAccordion = useMediaQuery("(max-width: 900px)");
  return (
    <Accordion allowToggle>
      {FaqAccodionItems.map((item) => (
        <AccordionItem
          key={item.title}
          border="1px solid"
          borderColor="gray.800"
          _notFirst={{ mt: "34px" }}
        >
          <AccordionButton p={0}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              p={isCompactAccordion[0] ? "20px 16px" : "20px 30px"}
              w="100%"
            >
              <Heading
                minW="max-content"
                variant={isCompactAccordion[0] ? "h6" : "h5"}
                color="white"
              >
                {item.title}
              </Heading>
              <AccordionIcon boxSize="36px" color="white" />
            </Flex>
          </AccordionButton>
          <AccordionPanel p="10px 46px">
            <Text textStyle="bigText" color="white">
              {item.description}
            </Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqAccordion;
