import {
  Badge,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import styles from "./NumberInput.module.css";

interface IProps {
  value: string;
  setValue: (value: string) => void;
  isNeededMarginTop?: boolean;
  isNotFullWidth?: boolean;
  minValue?: number;
  errorMessage?: string;
  width?: string;
}
const NumberInput = ({
  value,
  setValue,
  isNeededMarginTop,
  isNotFullWidth,
  minValue,
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
      <input
        id="numberInput"
        min={minValue}
        type="number"
        className={styles.input}
        value={value}
        onChange={(event) => {
          if (event.target.value.includes('.')) {
            const decimalsCount = event.target.value.split('.');
            if (decimalsCount.length && decimalsCount[1].length > 2) {
              setValue((+event.target.value).toFixed(2))
            } else {
              setValue(event.target.value)
            }
          } else {
            setValue(event.target.value)
          }
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
    </InputGroup>
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </>
  );
};

export default NumberInput;
