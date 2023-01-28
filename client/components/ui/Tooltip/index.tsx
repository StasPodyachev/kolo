import { Tooltip as ChakraTooltip } from "@chakra-ui/react";

interface IProps {
  children: JSX.Element | JSX.Element[];
  label: string;
  isHidden?: boolean;
}

const Tooltip = ({ children, label, isHidden }: IProps) => {
  return (
    <ChakraTooltip
      display={isHidden ? "none" : "block"}
      hasArrow
      label={label}
      p="4px 12px"
      color="white"
    >
      {children}
    </ChakraTooltip>
  );
};

export default Tooltip;
