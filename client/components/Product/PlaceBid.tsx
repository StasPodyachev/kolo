import {
  Button
} from "@chakra-ui/react";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import addresses from "@/contracts/addresses";
import BigDecimal from "decimal.js-light";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BIG_1E18 } from "@/helpers/misc";
import { BigNumber } from "ethers";

const PlaceBid = ({isDisabled,bid,id}:{isDisabled: boolean, bid: string, id: number}) => {
  console.log(isDisabled,bid,id, 'bid')
  const bidValue = BigInt(new BigDecimal(bid).mul(BIG_1E18 + "").toFixed(0)) + ""  
  console.log(bidValue, 'bidValue', BigNumber.from(id))
  const { config } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'bid',
    args: [BigNumber.from(id), {value: bidValue}]
  })
  const { write } = useContractWrite(config)
 
  return (
    <Button
      w="100%"
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
      Buy now
    </Button>
  )
}

export default PlaceBid