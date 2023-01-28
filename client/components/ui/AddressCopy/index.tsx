import { addressTruncation } from "@/helpers";
import { Text } from "@chakra-ui/react";
import { useState } from "react";
import Tooltip from "../Tooltip";

interface IProps {
  address: string;
  color?: string;
  textStyle?: string;
}

const AddressCopy = ({ address, color, textStyle }: IProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  return (
    <Tooltip label={hasCopied ? "Copied" : "Copy"}>
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
