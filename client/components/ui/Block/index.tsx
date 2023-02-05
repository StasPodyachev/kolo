import { numberWithCommas } from "@/helpers";
import { Flex, Heading, Text } from "@chakra-ui/react";

interface IProps {
  title: string;
  value: number | string;
}

const Block = ({ title, value }: IProps) => {
  const filCondition = title.toLowerCase().includes("balance") ||
  title.toLowerCase().includes("total revenue") ||
  title.toLowerCase().includes("locked");
  const greenPrimaryColor = title === "Notary Balance" || title === "My Notary Balance" || title === "Treasury balance" || title === "Total minted";
  return (
    <Flex
      minW="220px"
      flexDir="column"
      p="24px 24px 18px"
      border="1px solid"
      borderColor="gray.700"
    >
      <Heading
        fontFamily={typeof value === "number" ? "Roboto Mono" : "inherit"}
        color={
          title === "My Status"
            ? "green.secondaryDark"
            : greenPrimaryColor
            ? "green.primary"
            : "white"
        }
        variant="h5"
      >
        {filCondition ? (
          `FIL ${value}`
        ) : title.toLowerCase().includes('total minted') ?
        (
          `KOLO ${value}`
        ) : (
          value
        )}
      </Heading>
      <Text color="gray.500">{title}</Text>
    </Flex>
  );
};

export default Block;
