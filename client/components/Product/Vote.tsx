import addresses from "@/contracts/addresses";
import { Button } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ABI_NOTARY from "@/contracts/abi/Notary.json";
import { useEffect } from "react";
import { useTransactionManager } from "@/context/TransactionManageProvider";

interface IProps {
  id: number;
  mark: boolean;
  title: string;
  variant: string;
  isNeededMarginTop?: boolean;
}

const Vote = ({ id, mark, title, variant, isNeededMarginTop }: IProps) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config } = usePrepareContractWrite({
    address: addresses[2].address as `0x${string}`,
    abi: ABI_NOTARY,
    functionName: 'vote',
    args: [id, mark]
  });
  const { write, isLoading, isSuccess, data } = useContractWrite(config);
  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading, onConfirm])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <Button
      mt={isNeededMarginTop ? "auto": 0}
      w="100%"
      textStyle="button"
      variant={variant}
      onClick={() => write?.()}
    >
      {title}
    </Button>
  );
};

export default Vote;
