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
} from "@chakra-ui/react";
import { NextPage } from "next";

const FaqAccordion: NextPage = () => {
  return (
    <Accordion allowToggle>
      {FaqAccodionItems.map((item) => (
        <AccordionItem
          key={item.title}
          border="1px solid"
          borderColor="gray.800"
          _notFirst={{ mt: "34px" }}
        >
          <AccordionButton>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              p="20px 30px"
              w="100%"
            >
              <Heading minW="max-content" variant="h5">
                {item.title}
              </Heading>
              <AccordionIcon boxSize="36px" />
            </Flex>
          </AccordionButton>
          <AccordionPanel p="10px 46px">
            <Text textStyle="bigText">{item.description}</Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqAccordion;
