import {
  Button
} from "@chakra-ui/react";

const PlaceBid = ({isDisabled, onClick}:{isDisabled: boolean, onClick: () => void}) => {

  

  return (
    <Button
      minW="170px"
      minH="48px"
      onClick={onClick}
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
