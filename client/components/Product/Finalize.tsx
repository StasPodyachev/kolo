/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import addresses from "@/contracts/addresses";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect } from "react";
import { BigNumber } from "ethers";
interface IProps {
  id: number;
  collateral: BigNumber
}

const Finalize = ({ id, collateral }: IProps) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config: finalizeConfig } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'finalize',
    args: [id]
  });

  const { write, isLoading, isSuccess, data } = useContractWrite(finalizeConfig);
  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading, onConfirm])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
      // push('/dashboard')
    }
  }, [data])
  return (
    <Button minW="170px" variant="blue" onClick={() => write?.()}>
      Finalize
    </Button>
  );
};

export default Finalize;
