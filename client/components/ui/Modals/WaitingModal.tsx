import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'
import { PulseLoader } from "react-spinners";

export default function WaitingModal({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <Modal autoFocus={false} size="xs" isCentered isOpen={isOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent w="140px" textAlign="center">
          <ModalBody py={4}>
            <PulseLoader
              color="#fff"
              size={8}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
