import { Modal, ModalBody } from 'reactstrap'
import React, { FC, ReactNode } from 'react'
import Button from 'components/base/forms/Button'

interface ModalDefault {
  title: ReactNode
  isOpen: boolean
  onDismiss: () => void
  toggle: () => void
  zIndex?: number
  children: ReactNode
  className?: string

  sideModal?: boolean
}

export let interceptClose: (() => Promise<boolean>) | null = null
export const setInterceptClose = (promise: (() => Promise<any>) | null) => {
  interceptClose = promise
}

const ModalDefault: FC<ModalDefault> = ({
  children,
  className,
  isOpen,
  onClosed,
  onDismiss,
  title,
  toggle,
  zIndex,
}) => {
  const onDismissClick = async () => {
    if (interceptClose) {
      const shouldClose = await interceptClose()
      if (!shouldClose) {
        return
      }
      interceptClose = null
    }
    if (onDismiss) {
      onDismiss()
    }
    toggle()
  }
  return (
    <Modal
      zIndex={zIndex}
      className={
        !className?.includes('side-modal') ? 'modal-dialog-centered' : undefined
      }
      onClosed={onClosed}
      modalClassName={className}
      unmountOnClose
      isOpen={isOpen}
      toggle={onDismissClick}
    >
      <div className='modal-header'>
        <h5 className='modal-title'>{title}</h5>
        <span onClick={onDismissClick} className='icon close ion-md-close' />
      </div>
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

export default ModalDefault
