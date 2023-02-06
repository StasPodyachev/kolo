import { Button } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import ABI_SIMPLE from "@/contracts/abi/SimpleTradeFile.json";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect } from "react";
interface IProps {
  id: number;
  collateral: BigNumber
  address: string
  type: number
}

const Dispute = ({ id, collateral, address, type}: IProps) => { 
  console.log(collateral, 'collateral');
   
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config: disputeConfig } = usePrepareContractWrite({
    address: address as `0x${string}`,
    abi: type === 0 ? ABI_AUCTION_FILE : ABI_SIMPLE,
    functionName: 'dispute',
    args: [id, {value: collateral}]
  });

  const { write, isLoading, isSuccess, data } = useContractWrite(disputeConfig);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <Button minW="170px" variant="blue" onClick={() => write?.()}>
      Dispute
    </Button>
  );
};

export default Dispute;
