import addresses from "@/contracts/addresses";
import { getTodaysDate } from "@/helpers";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Input,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { ChangeEvent, useDebugValue, useState } from "react";
import { useAccount } from "wagmi";
import ButtonContractWrite from "../ButtonContractWrite";
import ConnectBtn from "../ui/ConnectBtn";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

import ABI_FACTORY from "../../contracts/abi/Factory.json";
import useDevice from "@/hooks/useDevice";

const API_KEY = "8a415179-7ab8-47b8-83e8-d1b3975740fe";
// const cid = "QmQT3e1Uce8gA57jvoamCUuA6otSTb6L5v2SCqsxscEtJK"

const CustomInput = chakra(Input, {
  baseStyle: {
    bg: "gray.700",
    minH: "48px",
    mt: "16px",
    _placeholder: {
      color: "white",
    },
    _focusVisible: {
      boxShadow: "none",
      border: "1px solid",
      borderColor: "gray.300",
    },
  },
});

const CustomButton = chakra(Button, {
  baseStyle: {
    textStyle: "button",
    minH: "48px",
    mt: "36px",
  },
});

const NewPoduct = () => {
  const { isConnected } = useAccount();
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startPrice, setStartPrice] = useState(0.0);
  const [forceStopPrice, setForceStopPrice] = useState(0.0);
  const [myCollateral, setMyCollateral] = useState(0.0);
  const [stopDate, setStopDate] = useState("");
  const [cid, setCid] = useState("");
  const [access, setAcces] = useState(false);
  const { isDesktopHeader, isDesktop } = useDevice();
  const isSmallTablet = useMediaQuery("(max-width: 867px)");

  return (
    <Flex justifyContent="center">
      <Box maxW="70%">
        <Heading variant={isSmallTablet[0] ? "h5" : "h4"} color="white">
          Step 1. Input Parameters
        </Heading>
        <Box ml={isDesktopHeader[0] ? "110px" : "20px"} mt="10px" minW="100%">
          <Heading variant="h6" color="gray.200" mt="16px">
            Name
          </Heading>
          <CustomInput
            minW="100%"
            maxLength={70}
            value={itemName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setItemName(event?.target?.value)
            }
            w="100%"
            placeholder="Item name (up to 70 characters)"
          />
          <Heading variant="h6" color="gray.200" mt="16px">
            Description
          </Heading>
          <CustomInput
            minW="100%"
            maxLength={256}
            value={itemDescription}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setItemDescription(event.target.value)
            }
            w="100%"
            placeholder="Description (up to 256 characters)"
          />
          <Heading variant="h6" color="gray.200" mt="16px">
            Type of Sale
          </Heading>
          <SaleTypeMenu />
          <Flex
            w="100%"
            flexDir={isDesktop[0] ? "row" : "column"}
            gap={isDesktop[0] ? 0 : "16px"}
            justifyContent="space-between"
            mt="32px"
          >
            <Box
              minW="42%"
              maxW={isDesktop[0] && !isDesktopHeader[0] ? "42%" : "100%"}
            >
              <Heading variant="h6" color="gray.200">
                Price Start
              </Heading>
              <NumberInput
                value={startPrice}
                setValue={setStartPrice}
                placeholder="Price in FIL"
                isNeededMarginTop
              />
            </Box>
            <Box
              minW="42%"
              maxW={isDesktop[0] && !isDesktopHeader[0] ? "42%" : "100%"}
            >
              <Heading variant="h6" color="gray.200">
                Price Force Stop
              </Heading>
              <NumberInput
                value={forceStopPrice}
                setValue={setForceStopPrice}
                placeholder="Price in FIL"
                isNeededMarginTop
              />
            </Box>
          </Flex>
          <Flex
            justifyContent="space-between"
            mt="16px"
            flexDir={isDesktop[0] ? "row" : "column"}
            gap={isDesktop[0] ? 0 : "16px"}
          >
            <Box
              minW="42%"
              maxW={isDesktop[0] && !isDesktopHeader[0] ? "42%" : "100%"}
            >
              <Heading variant="h6" color="gray.200">
                Date Stop Auction
              </Heading>
              <CustomInput
                type="datetime-local"
                min={getTodaysDate()}
                value={stopDate}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setStopDate(event.target.value);
                }}
                px="16px"
                minW="100%"
              />
            </Box>
            <Box
              minW="42%"
              maxW={isDesktop[0] && !isDesktopHeader[0] ? "42%" : "100%"}
            >
              <Heading variant="h6" color="gray.200">
                My Collateral
              </Heading>
              <NumberInput
                value={myCollateral}
                setValue={setMyCollateral}
                placeholder="Amount in FIL"
                isNeededMarginTop
              />
            </Box>
          </Flex>
          {isConnected ? (
            <Flex
              justify="space-between"
              flexDir={isDesktop[0] ? "row" : "column"}
            >
              <Box minW="42%">
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                    minWidth: "100%",
                    cursor: "pointer",
                    background: "#004DE5",
                    color: "white",
                    fontSize: "16px",
                    lineHeight: "24px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    marginTop: "36px",
                  }}
                  htmlFor="fileDownload"
                >
                  download file
                </label>
                <Input
                  id="fileDownload"
                  type="file"
                  display="none"
                  onChange={(e) => {
                    // deployEncrypted(e)
                  }}
                />
              </Box>
              <Box cursor="not-allowed" minW="42%">
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                    minWidth: "100%",
                    background: "#696C80",
                    color: "white",
                    fontSize: "16px",
                    lineHeight: "24px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    marginTop: "36px",
                    pointerEvents: "none",
                  }}
                  htmlFor="thubnailDownload"
                >
                  download thubnail
                </label>
                <Input
                  id="fileDownload"
                  type="file"
                  display="none"
                  onChange={(e) => {
                    // deployEncrypted(e)
                  }}
                />
              </Box>
            </Flex>
          ) : null}
          {isConnected && access ? (
            <ButtonContractWrite
              address={addresses[0]?.address}
              abi={ABI_FACTORY}
              method="create"
              title="start sell"
            />
          ) : (
            <ConnectBtn isCentered isNeedMarginTop />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default NewPoduct;
