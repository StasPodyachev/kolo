import { Button, Flex, Heading, TabPanel, VStack } from "@chakra-ui/react";
import PanelInput from "./Panelnput";
import lighthouse from "@lighthouse-web3/sdk";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect, useState } from "react";

import ABI from "contracts/abi/GovernorContract.json";
import { useRouter } from "next/router";

declare var window: any;

const ContractWrite = ({ params, isEnabled }: any) => {
  const [done, setDone] = useState(false);
  const { contracts, values, calldatas, cid } = params;
  const { onConfirm, onTransaction } = useTransactionManager();

  console.log({ params, done });

  const { config } = usePrepareContractWrite({
    address: "0xb8C36F3477D62380b992311F4c1DB0c06565f76c",
    abi: ABI,
    functionName: "propose",
    args: [contracts, values, calldatas, cid],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const { push } = useRouter();

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
  }, [data]);

  // #1 Add new integration
  // ["0xf6092B5b95F6d91aab8Ff05B0Ff0e2751b26e47A"]
  // [0]
  // 0x4c287EFC6804304790A45beE0c85A98EA49EC0EF

  // const result = await fetch(
  //   `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`
  // );
  // console.log(await result.text());
  //["0xc6ae157a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000095d8a76c158c8b5a3a4935f186f37d083f2516e9"]

  if (isEnabled && !done) {
    write?.();
    setDone(true);
  }

  return <></>;
};

const CreatePanel = () => {
  const [description, setDescription] = useState("");
  const [contracts, setContracts] = useState("");
  const [values, setValues] = useState("");
  const [calldatas, setCalldatas] = useState("");
  const [validateParam, setValidateParam] = useState({} as any);

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
    if (!validateParam.description) return;
    // else if (validateParam.cid?.length > 0) setValidateParam({});

    // const { publicKey, signedMessage }: any = await encryptionSignature();
    const response = await lighthouse.uploadText(
      `${description} 
${calldatas}
${values}
${calldatas}`,
      "bb3be099-f338-4c1f-9f0c-a7eeb5caf65d"
    );
    console.log(response);

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
          {validateParam.validate && (
            <ContractWrite
              params={validateParam}
              isEnabled={validateParam.validate}
            />
          )}
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default CreatePanel;
