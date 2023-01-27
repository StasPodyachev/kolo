import { Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { useContractRead } from "wagmi";

interface IProps {
  title: string;
  address: `0x${string}`;
  abi: any;
  method: string;
}

const ButtonContractRead = ({ title, address, abi, method }: IProps) => {
  const { data } = useContractRead({
    address,
    abi,
    functionName: method,
  });
  return <Button textStyle="button">{title}</Button>;
};

export default ButtonContractRead;
