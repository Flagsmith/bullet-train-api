import React, { FC, useState } from 'react'
import InputGroup from 'components/base/forms/InputGroup'
import Utils from 'common/utils/utils'
import Switch from 'components/Switch'
import ValueEditor from 'components/ValueEditor'
import {
  useCreateSamlConfigurationMutation,
  useUpdateSamlConfigurationMutation,
  useGetSamlConfigurationQuery,
  getSamlConfigurationMetadata,
} from 'common/services/useSamlConfiguration'
import Button from 'components/base/forms/Button'
import { Req } from 'common/types/requests'
import ErrorMessage from 'components/ErrorMessage'
import { getStore } from 'common/store'

type CreateSAML = {
  organisationId: number
  samlName?: string
}

const CreateSAML: FC<CreateSAML> = ({ organisationId, samlName }) => {
  const [name, setName] = useState<string>(samlName || '')
  const [frontendUrl, setFrontendUrl] = useState<string>(window.location.origin)
  const [metadataXml, setMetadataXml] = useState<string>('')
  const [allowIdpInitiated, setAllowIdpInitiated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [createSamlConfiguration, createError] =
    useCreateSamlConfigurationMutation()
  const [editSamlConfiguration, updateError] =
    useUpdateSamlConfigurationMutation()
  const { data } = useGetSamlConfigurationQuery(
    { name: samlName! },
    { skip: !samlName },
  )
  const validateName = (name: string) => {
    const regularExpresion = /^$|^[a-zA-Z0-9_+-]+$/
    return regularExpresion.test(name)
  }

  const download = () => {
    setIsLoading(true)
    getSamlConfigurationMetadata(getStore(), { name: name })
      .then((res) => {
        if (res.data) {
          const blob = new Blob([JSON.stringify(res.data, null, 2)])
          const link = document.createElement('a')
          link.download = `${data?.name}.json`
          link.href = window.URL.createObjectURL(blob)
          link.click()
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='create-feature-tab px-3'>
      <Tooltip
        title={
          <InputGroup
            className='mt-2'
            title='Name*'
            data-test='saml-name'
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const nuevoNombre = Utils.safeParseEventValue(event)
              if (validateName(nuevoNombre)) {
                setName(nuevoNombre)
              }
            }}
            inputProps={{
              className: 'full-width',
            }}
            type='text'
            name='Name*'
          />
        }
      >
        {
          'A short name for the organization, used as the input when clicking "Single Sign-on" at login, should only consist of alphanumeric characters, plus (+), underscore (_), and hyphen (-).'
        }
      </Tooltip>

      <InputGroup
        className='mt-2 mb-4'
        title='Frontend URL*'
        data-test='frontend-url'
        value={frontendUrl}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFrontendUrl(Utils.safeParseEventValue(event))
        }}
        inputProps={{
          className: 'full-width',
          name: 'groupName',
        }}
        type='text'
        name='Frontend URL*'
      />
      <InputGroup
        className='mt-2 mb-4'
        title='Allow IDP initiated'
        component={
          <Switch
            checked={allowIdpInitiated || data?.allow_idp_initiated}
            onChange={() => {
              setAllowIdpInitiated(!allowIdpInitiated)
            }}
          />
        }
      />
      <FormGroup className='mb-4'>
        <InputGroup
          component={
            <ValueEditor
              data-test='featureValue'
              name='featureValue'
              className='full-width'
              value={metadataXml || data?.idp_metadata_xml}
              onChange={setMetadataXml}
              placeholder="e.g. '<xml>time<xml>' "
              onlyOneLang
              language='xml'
            />
          }
          title={'IDP Metadata XML'}
        />
      </FormGroup>

      <div className='text-right mt-2'>
        {data?.idp_metadata_xml && (
          <Button disabled={isLoading} onClick={download} className='mr-2'>
            {isLoading ? 'Downloading' : 'Download Service Provider Metadata'}
          </Button>
        )}
        <Button
          type='submit'
          disabled={!name || !frontendUrl}
          onClick={() => {
            const body = {
              frontend_url: frontendUrl,
              name: name,
              organisation: organisationId,
            } as Req['updateSamlConfiguration']['body']
            if (metadataXml) {
              body.idp_metadata_xml = metadataXml
            }
            if (allowIdpInitiated) {
              body.allow_idp_initiated = allowIdpInitiated
            }
            if (data) {
              editSamlConfiguration({
                body: { ...body },
                name: samlName!,
              }).then((res) => {
                if (res.data) {
                  setName(res.data.name)
                  setFrontendUrl(res.data.frontend_url)
                  setMetadataXml(res.data.idp_metadata_xml)
                  setAllowIdpInitiated(res.data.allow_idp_initiated)
                  toast('SAML configuration updated!')
                }
              })
            } else {
              createSamlConfiguration(body).then((res) => {
                if (res.data) {
                  setName(res.data.name)
                  setFrontendUrl(res.data.frontend_url)
                  setMetadataXml(res.data.idp_metadata_xml)
                  setAllowIdpInitiated(res.data.allow_idp_initiated)
                  toast('SAML configuration Created!')
                  closeModal()
                }
              })
            }
          }}
        >
          {data ? 'Edit Configuration' : 'Create Configuration'}
        </Button>
      </div>
      {!!createError ||
        (!!updateError && (
          <div className='mt-2'>
            <ErrorMessage error={createError || updateError} />
          </div>
        ))}
    </div>
  )
}
export default CreateSAML
