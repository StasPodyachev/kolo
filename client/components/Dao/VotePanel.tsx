import addresses from "@/contracts/addresses";
import { ShareIcon } from "@/icons";
import { Button, Flex, FormControl, FormLabel, Heading, Switch, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CustomInput } from "../NewPoduct/NewPoduct";
import ABI_GOVERNER from "contracts/abi/GovernorContract.json";
import { useTransactionManager } from "@/context/TransactionManageProvider";
import { BigNumber } from "ethers";


interface IProps {
  title: string;
  id: string;
}

const VotePanel = ({ title, id }: IProps) => {
  const { onConfirm, onTransaction } = useTransactionManager()
  const [switchValue, setSwitchValue] = useState(-1);
  const [comment, setComment] = useState("");
  const funcName = comment.length ? 'castVoteWithReason' : 'castVote';
  const argsArray = comment.length ? [id, switchValue, comment] : [id, switchValue];
  const { config } = usePrepareContractWrite({
    address: addresses[8].address as `0x${string}`,
    abi: ABI_GOVERNER,
    functionName: funcName,
    args: argsArray,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    if (isLoading) {
      onConfirm()
    }
  }, [isLoading, onConfirm])

  useEffect(() => {
    if (data && isSuccess) {
      onTransaction(data?.hash)
      // push('/dashboard')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" w="585px" m="0 auto" gap="16px">
        <Heading variant="h3" color="white" textAlign="center">
          Vote
        </Heading>
        <Flex flexDir="column" gap="32px">
          <Flex gap="16px" alignItems="center">
            <Heading variant="h5">
              {title}
            </Heading>
            <ShareIcon boxSize="24px" />
          </Flex>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 0} value={switchValue} onChange={() => {
              setSwitchValue(0);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 0 ? "white" : "gray.500"}>
                For
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 1} value={switchValue} onChange={() => {
              setSwitchValue(1);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 1 ? "white" : "gray.500"}>
                Against
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl display="flex" gap="8px" alignItems="center">
            <Switch isChecked={switchValue === 2} value={switchValue} onChange={() => {
              setSwitchValue(2);
            }} />
            <FormLabel mb={0}>
              <Heading variant="h5" color={switchValue === 2 ? "white" : "gray.500"}>
                Abstained
              </Heading>
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel>
              <Heading variant="h6" color="gray.200">Add comment</Heading>
            </FormLabel>
            <CustomInput
              placeholder="Text the community  what are your thoughts"
              value={comment}
              onChange={(event: any) => setComment(event.target.value)}
            />
          </FormControl>
          <Button
            variant="blue"
            textStyle="button"
            w="100%"
            isDisabled={switchValue === -1 ? true : false}
            onClick={() => write?.()}
          >
            submit your vote
          </Button>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default VotePanel;
