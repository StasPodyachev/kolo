import {
  Button
} from "@chakra-ui/react";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import addresses from "@/contracts/addresses";
import BigDecimal from "decimal.js-light";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BIG_1E18 } from "@/helpers/misc";
import { BigNumber } from "ethers";

const BuyNow = ({isDisabled, price, id}:{isDisabled: boolean, price: number, id: number}) => {
  const priceValue = BigInt(new BigDecimal(price).mul(BIG_1E18 + "").toFixed(0)) + ""
  const { config } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'bid',
    args: [BigNumber.from(id), {value: priceValue}]
  })
  const { write } = useContractWrite(config)
 
  return (
    <Button
      mt="auto"
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
      place bid
    </Button>
  )
}

export default BuyNow