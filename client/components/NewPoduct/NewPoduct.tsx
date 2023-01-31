import addresses from "@/contracts/addresses";
import { getTodaysDate } from "@/helpers";
import { SaleTypeMenuItems } from "@/constants/shared";
import {
  Box,
  Button,
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
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import ButtonContractWrite from "../ButtonContractWrite";
import ConnectBtn from "../ui/ConnectBtn";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

import { BigNumber, ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

declare var window: any;

import ABI_FACTORY from "../../contracts/abi/Factory.json";
import useDevice from "@/hooks/useDevice";
import { ISaleTypeMenuItem } from "@/types";

const API_KEY = "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d";
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

const CustomFormLabel = chakra(FormLabel, {
  baseStyle: {
    color: 'gray.200',
    m: 0,
    mt: '32px',
    fontSize: '20px',
    lineHeight: '28px',
  }
});

const CreateStore = ({address} : {address: string}) => {
  const { config } = usePrepareContractWrite({
    address: addresses[0].address as `0x${string}`,
    abi: ABI_FACTORY,
    functionName: 'createStore',
  })
  const { write: create } = useContractWrite(config)
  return (
    <Button
      mt={10}
      minH="48px"
      w="100%"
      bg="blue.primary"
      color="white"
      textStyle="button"
      borderRadius={0}
      transition="all .3s"
      _hover={{ bg: "blue.hover" }}
      onClick={() => create?.()}
    >
      Create Store
    </Button>
  )
}

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
    console.log("price", priceOfStart);
    if (data) {
      // console.log(data, "data");
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
      // console.log(minimalCollateral.toFixed(2), "value");
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
  const [startPrice, setStartPrice] = useState<string>("1");
  const [forceStopPrice, setForceStopPrice] = useState<string>("10");
  const [myCollateral, setMyCollateral] = useState("1");
  const [stopDate, setStopDate] = useState(getTodaysDate());
  const [cid, setCid] = useState("");
  const [access, setAcces] = useState(true);
  const [ isStore, setIsStore] = useState(false)
  const [fileName, setFileName] = useState("");
  const [thubnailName, setThubnailName] = useState("");

  const { data: store } = useContractRead({
    address: addresses[0].address as `0x${string}`,
    abi: ABI_FACTORY,
    functionName: 'getStore',
    args: [address]
  })

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
    console.log(percentageDone.toFixed(2));
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
    console.log(response);
    const conditionsId = await lighthouse?.getAccessConditions(
      response?.data?.Hash
    );
    if (response?.data && isFile) {
      setFileName(response?.data?.Name);
    } else {
      setThubnailName(response?.data.Name);
    }
    setCid(response?.data?.Hash);
    setAcces(true);

    // const accesCondition = async () => {
    //   const { publicKey, signedMessage } : any = await encryptionSignature();
    //   const conditions = [
    //     {
    //       id: 1,
    //       chain: "Hyperspace",
    //       method: "checkAccess",
    //       standardContractType: "Custom",
    //       contractAddress: "0x49bD7e073c52cb831cBFebfc894A751a09c3521D",
    //       returnValueTest: {
    //       comparator: "==",
    //       value: "1"
    //       },
    //       parameters: [':userAddress', ':userAddress',':userAddress'],
    //       inputArrayType: ['bytes32[]', 'uint8', 'address'],
    //       outputType: "uint8"
    //   }
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
  };
  const { isDesktopHeader, isDesktop } = useDevice();
  const isItemNameError = itemName === '';
  const isItemDescriptionError = itemDescription === '';
  const isStartPriceError = startPrice === '0';
  const isForceStopPriceError = forceStopPrice === '0';
  const isDateStopError = stopDate === '';

  useEffect(() => {
    console.log(store, 'store');
    if (store === '0x0000000000000000000000000000000000000000') {
      setIsStore(false);

    } if (store !== '0x0000000000000000000000000000000000000000') {
      setIsStore(true)
    } else {

    }
  }, [store])

  return (
    <Flex justifyContent="center">
      <Box maxW="70%" minW={isDesktop[0] ? 0 : "70%"}>
        <GetIntegrationInfo
          startPrice={startPrice}
          activeItem={activeItem}
          setValue={setMyCollateral}
          myCollateral={myCollateral}
        />
        {!isStore && address
          ? <CreateStore address={address as `0x${string}`} /> : null}
        <Box minW="100%">
          <Heading variant="h6" color="gray.200" mt="32px">
            Type of Sale
          </Heading>
          <SaleTypeMenu activeItem={activeItem} setActiveItem={setActiveItem} />
          <FormControl isRequired isInvalid={isItemNameError}>
            <CustomFormLabel>
              Name
            </CustomFormLabel>
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
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={isItemDescriptionError}>
            <CustomFormLabel>
              Description
            </CustomFormLabel>
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
            <FormErrorMessage>Description is required</FormErrorMessage>
          </FormControl>
          <Flex
            w="100%"
            flexDir={isDesktop[0] ? "row" : "column"}
            gap={isDesktop[0] ? 0 : "16px"}
            justifyContent="space-between"
          >
            <Box w={(isDesktop[0] || isDesktopHeader[0]) && activeItem.title !== "SIMPLE TRADES OF FILES" ? "48%" : "100%"}>
              <FormControl isRequired isInvalid={isStartPriceError}>
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
              <FormControl isRequired isInvalid={isForceStopPriceError}>
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
              <FormControl isRequired isInvalid={isDateStopError}>
                <CustomFormLabel>
                  Date Stop Auction
                </CustomFormLabel>
                <CustomInput
                  type="datetime-local"
                  min={getTodaysDate()}
                  value={stopDate}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    console.log('date time', typeof event, event)
                    // const start = Date.now() - event.target.value
                    setStopDate(event.target.value);
                  }}
                  px="16px"
                  minW="100%"
                />
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
                  minValue={+startPrice.split(",").join("") * 0.1}
                  isCollateralInput
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
                  download file
                </label>
                <Input
                  id="fileDownload"
                  type="file"
                  display="none"
                  onChange={(e) => {
                    console.log('NOW HERE', e)
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
                    {fileName}
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
                    // deployEncrypted(e, false)
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
          {isConnected && access ? (
            <ButtonContractWrite
              address={activeItem.address}
              abi={activeItem.abi}
              method="create"
              title="start sell"
              parrams={
                {
                  name: itemName,
                  description: itemDescription,
                  collateral: myCollateral,
                  priceStart: startPrice,
                  priceForceStop: forceStopPrice,
                  dateExpire: stopDate,
                  collateral: myCollateral,
                  cid,
                }
              }
              isDisabled={
                (itemName && itemDescription && startPrice && forceStopPrice && stopDate && myCollateral && fileName && thubnailName)
                 ? false : true
              }
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
