import {
 Box,
 Modal,
 ModalOverlay,
 ModalContent,
 ModalBody,
 ModalCloseButton,
 Link,
 useDisclosure,
} from '@chakra-ui/react'

interface Props {
 address?: string
 isOpen?: boolean
 onClose: () => void
 onOpen: () => void
}

export default function TransactionModal({ address, isOpen, onClose, onOpen }: Props) {
 const modal = useDisclosure({ isOpen, onClose, onOpen })
 return (
   <>
     <Modal size="sm" isOpen={modal?.isOpen} onClose={modal?.onClose}>
       <ModalOverlay />
       <ModalContent textAlign="center">
         <ModalCloseButton />
         <ModalBody py={4} display="flex" flexDir="column">
           <Box fontSize="lg" fontWeight={600} my={4}>
             Your contract is submitted!
           </Box>
           {address && (
             <Link
               isExternal
               href={`https://hyperspace.filfox.info/en/message/${address}`}
               fontSize="sm"
               color="#00C097"
               fontWeight={600}
             >
               View on Filfox
             </Link>
           )}

           <Box mt={4} fontWeight={600} color="#6E7C8C">
             Once the transaction is completed, your contract will appear in the market
           </Box>
         </ModalBody>
       </ModalContent>
     </Modal>
   </>
 )
}
