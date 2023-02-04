import addresses from "@/contracts/addresses";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import BigDecimal from "decimal.js-light";
import { BIG_1E18 } from "@/helpers/misc";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BigNumber } from "ethers";
import {
  Button
} from "@chakra-ui/react";

const PlaceBid = ({isDisabled, price, id}:{isDisabled: boolean, price: string, id: number}) => {
  const bidValue = BigInt(new BigDecimal(price.length && price).mul(BIG_1E18 + "").toString()) + ""
  const { config } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'bid',
    args: [BigNumber.from(id), {value: bidValue}]
  })
  const { write } = useContractWrite(config)
  return (
    <Button
      minW="170px"
      minH="48px"
      onClick={() => write?.()}
      isDisabled={isDisabled}
      textStyle="button"
      bg="blue.primary"
      color="white"
      borderRadius={0}
      transition="all .3s"
      _hover={{ bg: "blue.hover" }}
    >
      place bid
    </Button>
  )
}

export default PlaceBid
