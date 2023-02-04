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
import { useNetwork } from 'wagmi'

interface Props {
 address?: string
 isOpen?: boolean
 onClose: () => void
 onOpen: () => void
}

export default function TransactionModal({ isOpen, onClose, onOpen, address = '' }: Props) {
 const modal = useDisclosure({ isOpen, onClose, onOpen })
 const { chain } = useNetwork()
 return (
   <>
     <Modal size="sm" isOpen={modal?.isOpen} onClose={modal?.onClose}>
       <ModalOverlay />
       <ModalContent textAlign="center">
         <ModalCloseButton />
         <ModalBody py={4}>
           <Box fontSize="lg" fontWeight={600} my={4}>
             Your contract is submitted!
           </Box>
           {address && (
             <Link
               isExternal
               href={chain?.id === 420 ? `https://goerli-optimism.etherscan.io/tx/${address}` : `https://mumbai.polygonscan.com/tx/${address}`}
               fontSize="sm"
               color="#00C097"
               fontWeight={600}
             >
               View on Erherscan
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
