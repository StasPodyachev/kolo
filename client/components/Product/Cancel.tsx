import { Button } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import addresses from "@/contracts/addresses";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { useEffect } from "react";
interface IProps {
  id: number
}

const Cancel = ({ id }: IProps) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config: disputeConfig } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'cancel',
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
      Cancel
    </Button>
  );
};

export default Cancel;
