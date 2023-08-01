import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import * as DOMPurify from 'dompurify'

const ReactTooltip = require('react-tooltip')

type StyledTooltipProps = {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}

type TooltipProps = {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
  htmlEncode: boolean
  place?: string | undefined
  title: JSX.Element
}

const StyledTooltip = ({ children }: StyledTooltipProps) => (
  <div className='flex-row'>
    <div className='icon--tooltip ion-ios-information-circle mr-1'></div>
    <span>{`${children}`}</span>
  </div>
)

const tooltipStyler = (
  htmlEncode: boolean,
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element),
): string => {
  const html = renderToStaticMarkup(
    <StyledTooltip>{htmlEncode ? children : '{{placeholder}}'}</StyledTooltip>,
  )
  if (htmlEncode) {
    return html
  }
  return html.replace(
    '{{placeholder}}',
    DOMPurify.sanitize(children.toString()),
  )
}

const Tooltip = ({
  children,
  htmlEncode,
  place,
  title,
}: TooltipProps): JSX.Element => {
  const id = Utils.GUID()

  return (
    <span className='question-tooltip'>
      {title ? (
        <span data-for={id} data-tip>
          {title}
        </span>
      ) : (
        <span className='ion ion-ios-help' data-for={id} data-tip />
      )}
      <ReactTooltip
        html
        id={id}
        place={place || 'top'}
        type='dark'
        effect='solid'
      >
        {tooltipStyler(htmlEncode, children)}
      </ReactTooltip>
    </span>
  )
}

export default Tooltip
