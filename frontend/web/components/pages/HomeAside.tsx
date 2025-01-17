import React, { FC, useEffect, useState } from 'react'
import ProjectStore from 'common/stores/project-store'
import ChangeRequestStore from 'common/stores/change-requests-store'
import Utils from 'common/utils/utils'
import { Environment, Project } from 'common/types/responses'
import ConfigProvider from 'common/providers/ConfigProvider'
import Permission from 'common/providers/Permission'
import { Link, NavLink } from 'react-router-dom'
import { IonIcon } from '@ionic/react'
import { code, createOutline } from 'ionicons/icons'
import EnvironmentDropdown from 'components/EnvironmentDropdown'
import ProjectProvider from 'common/providers/ProjectProvider'
import OrganisationProvider from 'common/providers/OrganisationProvider'
import Icon from 'components/Icon'
// @ts-ignore
import { AsyncStorage } from 'polyfill-react-native'
import AccountStore from 'common/stores/account-store'
import AppActions from 'common/dispatcher/app-actions'
import { RouterChildContext } from 'react-router'
import Constants from 'common/constants'
import EnvironmentSelect from 'components/EnvironmentSelect'
import { components } from 'react-select'
import SettingsIcon from 'components/svg/SettingsIcon'
import BuildVersion from 'components/BuildVersion'

type HomeAsideType = {
  environmentId: string
  projectId: string
  history: RouterChildContext['router']['history']
}

