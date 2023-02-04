import { useDisclosure } from '@chakra-ui/hooks'
import { useToast } from '@chakra-ui/toast'
import { createContext, ReactNode, useContext, useState } from 'react'
import ErrorModal from '../components/ui/Modals/ErrorModal'
import ToastSuccess from '../components/ui/Modals/ToastSuccess'
import TransactionModal from '../components/ui/Modals/TransactionModal'
import WaitingConfirmationModal from '../components/ui/Modals/WaitingConfirmationModal'
import WaitingModal from '../components/ui/Modals/WaitingModal'

interface Props {
  onConfirm: () => void
  onWaiting: () => void
  onTransaction: (data: any) => void
  onSuccess: (data: any) => void
  onError: (error: any) => void
  onCloseModal: () => void
}

const TransactionManageContext = createContext<Props>({
  onConfirm: () => {},
  onWaiting: () => {},
  onTransaction: () => {},
  onSuccess: () => {},
  onError: () => {},
  onCloseModal: () => {},
})

export const TransactionManageProvider = ({ children }: { children: ReactNode }) => {
  const confirmModal = useDisclosure()
  const waitingModal = useDisclosure()
  const transactionModal = useDisclosure()
  const errorModal = useDisclosure()

  const toast = useToast()

  const [transaction, setTransaction] = useState<string>('')
  const [error, setError] = useState<string>('')

  const onConfirm = () => {
    errorModal.onClose()
    transactionModal.onClose()
    waitingModal.onClose()
    confirmModal.onOpen()
  }

  const onWaiting = () => {
    confirmModal.onClose()
    transactionModal.onClose()
    waitingModal.onOpen()
  }

  const onCloseModal = () => {
    transactionModal.onClose()
    waitingModal.onClose()
    confirmModal.onClose()
  }

  const onTransaction = (data: any) => {
    confirmModal.onClose()
    waitingModal.onClose()
    setTransaction(data)
    transactionModal.onOpen()
  }

  const onSuccess = (data: any) => {
    confirmModal.onClose()
    waitingModal.onClose()
    transactionModal.onClose()

    toast({
      duration: null,
      position: 'top-right',
      render: (props) => {
        return <ToastSuccess {...props} title={data?.title} description={data?.description} />
      },
    })
  }

  const onError = (error: any) => {
    confirmModal.onClose()
    waitingModal.onClose()
    transactionModal.onClose()
    setTransaction(error?.transactionHash)
    setError(error?.message)
    errorModal.onOpen()
  }

  return (
    <>
      <TransactionManageContext.Provider
        value={{
          onConfirm,
          onWaiting,
          onTransaction,
          onSuccess,
          onError,
          onCloseModal,
        }}
      >
        {children}
        <ErrorModal {...errorModal} title={error} />
        <TransactionModal {...transactionModal} address={transaction} />
        <WaitingModal {...waitingModal} />
        <WaitingConfirmationModal {...confirmModal} />
      </TransactionManageContext.Provider>
    </>
  )
}

export const useTransactionManager = () => {
 return useContext(TransactionManageContext)
}