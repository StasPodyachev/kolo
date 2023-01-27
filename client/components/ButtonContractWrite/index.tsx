import { Button } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

interface IProps {
  title: string;
  address: any;
  abi: any;
  method: string;
}

const ButtonContractWrite = ({ title, address, abi, method }: IProps) => {
  
  const { config } = usePrepareContractWrite({
    address,
    abi,
    functionName: method,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return isSuccess ? null : isLoading ? (
    <Button textStyle="button">Loading...</Button>
  ) : (
    <Button disabled={!write} textStyle="button" onClick={() => write?.()}>
      {title}
    </Button>
  );
};

export default ButtonContractWrite;
