import {
  Button
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import BigDecimal from "decimal.js-light";
import { BIG_1E18 } from "@/helpers/misc";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import ABI_SIMPLE from "@/contracts/abi/SimpleTradeFile.json";

import { useTransactionManager } from "../../context/TransactionManageProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";

const BuyNow = ({isDisabled, id, price, address, type}:
  {isDisabled: boolean,id: number, price: number, address: string, type: number}) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const priceValue = BigInt(new BigDecimal(price).mul(BIG_1E18 + "").toFixed(0)) + ""
  const { config } = usePrepareContractWrite({
    address: address as `0x${string}`,
    abi: type === 0 ? ABI_AUCTION_FILE : ABI_SIMPLE,
    functionName: type === 0 ? 'bid' : "buy",
    args: [BigNumber.from(id), {value: priceValue}]
  })
  const { write, isLoading, data, isSuccess } = useContractWrite(config)
  const { push } = useRouter()

  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading, onConfirm])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
      push('/dashboard')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Button
      mt="auto"
      w="100%"
      onClick={() => write?.()}
      isDisabled={isDisabled}
      minH="48px"
      bg="green.primary"
      color="white"
      textStyle="button"
      transition="all .3s"
      _hover={{ bg: "green.hover" }}
      borderRadius={0}
    >
      buy now
    </Button>
  )
}

export default BuyNow
