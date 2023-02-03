import { Box, Button, Heading, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { CSSProperties } from "react";
import { PulseLoader } from "react-spinners";

interface IProps {
  children: JSX.Element;
  title: string;
  confirmHandler: () => void;
  isLoading: boolean;
}

const override: CSSProperties = {
  width: "100%",
  padding: "8px 16px",
  display: "block",
  margin: "0 auto",
};

const Modal = ({ children, title, confirmHandler, isLoading }: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <ChakraModal isCentered size="md" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Heading variant="h6" color="white">
              {!isLoading ? title : (
                'Processing'
              )}
            </Heading>
          </ModalBody>
          <ModalFooter>
              {isLoading ? (
                <PulseLoader
                  cssOverride={override}
                  color="white"
                  size="8px"
                 />
              ) : (
                <>
                  <Button
                    textStyle="button"
                    minW="45%"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    variant="blue"
                    textStyle="button"
                    minW="45%"
                    onClick={confirmHandler}
                  >
                    Confirm
                  </Button>
                </>
              )}
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export default Modal;
