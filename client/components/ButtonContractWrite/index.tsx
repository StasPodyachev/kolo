/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import BigDecimal from "decimal.js-light";
import { BIG_1E18 } from "@/helpers/misc";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import web3 from "web3"
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useRouter } from "next/router";
interface IProps {
  title: string;
  address: any;
  abi: any;
  method: string;
  parrams: any;
  isDisabled: boolean;
}

const ButtonContractWrite = ({ title, address, abi, method, parrams, isDisabled }: IProps) => {
  const { name, description, priceStart, priceForceStop, dateExpire, cid, collateral} = parrams
  const date = new Date(dateExpire);
  const newDateExpire = date.getTime();
  const { onConfirm,onTransaction } = useTransactionManager();

  const newPriceStart = BigInt(new BigDecimal(priceStart.length && priceStart).mul(BIG_1E18 + "").toFixed(0)) + ""
  const newForceStop = BigInt(new BigDecimal(priceForceStop.length && priceForceStop).mul(BIG_1E18 + "").toFixed(0)) + ""
  const newCollateral = BigInt(new BigDecimal(collateral.length && collateral).mul(BIG_1E18 + "").toFixed(0)) + ""

  let newCid = web3.utils.asciiToHex(cid)
  const { config } = usePrepareContractWrite({
    address,
    abi,
    functionName: method,
    args: [name, description, newPriceStart, newForceStop, newDateExpire, newCid,
      {value: newCollateral}],
  })

  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  const {push} = useRouter()
  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
      push('/dashboard')
    }
  }, [data])

  return (
    <Button
      isDisabled={isDisabled && isSuccess}
      textStyle="button"
      w="100%"
      minH="48px"
      mt="36px"
      bg="blue.primary"
      color="white"
      borderRadius={0}
      transition="all .3s"
      _hover={{ bg: "blue.active" }}
      onClick={() => write?.()}
    >
      {title}
    </Button>
  );
};

export default ButtonContractWrite
