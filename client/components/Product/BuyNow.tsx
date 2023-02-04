import {
  Button
} from "@chakra-ui/react";

const BuyNow = ({isDisabled, onClick}:{isDisabled: boolean, onClick: () => void}) => {
  return (
    <Button
      mt="auto"
      w="100%"
      onClick={onClick}
      isDisabled={isDisabled}
      minH="48px"
      bg="green.primary"
      color="white"
      textStyle="button"
      transition="all .3s"
      _hover={{ bg: "green.hover" }}
      borderRadius={0}
    >
      buy now
    </Button>
  )
}

export default BuyNow
