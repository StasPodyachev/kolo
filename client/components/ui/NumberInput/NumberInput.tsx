import {
  Badge,
  InputGroup,
  InputRightElement,
  NumberInputField,
  NumberInput as ChakraNumberInput,
} from "@chakra-ui/react";

interface IProps {
  value: number;
  setValue: (value: number) => void;
  placeholder: string;
  isNeededMarginTop?: boolean;
  isNotFullWidth?: boolean;
}

const NumberInput = ({
  value,
  setValue,
  placeholder,
  isNeededMarginTop,
  isNotFullWidth,
}: IProps) => {
  return (
    <InputGroup
      minW={isNotFullWidth ? "278px" : "100%"}
      minH="48px"
      mt={isNeededMarginTop ? "16px" : 0}
    >
      <ChakraNumberInput min={0} w="100%" bg="gray.700" borderRadius="md">
        <NumberInputField
          placeholder={placeholder}
          _placeholder={{ color: "white" }}
          value={value}
          onKeyPress={(event) => {
            if (event.key === "e" || event.key === "E" || event.key === "-") {
              setTimeout(() => {
                setValue(0);
              }, 100);
              console.log("hello");
            }
          }}
          onChange={(event) => setValue(+event.target.value)}
          w="100%"
          h="100%"
          p="12px 16px"
          transition="all .3s"
          color="white"
          _focusVisible={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "gray.300",
          }}
        />
        <InputRightElement top="5px" right="13px">
          <Badge
            letterSpacing="1px"
            bg="gray.800"
            color="white"
            p="2px 8px"
            textStyle="mediumText"
          >
            FIL
          </Badge>
        </InputRightElement>
      </ChakraNumberInput>
    </InputGroup>
  );
};

export default NumberInput;
