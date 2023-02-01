import {
  Button
} from "@chakra-ui/react";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import addresses from "@/contracts/addresses";
import BigDecimal from "decimal.js-light";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BIG_1E18 } from "@/helpers/misc";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";

const PlaceBid = ({isConnected,bid, id}:{isConnected: boolean, bid: number, id: number}) => {
  const bidValue = BigInt(new BigDecimal(bid).mul(BIG_1E18 + "").toFixed(0)) + ""
  
  const { config } = usePrepareContractWrite({
    address: addresses[1].address as `0x${string}`,
    abi: ABI_AUCTION_FILE,
    functionName: 'bid',
    args: [BigNumber.from(id), {value: bidValue}]
  })
  const { write } = useContractWrite(config)
 
  return (
    <Button
      onClick={() => write?.()}
      isDisabled={!isConnected}
      textStyle="button"
      bg="blue.primary"
      color="white"
      mt="39px"
      borderRadius={0}
      transition="all .3s"
      _hover={{ bg: "blue.hover" }}
    >
      place bid
    </Button>
  )
}

export default PlaceBid