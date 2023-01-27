import { Box } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface IProps {
  isCentered?: boolean;
  isNeedMarginTop?: boolean;
  isNeedSmallMarginTop?: boolean;
}

const ConnectBtn = ({ isCentered, isNeedMarginTop, isNeedSmallMarginTop }: IProps) => {
  return (
    <Box
      mt={isNeedMarginTop ? "36px" : isNeedSmallMarginTop ? "8px" : 0}
      display={isCentered ? "flex" : "block"}
      justifyContent={isCentered ? "center" : "normal"}
      alignItems={isCentered ? "center" : "normal"}
      w="100%"
      sx={{
        div: {
          height: "100%",
          alignItems: "center",
        },
        button: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minW: "fit-content",
          minH: "52px",
          borderRadius: "md",
        },
      }}
    >
      <ConnectButton label="CONNECT WALLET" />
    </Box>
  );
};

export default ConnectBtn;