const HomeAside: FC<HomeAsideType> = ({
  environmentId,
  history,
  projectId,
}) => {
  useEffect(() => {
    if (environmentId) {
      AppActions.getChangeRequests(environmentId, {})
    }
  }, [environmentId])
  const [_, setChangeRequestsUpdated] = useState(Date.now())

  useEffect(() => {
    const onChangeRequestsUpdated = () => setChangeRequestsUpdated(Date.now())
    ChangeRequestStore.on('change', onChangeRequestsUpdated)
    return () => {
      ChangeRequestStore.off('change', onChangeRequestsUpdated)
    }
    //eslint-disable-next-line
  }, [])

  const environment: Environment | null =
    environmentId === 'create'
      ? null
      : (ProjectStore.getEnvironment(environmentId) as any)
  const changeRequest = Utils.changeRequestsEnabled(
    environment?.minimum_change_request_approvals,
  )
    ? ChangeRequestStore.model[environmentId]
    : null
  const changeRequests = changeRequest?.count || 0
  const scheduled =
    (environment && ChangeRequestStore.scheduled[environmentId]?.count) || 0
  const onProjectSave = () => {
    AppActions.refreshOrganisation()
  }
  return (
    <OrganisationProvider>
      {() => (
        <ProjectProvider id={projectId} onSave={onProjectSave}>
          {({ project }) => {
            const createEnvironmentButton = (
              <Permission
                level='project'
                permission='CREATE_ENVIRONMENT'
                id={projectId}
              >
                {({ permission }) =>
                  permission && (
                    <Link
                      id='create-env-link'
                      className='btn mt-1 mb-2 ml-2 mr-2 d-flex justify-content-center btn-xsm d-flex gap-1 align-items-center btn--outline'
                      to={`/project/${projectId}/environment/create`}
                    >
                      <IonIcon className='fs-small' icon={createOutline} />
                      Create Environment
                    </Link>
                  )
                }
              </Permission>
            )
            return (
              <div className='border-right home-aside d-flex flex-column'>
                <div className='flex-1 flex-column'>
                  <div className='mt-3'>
                    <div className='px-3 mb-2 d-flex align-items-center justify-content-between'>
                      <div className='full-width mb-1'>
                        {!!environment && (
                          <EnvironmentSelect
                            dataTest={({ label }) =>
                              `switch-environment-${label.toLowerCase()}`
                            }
                            id='environment-select'
                            data-test={`switch-environment-${environment.name.toLowerCase()}-active`}
                            styles={{
                              container: (base: any) => ({
                                ...base,
                                border: 'none',
                                padding: 0,
                              }),
                            }}
                            label={environment.name}
                            value={environmentId}
                            projectId={projectId}
                            components={{
                              Menu: ({ ...props }: any) => {
                                return (
                                  <components.Menu {...props}>
                                    {props.children}
                                    {createEnvironmentButton}
                                  </components.Menu>
                                )
                              },
                            }}
                            onChange={(newEnvironmentId) => {
                              if (newEnvironmentId !== environmentId) {
                                AsyncStorage.setItem(
                                  'lastEnv',
                                  JSON.stringify({
                                    environmentId: newEnvironmentId,
                                    orgId: AccountStore.getOrganisation().id,
                                    projectId: projectId,
                                  }),
                                ).finally(() => {
                                  history.push(
                                    `${document.location.pathname}${
                                      document.location.search || ''
                                    }`.replace(environmentId, newEnvironmentId),
                                  )
                                })
                              }
                            }}
                          />
                        )}
                        {E2E && createEnvironmentButton}
                      </div>
                    </div>
                  </div>
                  <EnvironmentDropdown
                    renderRow={(environment: Environment, onClick: any) =>
                      environment?.api_key === environmentId && (
                        <div className='collapsible__content'>
                          <Permission
                            level='environment'
                            permission='ADMIN'
                            id={environment.api_key}
                          >
                            {({ isLoading, permission: environmentAdmin }) =>
                              isLoading ? (
                                <div className='text-center'>
                                  <Loader />
                                </div>
                              ) : (
                                <div className='list-unstyled aside-nav d-flex flex-column gap-1 ms-3 mb-2 mt-1'>
                                  <NavLink
                                    activeClassName='active'
                                    id='features-link'
                                    to={`/project/${project.id}/environment/${environment.api_key}/features`}
                                  >
                                    <span className='mr-2'>
                                      <Icon name='rocket' fill='#9DA4AE' />
                                    </span>
                                    Features
                                  </NavLink>
                                  <NavLink
                                    activeClassName='active'
                                    id='change-requests-link'
                                    to={`/project/${project.id}/environment/${environment.api_key}/scheduled-changes/`}
                                  >
                                    <span className='mr-2'>
                                      <Icon name='timer' fill='#9DA4AE' />
                                    </span>
                                    Scheduling
                                    {scheduled ? (
                                      <span className='ml-1 unread d-inline'>
                                        {scheduled}
                                      </span>
                                    ) : null}
                                  </NavLink>
                                  <NavLink
                                    activeClassName='active'
                                    id='change-requests-link'
                                    to={`/project/${project.id}/environment/${environment.api_key}/change-requests/`}
                                  >
                                    <span className='mr-2'>
                                      <Icon name='request' fill='#9DA4AE' />
                                    </span>
                                    Change Requests{' '}
                                    {changeRequests ? (
                                      <span className='ms-1 unread d-inline'>
                                        {changeRequests}
                                      </span>
                                    ) : null}
                                  </NavLink>
                                  <NavLink
                                    id='users-link'
                                    exact
                                    to={`/project/${project.id}/environment/${environment.api_key}/users`}
                                  >
                                    <span className='mr-2'>
                                      <Icon name='people' fill={'#9DA4AE'} />
                                    </span>
                                    Identities
                                  </NavLink>
                                  <NavLink
                                    id='sdk-keys-link'
                                    exact
                                    to={`/project/${project.id}/environment/${environment.api_key}/sdk-keys`}
                                  >
                                    <IonIcon
                                      color={'#9DA4AE'}
                                      className='mr-2'
                                      icon={code}
                                    />
                                    SDK Keys
                                  </NavLink>
                                  {environmentAdmin && (
                                    <NavLink
                                      id='env-settings-link'
                                      className='aside__environment-list-item'
                                      to={`/project/${project.id}/environment/${environment.api_key}/settings`}
                                    >
                                      <span className='mr-2'>
                                        <SettingsIcon />
                                      </span>
                                      Environment Settings
                                    </NavLink>
                                  )}
                                </div>
                              )
                            }
                          </Permission>
                        </div>
                      )
                    }
                    projectId={projectId}
                    environmentId={environmentId}
                    clearableValue={false}
                  />
                </div>

                <BuildVersion />
              </div>
            )
          }}
        </ProjectProvider>
      )}
    </OrganisationProvider>
  )
}

export default ConfigProvider(HomeAside)
