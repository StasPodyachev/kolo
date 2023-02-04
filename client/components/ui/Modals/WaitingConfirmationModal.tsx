import { Box, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { PulseLoader } from "react-spinners";

interface Props {
  isOpen?: boolean
  onClose: () => void
  onOpen: () => void
}

export default function WaitingConfirmationModal({ isOpen, onClose, onOpen }: Props) {
  const modal = useDisclosure({ isOpen, onClose, onOpen })

  return (
    <>
      <Modal size="sm" isCentered isOpen={modal?.isOpen} onClose={modal?.onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalCloseButton />
          <ModalBody py={4}>
            <Box fontSize="lg" fontWeight={600} my={4}>
              Waiting for confirmation ...
            </Box>
            <PulseLoader
              color="#fff"
              size={8}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <Box my={4} fontWeight={600} color="#6E7C8C">
              Confirm this transaction in your wallet
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
