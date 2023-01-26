import { Flex, Heading, Text } from "@chakra-ui/react";

interface IProps {
  title: string;
  value: number | string;
}

const Block = ({ title, value }: IProps) => {
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
            : title === "Notary Balance" || title === "My Notary Balance"
            ? "green.primary"
            : "inherit"
        }
        variant="h4"
      >
        {title.toLowerCase().includes("balance") ||
        title.toLowerCase().includes("total") ||
        title.toLowerCase().includes("locked") ? (
          <Text>FIL&nbsp;{value}</Text>
        ) : (
          value
        )}
      </Heading>
      <Text color="gray.500">{title}</Text>
    </Flex>
  );
};

export default Block;
