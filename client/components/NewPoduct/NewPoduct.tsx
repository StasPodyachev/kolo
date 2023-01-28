import addresses from "@/contracts/addresses";
import { getTodaysDate } from "@/helpers";
import { SaleTypeMenuItems } from "@/constants/shared";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Input
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import ButtonContractWrite from "../ButtonContractWrite";
import ConnectBtn from "../ui/ConnectBtn";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

import { BigNumber, ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';

declare var window: any

import ABI_FACTORY from "../../contracts/abi/Factory.json";
import { ISaleTypeMenuItem } from "@/types";

const API_KEY = "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d";
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

const GetIntegrationInfo = ({activeItem, startPrice} : {activeItem: ISaleTypeMenuItem, startPrice: number}) => {
  const { data } = useContractRead({
    address: activeItem.address as any,
    abi: activeItem.abi,
    functionName: "getIntegrationInfo",
  });
  useEffect(() => {
    if (data) {
      console.log(data, 'data');
      const collateralAmountValue = BigNumber?.from(data.collateralAmount)
      const minCollateralAmount = +ethers.utils.formatEther(collateralAmountValue)
      const collateralPercentValue = BigNumber?.from(data.collateralAmount)
      const minCollateralPercent = +ethers.utils.formatEther(collateralPercentValue)
      console.log({minCollateralPercent, minCollateralAmount})
      const value = startPrice * minCollateralPercent > minCollateralAmount ? startPrice * minCollateralPercent : minCollateralAmount
      console.log(value, 'value');
      // value >= (priceStart * minCollateralPercent) / 1e18 && value >= minCollateralAmount
    }
  }, [data, startPrice])
  return <></>
}

const NewPoduct = () => {
  const { isConnected } = useAccount();
  const [activeItem, setActiveItem] = useState(SaleTypeMenuItems[0]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startPrice, setStartPrice] = useState<number>(1);
  const [forceStopPrice, setForceStopPrice] = useState<number>(10);
  const [myCollateral, setMyCollateral] = useState(0.0);
  const [stopDate, setStopDate] = useState("");
  const [cid, setCid] = useState("");
  const [ access, setAcces ] = useState(false)

  const encryptionSignature = async () => {
    if (typeof window !== "undefined" && window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
      const signedMessage = await signer.signMessage(messageRequested);
      return({
        signedMessage: signedMessage,
        publicKey: address
      });
    }
  }

  const progressCallback = ({total, uploaded}:{total: number, uploaded: number}) => {
    let percentageDone = 100 - (total / uploaded);
    console.log(percentageDone.toFixed(2));
  };

  const deployEncrypted = async(e: any) => {
    const { publicKey,signedMessage } : any = await encryptionSignature();
    const response = await lighthouse?.uploadEncrypted(
      e,
      publicKey,
      API_KEY,
      signedMessage,
      progressCallback
    );
    console.log(response);
    const conditionsId = await lighthouse?.getAccessConditions(response?.data?.Hash)
    setCid(response?.data?.Hash)
    console.log({
      activeItem: activeItem?.address, cid: response?.data?.Hash,
      conditionsId: conditionsId
    });

    // const accesCondition = async () => {
    //   const { publicKey, signedMessage } : any = await encryptionSignature();
    //   const conditions = [
    //     {
    //       id: 1,
    //       chain: 'Hyperspace',
    //       method: 'checkAccess',
    //       standardContractType: 'Custom',
    //       contractAddress: activeItem?.address,
    //       returnValueTest: { comparator: '==', value: '1' },
    //       parameters: [ [response?.data?.Hash],':userAddress'],
    //       inputArrayType: [ 'bytes32[]', 'address' ],
    //       outputType: 'uint8'
    //     }
    //   ]
    //   const aggregator = "([1])";
    //   const res = await lighthouse.accessCondition(
    //     publicKey,
    //     response?.data?.Hash,
    //     signedMessage,
    //     conditions,
    //     aggregator
    //   )
    //   console.log(res, 'res')
    // }
    // accesCondition()
  }

  return (
    <Flex justifyContent="center">
      <Box maxW="695px">
        <GetIntegrationInfo startPrice={startPrice} activeItem={activeItem}/>
        {/* <Heading variant="h4" color="white">
          Step 1. Input Parameters
        </Heading> */}
        <Box ml="110px" mt="10px" minW="585px">
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
          <SaleTypeMenu activeItem={activeItem} setActiveItem={setActiveItem} />
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
                htmlFor="fileDownload">
                download file
              </label>
              <Input
                id="fileDownload"
                type="file"
                display="none"
                onChange={e => deployEncrypted(e)}
              />
              <Box cursor="not-allowed">
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                    minWidth: "278px",
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
          ) : !isConnected ? (
            <ConnectBtn isCentered isNeedMarginTop />
          ) : null}
        </Box>
      </Box>
    </Flex>
  );
};

export default NewPoduct;
