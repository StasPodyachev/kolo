import addresses from "@/contracts/addresses";
import {
  Button,
} from "@chakra-ui/react";
import ABI_FACTORY from "../../contracts/abi/Factory.json";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const CreateStore = () => {
  const { config } = usePrepareContractWrite({
    address: addresses[0]?.address as `0x${string}`,
    abi: ABI_FACTORY,
    functionName: 'createStore',
  })

  const { write: create } = useContractWrite(config)
  return (
    <Button
      mt={10}
      minH="48px"
      w="100%"
      bg="blue.primary"
      color="white"
      textStyle="button"
      borderRadius={0}
      transition="all .3s"
      _hover={{ bg: "blue.hover" }}
      onClick={() => create?.()}
    >
      Create Store
    </Button>
  )
}

export default CreateStore