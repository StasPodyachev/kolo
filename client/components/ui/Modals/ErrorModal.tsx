import {
  Box,
  Link,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import { FeedbackIcon } from '../../../icons/FeedbackIcon'

interface Props {
  title: string
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  address: string,
}

export default function ErrorModal({
  title = 'Transaction is rejected.',
  isOpen,
  onClose,
  onOpen,
  address,
}: Props) {
  const modal = useDisclosure({ isOpen, onClose, onOpen })
  return (
    <>
      <Modal size="sm" isOpen={modal?.isOpen} onClose={modal?.onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalCloseButton />
          <ModalBody py={4} display="flex" flexDir="column">
            <Box fontSize="lg" fontWeight={600} my={4}>
              Error
            </Box>
            <FeedbackIcon boxSize="46px" color="red.400" />

            {title && (
              <Box mt={4} fontWeight={600} color="red.400">
                {title}
              </Box>
            )}
            {address && (
              <Box mt={4}>
                <Link
                  p={4}
                  isExternal
                  href={`https://hyperspace.filfox.info/en/message/${address}`}
                  fontSize="sm"
                  color="#00C097"
                  fontWeight={600}
                >
                  View on Filfox
                </Link>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button width="full" variant="light" size="lg" onClick={modal?.onClose}>
              Dismiss
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
