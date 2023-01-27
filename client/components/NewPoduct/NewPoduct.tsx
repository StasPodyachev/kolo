import addresses from "@/contracts/addresses";
import { getTodaysDate } from "@/helpers";
import { Box, Button, chakra, Flex, Heading, Input } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { useAccount } from "wagmi";
import ButtonContractWrite from "../ButtonContractWrite";
import ConnectBtn from "../ui/ConnectBtn";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

import ABI_FACTORY from '../../contracts/abi/Factory.json'

const API_KEY = "8a415179-7ab8-47b8-83e8-d1b3975740fe";
// const cid = "QmQT3e1Uce8gA57jvoamCUuA6otSTb6L5v2SCqsxscEtJK"

const labelStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "48px",
  minWidth: "278px",
  cursor: "pointer",
  background: "#004DE5",
  color: "white",
  fontSize: "16px",
  lineHeight: "24px",
  textTransform: "uppercase",
  borderRadius: "8px",
  marginTop: "36px",
};

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
  const [ access, setAcces ] = useState(false)

  return (
    <Flex justifyContent="center">
      <Box maxW="695px">
        {/* <Heading variant="h4" color="white">
          Step 1. Input Parameters
        </Heading> */}
        <Box ml="110px" mt="10px" maxW="585px">
          <Heading variant="h6" color="gray.200" mt="16px">
            Name
          </Heading>
          <CustomInput
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
          <Flex justifyContent="space-between" mt="32px">
            <Box>
              <Heading variant="h6" color="gray.200">
                Price Start
              </Heading>
              <NumberInput
                value={startPrice}
                setValue={setStartPrice}
                placeholder="Price in FIL"
                isNeededMarginTop
                isNotFullWidth
              />
            </Box>
            <Box>
              <Heading variant="h6" color="gray.200">
                Price Force Stop
              </Heading>
              <NumberInput
                value={forceStopPrice}
                setValue={setForceStopPrice}
                placeholder="Price in FIL"
                isNeededMarginTop
                isNotFullWidth
              />
            </Box>
          </Flex>
          <Flex justifyContent="space-between" mt="16px">
            <Box>
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
                minW="278px"
              />
            </Box>
            <Box>
              <Heading variant="h6" color="gray.200">
                My Collateral
              </Heading>
              <NumberInput
                value={myCollateral}
                setValue={setMyCollateral}
                placeholder="Amount in FIL"
                isNeededMarginTop
                isNotFullWidth
              />
            </Box>
          </Flex>
          {isConnected ? (
            <Flex justify="space-between">
              <label
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "48px",
                  minWidth: "278px",
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
                id="thubnailDownload"
                type="file"
                display="none"
                onChange={(e) => {
                  // deployEncrypted(e)
                }}
              />
              <label
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "48px",
                  minWidth: "278px",
                  cursor: "pointer",
                  background: "#696C80",
                  color: "white",
                  fontSize: "16px",
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  borderRadius: "8px",
                  marginTop: "36px",
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
            </Flex>
          ) : null}
          { isConnected && access ? (
            <CustomButton
              w="100%"
              bg="blue.primary"
              color="white"
              transition="all .3s"
              _hover={{ bg: "blue.active" }}
            >
              <ButtonContractWrite address={addresses[0]?.address} abi={ABI_FACTORY} method="create"  title="start sell" />
            </CustomButton>
          ) : (
            <ConnectBtn isCentered isNeedMarginTop />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default NewPoduct;
