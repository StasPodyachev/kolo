import { Box, Button, chakra, Flex, Heading, Input } from "@chakra-ui/react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import React, { ChangeEvent, useState } from "react";
import NumberInput from "../ui/NumberInput/NumberInput";
import SaleTypeMenu from "./SaleTypeMenu";

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
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [forceStopPrice, setForceStopPrice] = useState(0);
  const [myCollateral, setMyCollateral] = useState(0);
  const [stopDate, setStopDate] = useState("");
  const [cid, setCid] = useState("");
  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const applyAccessConditions = async () => {
    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "Hyperspace",
        method: "balanceOf",
        standardContractType: "ERC721",
        contractAddress: "0x1a6ceedD39E85668c233a061DBB83125847B8e3A",
        returnValueTest: { comparator: ">=", value: "1" },
        parameters: [":userAddress"],
      },
    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );
    console.log(response);
  };

  // const progressCallback = (progressData) => {
  //   let percentageDone =
  //     100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  //   console.log(percentageDone);
  // };

  // const deployEncrypted = async (e) => {
  //   const sig = await encryptionSignature();
  //   const response = await lighthouse.uploadEncrypted(
  //     e,
  //     sig.publicKey,
  //     API_KEY,
  //     sig.signedMessage,
  //     progressCallback
  //   );
  //   console.log(response);
  //   setCid(response.data.Hash);
  // };

  return (
    // <div className="App">
    //   <input onChange={ e => deployEncrypted(e)} type="file" />
    //   <button onClick={()=>{applyAccessConditions()}}>Apply Access Consitions</button>
    // </div>
    <Box>
      <Heading variant="h4" color="white">
        Step 1. Input Parameters
      </Heading>
      <Box ml="110px" mt="10px" maxW="585px">
        <Heading variant="h6" color="gray.200" mt="16px">
          Name
        </Heading>
        <CustomInput
          value={itemName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setItemName(event.target.value)
          }
          w="100%"
          placeholder="Item name (up to 70 characters)"
        />
        <Heading variant="h6" color="gray.200" mt="16px">
          Description
        </Heading>
        <CustomInput
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
              value={stopDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setStopDate(event.target.value)
              }
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
              isNeededMarginTop
              isNotFullWidth
            />
          </Box>
        </Flex>
        <Flex justify="space-between">
          <CustomButton
            minW="278px"
            bg="blue.primary"
            color="white"
            transition="all .3s"
            _hover={{ bg: "blue.active" }}
          >
            download file
          </CustomButton>
          <CustomButton
            minW="278px"
            bg="gray.500"
            color="white"
            transition="all .3s"
            _hover={{ bg: "gray.600" }}
          >
            download thubnail
          </CustomButton>
        </Flex>
        <CustomButton
          w="100%"
          bg="blue.primary"
          color="white"
          transition="all .3s"
          _hover={{ bg: "blue.active" }}
        >
          record item
        </CustomButton>
      </Box>
      <Heading mt="60px" variant="h4" color="white">
        Step 2. Provide access
      </Heading>
      <CustomButton
        ml="110px"
        w="585px"
        bg="blue.primary"
        color="white"
        transition="all .3s"
        _hover={{ bg: "blue.active" }}
      >
        share access to protocol
      </CustomButton>
      <Heading mt="60px" variant="h4" color="white">
        Step 3. Start Sell
      </Heading>
      <CustomButton
        ml="110px"
        minW="585px"
        bg="blue.primary"
        color="white"
        transition="all .3s"
        _hover={{ bg: "blue.active" }}
      >
        start sell
      </CustomButton>
    </Box>
  );
};

export default NewPoduct;
