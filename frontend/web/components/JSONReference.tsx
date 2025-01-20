import React, { FC, useMemo, useState } from 'react'
import { isArray, isObject } from 'lodash'

import Highlight from './Highlight'
import Button from './base/forms/Button'
import Switch from './Switch'
import flagsmith from 'flagsmith'
import Icon from './Icon'
import Utils from 'common/utils/utils'

type JSONReferenceType = {
  title: string
  json: any
  showNamesButton?: boolean
  hideCondensedButton?: boolean
  condenseInclude?: string[]
  className?: string
}

function pickProperties(
  value: any,
  idsOnly: boolean,
  condenseInclude?: string[],
): any {
  const propertyCheck = (key: string) => {
    if (condenseInclude?.includes(key)) {
      return true
    }
    if (key === 'id' || key.includes('uuid')) {
      return true
    }
    if (idsOnly) {
      return false
    }
    if (key.includes('name') || key === 'email') {
      return true
    }
  }
  const retObj: any = {}
  if (isArray(value)) {
    return value.map(function (arrayObj: any) {
      return pickProperties(arrayObj, idsOnly, condenseInclude)
    })
  }
  if (isObject(value)) {
    Object.keys(value).forEach(function (key) {
      if (propertyCheck(key)) {
        const valueObj = value as Record<string, any>
        if (isArray(valueObj[key])) {
          if (!valueObj[key].length) {
            return
          }
          retObj[key] = valueObj[key].map(function (arrayObj: any[]) {
            return pickProperties(arrayObj, idsOnly, condenseInclude)
          })
        } else if (isObject(valueObj[key])) {
          retObj[key] = pickProperties(valueObj[key], idsOnly, condenseInclude)
        } else {
          retObj[key] = valueObj[key]
        }
      }
    })
  } else {
    return value
  }
  return retObj
}

const JSONReference: FC<JSONReferenceType> = ({
  className,
  condenseInclude,
  hideCondensedButton,
  json,
  showNamesButton,
  title,
}) => {
  const [visible, setVisible] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [useIdsOnly, setUseIdsOnly] = useState(true)

  const value = useMemo(() => {
    return json && JSON.stringify(json, null, 2)
  }, [json])
  const idsOnly = useMemo(() => {
    return (
      json &&
      JSON.stringify(pickProperties(json, useIdsOnly, condenseInclude), null, 2)
    )
  }, [json, condenseInclude, useIdsOnly])
  if (!flagsmith.getTrait('json_inspect') || !json || json?.length === 0) {
    return null
  }
  return (
    <>
      <div className={className}>
        <Row
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setVisible(!visible)
          }}
        >
          <Flex>
            <div>
              <pre className='hljs-header'>
                <span className='hljs-icon-left'>
                  <Icon name='file-text' width={16} />
                </span>
                JSON data: <span className='hljs-description'>{title}</span>
                <span className='hljs-icon'>
                  <Icon
                    name={visible ? 'chevron-down' : 'chevron-right'}
                    width={16}
                  />
                </span>
              </pre>
            </div>
          </Flex>
        </Row>
        {visible && (
          <div className='hljs mb-2'>
            <Row space>
              <div>
                <Row>
                  {!hideCondensedButton && (
                    <div className='mb-2'>
                      <Switch
                        checked={condensed}
                        onChange={() => setCondensed(!condensed)}
                      />
                      <label className='hljs-switch'>Condensed</label>
                    </div>
                  )}
                  {condensed && showNamesButton && (
                    <div className='ml-2'>
                      <Switch
                        checked={!useIdsOnly}
                        onChange={() => setUseIdsOnly(!useIdsOnly)}
                      />
                      <label className='hljs-switch'>Show names</label>
                    </div>
                  )}
                </Row>
              </div>
              <Button
                onClick={() => {
                  Utils.copyToClipboard(condensed ? idsOnly : value)
                }}
                size='xSmall'
                iconLeft='copy'
                iconLeftColour='white'
              >
                Copy JSON
              </Button>
            </Row>
            <div className='hljs-container'>
              <Highlight forceExpanded className={'json p-0'}>
                {condensed ? idsOnly : value}
              </Highlight>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default JSONReference
