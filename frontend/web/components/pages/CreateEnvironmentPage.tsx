import React, { useState, useEffect, useRef, useContext } from 'react'
import ConfigProvider from 'common/providers/ConfigProvider'
import Permission from 'common/providers/Permission'
import Constants from 'common/constants'
import ErrorMessage from 'components/ErrorMessage'
import PageTitle from 'components/PageTitle'
import CondensedRow from 'components/CondensedRow'
import AddMetadataToEntity from 'components/metadata/AddMetadataToEntity'
import { getSupportedContentType } from 'common/services/useSupportedContentType'
import { getStore } from 'common/store'
import ProjectProvider, {
  CreateEnvType
} from 'common/providers/ProjectProvider'
import AccountStore from 'common/stores/account-store'
import Utils from 'common/utils/utils'
import { RouterChildContext } from 'react-router'
import API from 'project/api'
import InputGroup from 'components/base/forms/InputGroup'
import { Environment } from 'common/types/responses'
import Button from 'components/base/forms/Button'

type CreateEnvironmentPageProps = {
  router: RouterChildContext['router']
  match: {
    params: {
      environmentId: string
      projectId: string
    }
  }
}

const CreateEnvironmentPage: React.FC<CreateEnvironmentPageProps> = ({
  match,
  router,
}) => {
  const [envContentType, setEnvContentType] = useState<Record<string, any>>({})
  const [metadata, setMetadata] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string | undefined>()
  const [selectedEnv, setSelectedEnv] = useState<any | undefined>()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onSave = (environment: Environment) => {
    router.history.push(
      `/project/${match.params.projectId}/environment/${environment.api_key}/features`,
    )
  }

  useEffect(() => {
    API.trackPage(Constants.pages.CREATE_ENVIRONMENT)

    if (Utils.getPlansPermission('METADATA')) {
      getSupportedContentType(getStore(), {
        organisation_id: AccountStore.getOrganisation().id,
      }).then((res) => {
        const contentType = Utils.getContentType(
          res.data,
          'model',
          'environment',
        )
        setEnvContentType(contentType)
      })
    }

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus()
    }, 500)

    return () => clearTimeout(focusTimeout)
  }, [])

  const handleCreateEnv =
    (createEnv: CreateEnvType, isSaving: boolean) => (e: React.FormEvent) => {
      e.preventDefault()
      if (name && !isSaving) {
        createEnv({
          cloneFeatureStatesAsync: true,
          cloneId: selectedEnv?.api_key,
          description,
          metadata,
          name,
          projectId: match.params.projectId,
        })
      }
    }

  return (
    <div className='app-container container'>
      <PageTitle title='Create Environment'>
        {Constants.strings.ENVIRONMENT_DESCRIPTION}
      </PageTitle>
      <Permission
        level='project'
        permission='CREATE_ENVIRONMENT'
        id={match.params.projectId}
      >
        {({ isLoading, permission }) =>
          isLoading ? (
            <Loader />
          ) : permission ? (
            <ProjectProvider id={match.params.projectId} onSave={onSave}>
              {({ createEnv, error, isSaving, project }) => (
                <form
                  id='create-env-modal'
                  onSubmit={handleCreateEnv(createEnv, isSaving)}
                >
                  <div className='mt-5'>
                    <CondensedRow>
                      <InputGroup
                        ref={inputRef as any}
                        inputProps={{
                          className: 'full-width',
                          name: 'envName',
                        }}
                        onChange={(e: InputEvent) =>
                          setName(Utils.safeParseEventValue(e))
                        }
                        isValid={!!name}
                        type='text'
                        title='Name*'
                        placeholder='An environment name e.g. Develop'
                      />
                    </CondensedRow>
                    <CondensedRow>
                      <InputGroup
                        textarea
                        ref={inputRef as any}
                        value={description}
                        inputProps={{ className: 'input--wide textarea-lg' }}
                        onChange={(e: InputEvent) =>
                          setDescription(Utils.safeParseEventValue(e))
                        }
                        isValid={!!name}
                        type='text'
                        title='Description'
                        placeholder='Environment Description'
                      />
                    </CondensedRow>
                    <CondensedRow>
                      {!!project?.environments?.length && (
                        <InputGroup
                          tooltip='This will copy feature enabled states and remote config values from the selected environment.'
                          title='Clone from environment'
                          component={
                            <Select
                              onChange={(env: { value: string }) => {
                                setSelectedEnv(
                                  project?.environments.find(
                                    (v) => v.api_key === env.value,
                                  ),
                                )
                              }}
                              options={project.environments.map((env) => ({
                                label: env.name,
                                value: env.api_key,
                              }))}
                              value={
                                selectedEnv
                                  ? {
                                      label: selectedEnv.name,
                                      value: selectedEnv.api_key,
                                    }
                                  : { label: 'Please select an environment' }
                              }
                            />
                          }
                        />
                      )}
                    </CondensedRow>
                    {error && (
                      <CondensedRow>
                        <ErrorMessage error={error} />
                      </CondensedRow>
                    )}
                  </div>
                  {Utils.getPlansPermission('METADATA') &&
                    envContentType?.id && (
                      <CondensedRow>
                        <FormGroup className='mt-5 setting'>
                          <InputGroup
                            title='Custom fields'
                            tooltip='You need to add a value to the custom field if it is required to successfully clone the environment'
                            tooltipPlace='right'
                            component={
                              <AddMetadataToEntity
                                organisationId={
                                  AccountStore.getOrganisation().id
                                }
                                projectId={match.params.projectId}
                                entityId={selectedEnv?.api_key}
                                envName={name}
                                entityContentType={envContentType.id}
                                entity={envContentType.model}
                                isCloningEnvironment
                                onChange={setMetadata}
                              />
                            }
                          />
                        </FormGroup>
                      </CondensedRow>
                    )}
                  <CondensedRow>
                    <div className='text-right'>
                      <Button
                        id='create-env-btn'
                        className='mt-3'
                        type='submit'
                        disabled={isSaving || !name}
                      >
                        {isSaving ? 'Creating' : 'Create Environment'}
                      </Button>
                    </div>
                  </CondensedRow>
                  <hr />
                  <p className='faint mt-2'>
                    Not seeing an environment? Check that your project
                    administrator has invited you to it.
                  </p>
                </form>
              )}
            </ProjectProvider>
          ) : (
            <div>
              <p className='notification__text'>
                Check your project permissions
              </p>
              <p>
                Although you have been invited to this project, you are not
                invited to any environments yet!
              </p>
              <p>
                Contact your project administrator asking them to either:
                <ul>
                  <li>
                    Invite you to an environment (e.g. develop) by visiting{' '}
                    <strong>Environment settings</strong>
                  </li>
                  <li>
                    Grant permissions to create an environment under{' '}
                    <strong>Project settings</strong>.
                  </li>
                </ul>
              </p>
            </div>
          )
        }
      </Permission>
    </div>
  )
}

export default ConfigProvider(CreateEnvironmentPage)
