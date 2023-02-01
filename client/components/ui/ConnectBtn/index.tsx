import useDevice from "@/hooks/useDevice";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface IProps {
  isCentered?: boolean;
  isNeedMarginTop?: boolean;
  isNeedSmallMarginTop?: boolean;
  isHeaderButton?: boolean;
}

const ConnectBtn = ({
  isCentered,
  isNeedMarginTop,
  isNeedSmallMarginTop,
  isHeaderButton,
}: IProps) => {
  const { isDesktopHeader, isDesktop } = useDevice();
  const isSmallScreen = useMediaQuery("(max-width: 1370px)");
  return (
    <Box
      mt={isNeedMarginTop ? "36px" : isNeedSmallMarginTop ? "8px" : 0}
      display={isCentered ? "flex" : "block"}
      justifyContent={isCentered ? "center" : "normal"}
      alignItems={isCentered ? "center" : "normal"}
      alignSelf={isCentered ? "center" : "baseline"}
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
      <ConnectButton
        label="CONNECT WALLET"
        showBalance={isHeaderButton && isDesktopHeader[0] ? true : false}
        chainStatus={isHeaderButton && isDesktop[0] ? "name" : "none"}
        accountStatus={isSmallScreen[0] ? "avatar" : "full"}
      />
    </Box>
  );
};

export default ConnectBtn;
