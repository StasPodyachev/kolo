import { Button, Flex, Heading, TabPanel, VStack } from "@chakra-ui/react";
import PanelInput from "./Panelnput";
import lighthouse from "@lighthouse-web3/sdk";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect, useState } from "react";

import ABI from "contracts/abi/GovernorContract.json";
import { useRouter } from "next/router";

const ContractWrite = ({ params, isEnabled }: any) => {
  // #1 Add new integration
  // ["0xf6092B5b95F6d91aab8Ff05B0Ff0e2751b26e47A"]
  // [0]
  // 0x4c287EFC6804304790A45beE0c85A98EA49EC0EF
  // const result = await fetch(
  //   `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`
  // );
  // console.log(await result.text());
  //["0xc6ae157a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000095d8a76c158c8b5a3a4935f186f37d083f2516e9"]
};

const CreatePanel = () => {
  const [description, setDescription] = useState("#1 Add new integration");
  const [contracts, setContracts] = useState(
    '["0xf6092B5b95F6d91aab8Ff05B0Ff0e2751b26e47A"]'
  );
  const [values, setValues] = useState("[0]");
  const [calldatas, setCalldatas] = useState(
    '["0xc6ae157a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000095d8a76c158c8b5a3a4935f186f37d083f2516e9"]'
  );
  const [validateParam, setValidateParam] = useState({} as any);
  const [isTx, setIsTx] = useState(false);

  const { onConfirm, onTransaction } = useTransactionManager();

  const { config } = usePrepareContractWrite({
    address: "0x5f5337939298e199A361c284d5e0Dad3518b144a",
    abi: ABI,
    functionName: "propose",
    args: [
      validateParam.contracts,
      validateParam.values,
      validateParam.calldatas,
      description,
      validateParam.cid,
    ],
    // enabled: validateParam.validate,
  });

  console.log({ config });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const { push } = useRouter();

  useEffect(() => {
    if (isLoading || isSuccess || isTx) return;
    if (write) {
      setIsTx(true);
      write?.();
    }
  }, [isLoading, isSuccess, isTx, write]);

  useEffect(() => {
    if (isLoading) {
      onConfirm();
    }
  }, [isLoading, onConfirm]);

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash);
      push("/dashboard");
    }
  }, [data, isSuccess, onTransaction, push]);

  const validate = () => {
    const params = {} as any;

    if (description != "") {
      try {
        params.description = description;
        params.contracts = JSON.parse(contracts);
        params.values = JSON.parse(values);
        params.calldatas = JSON.parse(calldatas);
        params.validate = true;

        return params;
      } catch {}
    }
    return { validate: false };
  };

  useEffect(() => {
    const params = validate();
    if (params.validate) {
      setValidateParam({ description: params.description });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, contracts, values, calldatas]);

  const uploadText = async () => {
    setIsTx(false);
    if (!validateParam.description) return;
    // else if (validateParam.cid?.length > 0) setValidateParam({});

    // const { publicKey, signedMessage }: any = await encryptionSignature();
    const response = await lighthouse.uploadText(
      `${description} 
${values}
${values}
${calldatas}`,
      "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d"
    );
    console.log({ response });

    const params = validate();

    if (params.validate) {
      params.cid = response.data.Hash;
      params.description = undefined;

      setValidateParam(params);
    }
  };

  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto">
        <Heading variant="h3" color="white" textAlign="center">
          Create Proposal
        </Heading>
        <Flex flexDir="column" gap="24px" mt="24px">
          <PanelInput
            title="Description"
            placeholder="Description up to 256 characters"
            value={description}
            onChange={(e: any) => {
              setDescription(e.target.value);
            }}
          />
          <PanelInput
            title="Address Target"
            value={contracts}
            onChange={(e: any) => {
              setContracts(e.target.value);
            }}
            placeholder="address[]"
          />
          <PanelInput
            title="Values"
            value={values}
            onChange={(e: any) => {
              setValues(e.target.value);
            }}
            placeholder="uint256[]"
          />
          <PanelInput
            value={calldatas}
            title="Calldatas"
            onChange={(e: any) => {
              setCalldatas(e.target.value);
            }}
            placeholder="bytes[]"
          />
          <Button
            textStyle="button"
            w="100%"
            minH="48px"
            mt="36px"
            bg="blue.primary"
            color="white"
            borderRadius={0}
            transition="all .3s"
            _hover={{ bg: "blue.active" }}
            onClick={() => uploadText()}
          >
            {"create propose"}
          </Button>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default CreatePanel;
