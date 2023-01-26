import { addressTruncation } from "@/helpers";
import { Tooltip, Text } from "@chakra-ui/react";
import { useState } from "react";

interface IProps {
  address: string;
  color?: string;
  textStyle?: string;
}

const AddressCopy = ({ address, color, textStyle }: IProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  return (
    <Tooltip
      hasArrow
      label={hasCopied ? "Copied" : "Copy"}
      p="4px 12px"
      color="white"
    >
      <Text
        w="max-content"
        textStyle={textStyle ? textStyle : "mediumText"}
        color={color ? color : "white"}
        _hover={{ cursor: "pointer" }}
        onClick={(event) => {
          event.preventDefault();
          navigator.clipboard.writeText(address);
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 500);
        }}
      >
        {addressTruncation(address)}
      </Text>
    </Tooltip>
  );
};

export default AddressCopy;
