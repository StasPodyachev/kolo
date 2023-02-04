import { Box, Button, Heading, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useOutsideClick } from "@chakra-ui/react"
import { CSSProperties, Dispatch, SetStateAction, useRef } from "react";
import { PulseLoader } from "react-spinners";

interface IProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isOpen: boolean;
  changeVisibility: Dispatch<SetStateAction<boolean>>;
}

const override: CSSProperties = {
  width: "100%",
  padding: "8px 16px",
  display: "block",
  margin: "0 auto",
};

const Modal = ({ isLoading, isSuccess, isError, isOpen, changeVisibility }: IProps) => {
  const { onClose } = useDisclosure();
  const ref = useRef(null);
  useOutsideClick({
    ref,
    handler: () => changeVisibility(false),
  })
  return (
    <ChakraModal isCentered size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent ref={ref}>
        <ModalHeader>
          <ModalCloseButton onClick={() => changeVisibility(false)} />
        </ModalHeader>
        <ModalBody>
          <Heading variant="h6" color="white" textAlign="center">
            {isLoading ? (
              'Processing'
            ) : isSuccess ? (
              'Transaction sent. It may take some time. You can close this window'
            ) : isError ? (
              'Error occured'
            ) : null}
          </Heading>
        </ModalBody>
        <ModalFooter>
          {isLoading ? (
            <PulseLoader
              cssOverride={override}
              color="white"
              size="8px"
              />
          ) : null}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
