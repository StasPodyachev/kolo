import { CloseButton } from '@chakra-ui/close-button'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Box, Flex, Link } from '@chakra-ui/layout'

export default function ToastSuccess({
  onClose,
  title = 'Transaction is completed.',
  description,
  address,
}: {
  title?: string
  description?: any
  onClose: () => void
  address: string,
}) {
  return (
    <Flex
      justifyContent="space-between"
      borderRadius="xl"
      color="white"
      p={3}
      bg="#363D45"
      borderWidth={1}
      borderColor="#6E7C8C"
    >
      <CheckCircleIcon flexShrink={0} mr={4} boxSize="20px" color="#84BF40" />
      <Box flexGrow={1}>
        {title && <Box fontWeight={600}>{title}</Box>}
        {description && <Box>{description}</Box>}
        <Box>
          {address && (
            <Link
              isExternal
              href={`https://hyperspace.filfox.info/en/message/${address}`}
              fontSize="sm"
              color="#00C097"
              fontWeight={600}
            >
              View on Erherscan
            </Link>
          )}
        </Box>
      </Box>
      <CloseButton flexShrink={0} onClick={onClose} />
    </Flex>
  )
}
