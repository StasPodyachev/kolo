import { Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useContractRead } from "wagmi";

interface IProps {
  title: string;
  address: any;
  abi: any;
  method: string;
  setState: (data: any) => void;
}

const ButtonContractRead = ({ title, address, abi, method, setState }: IProps) => {
  const { data } = useContractRead({
    address,
    abi,
    functionName: method,
  });
  useEffect(() => {
    if (data) setState(data)
  }, [data, setState])
  return <Button textStyle="button">{title}</Button>;
};

export default ButtonContractRead;
