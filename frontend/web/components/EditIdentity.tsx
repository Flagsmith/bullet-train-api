import React, { FC, useEffect, useRef, useState } from 'react'
import { Identity } from 'common/types/responses'
import { useUpdateIdentityMutation } from 'common/services/useIdentity'
import Button from './base/forms/Button'
import ErrorMessage from './ErrorMessage'
import classNames from 'classnames'

type EditIdentityType = {
  data: Identity
  environmentId: string
  onComplete?: () => void
}

const EditIdentity: FC<EditIdentityType> = ({ data, environmentId }) => {
  const [alias, setAlias] = useState(data.dashboard_alias)
  const aliasRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setAlias(data?.dashboard_alias)
  }, [data])

  const [updateIdentity, { error, isLoading }] = useUpdateIdentityMutation({})

  const handleBlur = () => {
    if (aliasRef.current) {
      const updatedAlias = (aliasRef.current.textContent || '')
        .replace(/\n/g, ' ')
        .trim()
        .toLowerCase()

      aliasRef.current.textContent = alias
      setAlias(updatedAlias)
      onSubmit(updatedAlias)
    }
  }

  const onSubmit = (updatedAlias: string) => {
    if (!isLoading && updatedAlias) {
      updateIdentity({
        data: { ...data, dashboard_alias: updatedAlias },
        environmentId,
      })
    }
  }

  const handleFocus = () => {
    if (!alias) {
      aliasRef.current.textContent = '' // Clear the content
    }

    // Ensure that aliasRef.current has at least one child node (a text node)
    if (aliasRef.current && aliasRef.current.childNodes.length === 0) {
      aliasRef.current.appendChild(document.createTextNode(''))
    }

    if (aliasRef.current) {
      const selection = window.getSelection()
      const range = document.createRange()

      const textLength = aliasRef.current.textContent?.length || 0
      range.setStart(aliasRef.current.childNodes[0], textLength)
      range.collapse(true)

      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      aliasRef.current?.blur()
    }
  }

  const handleInput = () => {
    if (aliasRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)
      const cursorPosition = range?.startOffset || 0

      const lowerCaseText = aliasRef.current.textContent?.toLowerCase() || ''
      aliasRef.current.textContent = lowerCaseText

      // Restore cursor position
      const newRange = document.createRange()
      newRange.setStart(
        aliasRef.current.childNodes[0],
        Math.min(cursorPosition, lowerCaseText.length),
      )
      newRange.collapse(true)

      selection?.removeAllRanges()
      selection?.addRange(newRange)
    }
  }

  return (
    <>
      <span
        ref={aliasRef}
        className={classNames('fw-normal', { 'text-muted': !alias })}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        role='textbox'
        aria-label='Alias'
      >
        {alias || 'None'}
      </span>
      <Button
        disabled={!data}
        iconSize={18}
        theme='text'
        className='ms-2 text-primary'
        iconRightColour='primary'
        iconRight={'edit'}
        onClick={handleFocus}
      >
        Edit
      </Button>
      <ErrorMessage>{error}</ErrorMessage>
    </>
  )
}

export default EditIdentity
