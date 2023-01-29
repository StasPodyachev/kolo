import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import BigDecimal from "decimal.js-light";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BIG_1E18 } from "@/helpers/misc";
import web3 from "web3"
interface IProps {
  title: string;
  address: any;
  abi: any;
  method: string;
  parrams: any
}

const ButtonContractWrite = ({ title, address, abi, method, parrams }: IProps) => {
  const { name, description, priceStart, priceForceStop, dateExpire,  cid} = parrams
  console.log();
  const date = new Date(dateExpire);
  const newDateExpire = date.getTime();
  const newPriceStart = BigInt(new BigDecimal(priceStart).mul(BIG_1E18 + "").toFixed(0)) + "";
  const newForceStop = BigInt(new BigDecimal(priceForceStop).mul(BIG_1E18 + "").toFixed(0)) + "";
  let newCid = web3.utils.asciiToHex(cid)  
  const { config } = usePrepareContractWrite({
    address,
    abi,
    functionName: method,
    args: [name, description, newPriceStart, newForceStop, newDateExpire, newCid]
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    console.log(data, 'data');
    
  }, [data])

  return isSuccess ? null : isLoading ? (
    <Button textStyle="button">Loading...</Button>
  ) : (
    <Button
      isDisabled={!write}
      textStyle="button"
      w="100%"
      minH="48px"
      mt="36px"
      bg="blue.primary"
      color="white"
      transition="all .3s"
      _hover={{ bg: "blue.active" }}
      onClick={() => write?.()}
    >
      {title}
    </Button>
  );
};

export default ButtonContractWrite