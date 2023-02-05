import addresses from "@/contracts/addresses";
import { Button } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ABI_NOTARY from "@/contracts/abi/Notary.json";
import { useEffect } from "react";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import BigDecimal from "decimal.js-light";
import { BIG_1E18 } from "@/helpers/misc";

interface IProps {
  amount: number;
}

const Withdraw = ({ amount }: IProps) => {
  const withdrawAmount = BigInt(new BigDecimal(amount).mul(BIG_1E18 + "").toFixed(0)) + "";
  const { onConfirm, onTransaction } = useTransactionManager()
  const { config } = usePrepareContractWrite({
    address: addresses[2].address as `0x${string}`,
    abi: ABI_NOTARY,
    functionName: 'withdraw',
    args: [withdrawAmount]
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
      variant="darkBlue"
      minW="48%"
      textStyle="button"
      onClick={() => write?.()}
    >
      withdraw
    </Button>
  );
};

export default Withdraw;
