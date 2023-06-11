import {
    IconButton,
    Modal as ChakraModal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'

const Modal = (props) => {
    const { children, toggle, disclosure, title, size, header } = props

    return (
        <>
            {toggle(disclosure.onOpen)}

            <ChakraModal
                size={size}
                preserveScrollBarGap
                isOpen={disclosure.isOpen}
                onClose={disclosure.onClose}
                {...props}
            >
                <ModalOverlay />

                <ModalContent>
                    {(!header || header !== 'off') && (
                        <ModalHeader
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text>{title ? title : null}</Text>

                            <IconButton
                                size="sm"
                                borderRadius="full"
                                icon={<FiX size={16} />}
                                onClick={disclosure.onClose}
                            />
                        </ModalHeader>
                    )}

                    <ModalBody>{children}</ModalBody>
                </ModalContent>
            </ChakraModal>
        </>
    )
}

export default Modal
