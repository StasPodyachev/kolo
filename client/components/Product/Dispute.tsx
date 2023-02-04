import { Button } from "@chakra-ui/react";

interface IProps {
  onClick: () => void;
}

const Dispute = ({ onClick }: IProps) => {
  return (
    <Button minW="170px" variant="blue" onClick={onClick}>
      Dispute
    </Button>
  );
};

export default Dispute;