import { Button } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import addresses from "@/contracts/addresses";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import ABI_SIMPLE from "@/contracts/abi/SimpleTradeFile.json";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect } from "react";
interface IProps {
  id: number
  address: string
  type: number
}

const Reward = ({ id, address, type }: IProps) => {
  console.log(id, address, type, 'id, address, type');
  
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config: disputeConfig } = usePrepareContractWrite({
    address: address as `0x${string}`,
    abi: type === 0 ? ABI_AUCTION_FILE : ABI_SIMPLE,
    functionName: 'receiveReward',
    args: [id]
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
      Recive Reward
    </Button>
  );
};

export default Reward;