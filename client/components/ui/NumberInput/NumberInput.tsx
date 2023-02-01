import {
  Badge,
  InputGroup,
  InputRightElement,
  NumberInputField,
  NumberInput as ChakraNumberInput,
  FormErrorMessage,
} from "@chakra-ui/react";

interface IProps {
  value: string;
  setValue: (value: string) => void;
  isNeededMarginTop?: boolean;
  isNotFullWidth?: boolean;
  minValue?: number;
  isCollateralInput?: boolean;
  errorMessage?: string;
  width?: string;
}

const NumberInput = ({
  value,
  setValue,
  isNeededMarginTop,
  isNotFullWidth,
  minValue,
  isCollateralInput,
  errorMessage,
  width,
}: IProps) => {
  return (
    <>
      <InputGroup
      minW={isNotFullWidth ? "278px" : width ? width : "100%"}
      width={width}
      minH="48px"
      mt={isNeededMarginTop ? "16px" : 0}
    >
      <ChakraNumberInput
        min={minValue}
        value={value}
        onKeyPress={(event) => {
          if (event.key === "e" || event.key === "E" || event.key === "-") {
            setTimeout(() => {
              setValue("0");
            }, 100);
          }
        }}
        onChange={(event) => {
          if (isCollateralInput && minValue && minValue > +event) {
            setTimeout(() => setValue(minValue.toString()), 2000);
          } else {
            setValue(event);
          }
        }}
        w="100%"
        bg="gray.700"
        borderRadius="md"
      >
        <NumberInputField
          _placeholder={{ color: "white" }}
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
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </>
  );
};

export default NumberInput;
