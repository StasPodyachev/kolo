// import { getDateTimeLocal, getTodaysDate } from "@/helpers";
import { getTodaysDate } from "@/helpers";
import { SaleTypeMenuItems } from "@/constants/shared";
import {
  Box,
  chakra,
  Flex,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import ButtonContractWrite from "../ButtonContractWrite";
import ConnectBtn from "../ui/ConnectBtn";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

import { BigNumber, ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

declare var window: any;

import useDevice from "@/hooks/useDevice";
import { ISaleTypeMenuItem } from "@/types";
import web3 from "web3";

const API_KEY = "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d";
export const CustomInput = chakra(Input, {
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

const CustomFormLabel = chakra(FormLabel, {
  baseStyle: {
    color: 'gray.200',
    m: 0,
    mt: '32px',
    fontSize: '20px',
    lineHeight: '28px',
  }
});

const GetIntegrationInfo = ({
  activeItem,
  startPrice,
  setValue,
  myCollateral,
}: {
  activeItem: ISaleTypeMenuItem;
  startPrice: string;
  setValue: (col: string) => void;
  myCollateral: string;
}) => {
  const { data } = useContractRead({
    address: activeItem.address as any,
    abi: activeItem.abi,
    functionName: "getIntegrationInfo",
  });
  useEffect(() => {
    let priceOfStart = +startPrice.split(",").join("");
    if (data) {
      const collateralAmountValue = BigNumber?.from(data.collateralAmount);
      const minCollateralAmount = +ethers.utils.formatEther(
        collateralAmountValue
      );
      const collateralPercentValue = BigNumber?.from(data.collateralAmount);
      const minCollateralPercent = +ethers.utils.formatEther(
        collateralPercentValue
      );
      const minimalCollateral =
      priceOfStart * minCollateralPercent > minCollateralAmount
          ? priceOfStart * minCollateralPercent
          : minCollateralAmount;
      const myCollateral =
        minimalCollateral >= (priceOfStart * minCollateralPercent) / 1e18
          ? minimalCollateral
          : priceOfStart * minCollateralPercent;

      const value =
        myCollateral > minimalCollateral
          ? myCollateral.toFixed(2)
          : minimalCollateral.toFixed(2);
      setValue(value);
    }
  }, [data, myCollateral, setValue, startPrice]);
  return <></>;
};

const NewPoduct = () => {
  const { isConnected, address } = useAccount();
  const [activeItem, setActiveItem] = useState(SaleTypeMenuItems[0]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startPrice, setStartPrice] = useState<string>("0.1");
  const [forceStopPrice, setForceStopPrice] = useState<string>("0.5");
  const [myCollateral, setMyCollateral] = useState("1");
  const [ stopDate, setStopDate ] = useState<any>();
  const [ nowDate, setNowDate] = useState<string>("")
  const [cid, setCid] = useState("");
  const [access, setAcces] = useState(false);
  const [fileName, setFileName] = useState("");
  const [thubnailName, setThubnailName] = useState("");
  const [isShownStartSell, setIsShownStartSell] = useState(false);



  const encryptionSignature = async () => {
    if (typeof window !== "undefined" && window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const messageRequested = (await lighthouse.getAuthMessage(address)).data
        .message;
      const signedMessage = await signer.signMessage(messageRequested);
      return {
        signedMessage: signedMessage,
        publicKey: address,
      };
    }
  };

  const progressCallback = ({
    total,
    uploaded,
  }: {
    total: number;
    uploaded: number;
  }) => {
    let percentageDone = 100 - total / uploaded;
  };

  const deployEncrypted = async (e: any, isFile: boolean) => {
    const { publicKey, signedMessage }: any = await encryptionSignature();
    const response = await lighthouse?.uploadEncrypted(
      e,
      publicKey,
      API_KEY,
      signedMessage,
      progressCallback
    );

    if (response?.data && isFile) {
      setFileName(response?.data?.Name);
    } else {
      setThubnailName(response?.data?.Name);
    }
    setCid(response?.data?.Hash);
    setAcces(true);

    const accesCondition = async () => {
      const { publicKey, signedMessage } : any = await encryptionSignature();
      const cidHex= web3.utils.asciiToHex(response?.data?.Hash).slice(2)
      const arrStr = ["0x" + cidHex.slice(0, 64), "0x" + cidHex.slice(64) + "000000000000000000000000000000000000"]
      const conditions = [
        {
          id: 1,
          chain: "Hyperspace",
          method: "checkAccess",
          standardContractType: "Custom",
          contractAddress: activeItem?.address,
          returnValueTest: {
          comparator: "==",
          value: "1"
          },
          parameters: [ arrStr, (cidHex.length)/2 ,':userAddress'],
          inputArrayType: [ 'bytes32[]', 'uint8', 'address' ],
          outputType: "uint8"
      }
      ]
      const aggregator = "([1])";
      const res = await lighthouse.accessCondition(
        publicKey,
        response?.data?.Hash,
        signedMessage,
        conditions,
        aggregator
      )
      if (res.data.status === 'Success') {
        setIsShownStartSell(true);
      }
    }
    accesCondition()
  };
  const { isDesktopHeader, isDesktop } = useDevice();
  const isItemNameError = itemName === '';
  const isItemDescriptionError = itemDescription === '';
  const isStartPriceError = startPrice === '0' || startPrice === '';
  const isForceStopPriceError = forceStopPrice === '0' || forceStopPrice === '';
  const isDateStopError = stopDate?.toString().length === 0;

  useEffect(() => {
    let today = new Date() as any;
    let dd = today.getDate() as any;
    let mm = today.getMonth() + 1 as any;
    let yyyy = today.getFullYear() as any;
    //
    let hh = today.getHours() <= 9 ? "0" + today.getHours() : today.getHours;
    let m = today.getMinutes() <= 9 ? "0" + today.getMinutes() : today.getMinutes();
    if (dd < 10) { dd = '0' + dd;}
    if (mm < 10) { mm = '0' + mm}
    today = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + m
    console.log(today, 'today');
    
    setNowDate(today)
    setStopDate(today)
    
  }, [])

  return (
    <Flex justifyContent="center">
      <Box maxW="70%" minW={isDesktop[0] ? 0 : "70%"}>
        <GetIntegrationInfo
          startPrice={startPrice}
          activeItem={activeItem}
          setValue={setMyCollateral}
          myCollateral={myCollateral}
        />
        {!address ? (
            <ConnectBtn isCentered isNeedMarginTop />
        ) : null}
        {address ? (
          <Box minW="100%">
          <Heading variant="h6" color="gray.200" mt="32px">
            Type of Sale
          </Heading>
          <SaleTypeMenu activeItem={activeItem} setActiveItem={setActiveItem} />
          <FormControl isRequired isInvalid={(isItemNameError && access)}>
            <CustomFormLabel>
              Name
            </CustomFormLabel>
            <CustomInput
              minW="100%"
              borderRadius={0}
              maxLength={70}
              value={itemName}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setItemName(event?.target?.value)
              }
              _invalid={{borderColor: 'inherit', boxShadow: 'none'}}
              w="100%"
              placeholder="Item name (up to 70 characters)"
            />
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={(isItemDescriptionError && access)}>
            <CustomFormLabel>
              Description
            </CustomFormLabel>
            <CustomInput
              minW="100%"
              borderRadius={0}
              maxLength={256}
              value={itemDescription}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setItemDescription(event.target.value)
              }
              _invalid={{borderColor: 'inherit', boxShadow: 'none'}}
              w="100%"
              placeholder="Description (up to 256 characters)"
            />
            <FormErrorMessage>Description is required</FormErrorMessage>
          </FormControl>
          <Flex
            w="100%"
            flexDir={isDesktop[0] ? "row" : "column"}
            gap={isDesktop[0] ? 0 : "16px"}
            justifyContent="space-between"
          >
            <Box w={(isDesktop[0] || isDesktopHeader[0]) && activeItem.title !== "SIMPLE TRADES OF FILES" ? "48%" : "100%"}>
              <FormControl isRequired isInvalid={(isStartPriceError && access)}>
                <CustomFormLabel>
                  Price Start
                </CustomFormLabel>
                <NumberInput
                  value={startPrice}
                  setValue={setStartPrice}
                  isNeededMarginTop
                  errorMessage="Price Start is required"
                />
              </FormControl>
            </Box>
            {activeItem.title !== "SIMPLE TRADES OF FILES" ? (<Box w={isDesktop[0] || isDesktopHeader[0] ? "48%" : "100%"}>
              <FormControl isRequired isInvalid={(isForceStopPriceError && access)}>
                <CustomFormLabel>
                  Price Force Stop
                </CustomFormLabel>
                <NumberInput
                  value={forceStopPrice}
                  setValue={setForceStopPrice}
                  isNeededMarginTop
                  errorMessage="Price Force Stop is required"
                />
              </FormControl>
            </Box>) : null}
          </Flex>
          <Flex
            justifyContent="space-between"
            flexDir={isDesktop[0] ? "row" : "column"}
            gap={isDesktop[0] ? 0 : "16px"}
          >
            <Box w={isDesktop[0] || isDesktopHeader[0] ? "48%" : "100%"}>
              <FormControl isRequired isInvalid={(isDateStopError && access)}>
                <CustomFormLabel>
                  Date Stop Auction
                </CustomFormLabel>
                {
                  nowDate && stopDate ?
                  <CustomInput
                    borderRadius={0}
                    type="datetime-local"
                    min={nowDate}
                    value={stopDate}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setStopDate(event?.target?.value as any);
                    }}
                    px="16px"
                    minW="100%"
                  /> : null
                }
                <FormErrorMessage>Date Stop Auction is required</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w={isDesktop[0] || isDesktopHeader[0] ? "48%" : "100%"}>
              <FormControl isRequired>
                <CustomFormLabel>
                  My Collateral
                </CustomFormLabel>
                <NumberInput
                  value={myCollateral}
                  setValue={setMyCollateral}
                  isNeededMarginTop
                  minValue={+startPrice * 0.1}
                />
              </FormControl>
            </Box>
          </Flex>
          {isConnected ? (
            <Flex
              justify="space-between"
              flexDir={isDesktop[0] ? "row" : "column"}
            >
              <Box w={isDesktop[0] || isDesktopHeader[0] ? "48%" : "100%"}>
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
                    marginTop: "36px",
                  }}
                  htmlFor="fileDownload"
                >
                  {fileName ? "file downloaded" : "download file"}
                </label>
                <Input
                  id="fileDownload"
                  type="file"
                  display="none"
                  onChange={(e) => {
                    deployEncrypted(e, true);
                  }}
                />
                {fileName ? (
                  <Text
                    color="green.primary"
                    textStyle="mediumText"
                    textAlign="center"
                    mt="16px"
                  >
                    {fileName.slice(0, 20)}
                  </Text>
                ) : null}
              </Box>
              <Box
                cursor="not-allowed"
                w={isDesktop[0] || isDesktopHeader[0] ? "48%" : "100%"}
              >
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
                  }}
                />
                {thubnailName ? (
                  <Text
                    color="green.primary"
                    textStyle="mediumText"
                    textAlign="center"
                    mt="16px"
                  >
                    {thubnailName}
                  </Text>
                ) : null}
              </Box>
            </Flex>
          ) : null}
          {isConnected && access && isShownStartSell ? (
            <ButtonContractWrite
              address={activeItem.address}
              abi={activeItem.abi}
              method="create"
              title="start sell"
              parrams={
                {
                  name: itemName,
                  description: itemDescription,
                  priceStart: startPrice,
                  priceForceStop: forceStopPrice,
                  dateExpire: stopDate,
                  cid,
                  collateral: myCollateral
                }
              }
              isDisabled={
                access  && startPrice && forceStopPrice && stopDate && myCollateral && fileName
                && itemName?.length && itemDescription?.length ? false : true}
            />
          ) : null}
        </Box>
        ) : null}
      </Box>
    </Flex>
  );
};

export default NewPoduct;
