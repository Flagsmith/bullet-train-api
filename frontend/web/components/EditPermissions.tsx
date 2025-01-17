import React, { FC, forwardRef, useCallback, useEffect, useState } from 'react'
import { find } from 'lodash'
import { close as closeIcon } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
import _data from 'common/data/base/_data'
import {
  AvailablePermission,
  GroupPermission,
  Role,
  RolePermission,
  User,
  UserGroup,
  UserGroupSummary,
  UserPermission,
} from 'common/types/responses'
import AccountStore from 'common/stores/account-store'
import Format from 'common/utils/format'
import PanelSearch from './PanelSearch'
import Button from './base/forms/Button'
import InfoMessage from './InfoMessage'
import Switch from './Switch'
import TabItem from './base/forms/TabItem'
import Tabs from './base/forms/Tabs'
import UserGroupList from './UserGroupList'
import { PermissionLevel, Req } from 'common/types/requests'
import { RouterChildContext } from 'react-router'
import { useGetAvailablePermissionsQuery } from 'common/services/useAvailablePermissions'
import ConfigProvider from 'common/providers/ConfigProvider'
import Icon from './Icon'
import {
  useCreateRolePermissionsMutation,
  useGetRoleEnvironmentPermissionsQuery,
  useGetRoleOrganisationPermissionsQuery,
  useGetRoleProjectPermissionsQuery,
  useUpdateRolePermissionsMutation,
} from 'common/services/useRolePermission'

import {
  useCreateRolesPermissionUsersMutation,
  useDeleteRolesPermissionUsersMutation,
} from 'common/services/useRolesUser'

import {
  useCreateRolePermissionGroupMutation,
  useDeleteRolePermissionGroupMutation,
} from 'common/services/useRolePermissionGroup'

import {
  useDeleteUserWithRolesMutation,
  useGetUserWithRolesQuery,
} from 'common/services/useUserWithRole'

import {
  useDeleteGroupWithRoleMutation,
  useGetGroupWithRoleQuery,
} from 'common/services/useGroupWithRole'

import MyRoleSelect from './MyRoleSelect'
import Panel from './base/grid/Panel'
import InputGroup from './base/forms/InputGroup'
import classNames from 'classnames'
import OrganisationProvider from 'common/providers/OrganisationProvider'
import { useHasPermission } from 'common/providers/Permission'
import PlanBasedAccess from './PlanBasedAccess'
import { useGetTagsQuery } from 'common/services/useTag'
import { components } from 'react-select'
import { SingleValueProps } from 'react-select/lib/components/SingleValue'
import Utils from 'common/utils/utils'
import AddEditTags from './tags/AddEditTags'

const Project = require('common/project')

const SingleValue = (props: SingleValueProps<any>) => {
  return (
    <components.SingleValue {...props}>
      <div className='d-flex gap-1 align-items-center'>
        {props.data.value === 'GRANTED' && (
          <Icon width={18} name='checkmark' fill='#27AB95' />
        )}
        {props.data.value === 'GRANTED_FOR_TAGS' && (
          <Icon width={18} name='shield' fill='#ff9f43' />
        )}
        {props.children}
      </div>
    </components.SingleValue>
  )
}

type EditPermissionModalType = {
  group?: UserGroupSummary
  id: number
  className?: string
  isGroup?: boolean
  level: PermissionLevel
  name: string
  onSave?: () => void
  envId?: number | string | undefined
  parentId?: string
  parentLevel?: string
  parentSettingsLink?: string
  roleTabTitle?: string
  permissions?: UserPermission[]
  push: (route: string) => void
  user?: User
  role?: Role
  roles?: Role[]
  permissionChanged?: () => void
  isEditUserPermission?: boolean
  isEditGroupPermission?: boolean
}

type EditPermissionsType = Omit<EditPermissionModalType, 'onSave'> & {
  onSaveGroup?: () => void
  onSaveUser: () => void
  router: RouterChildContext['router']
  tabClassName?: string
}
type EntityPermissions = Omit<
  RolePermission,
  'user' | 'id' | 'group' | 'isGroup'
> & {
  id?: number
  group?: number
  user?: number
  tags?: number[]
}
const permissionOptions = [
  { label: 'Granted', value: 'GRANTED' },
  { label: 'Granted for tags', value: 'GRANTED_FOR_TAGS' },
  { label: 'None', value: 'NONE' },
]
const withAdminPermissions = (InnerComponent: any) => {
  const WrappedComponent: FC<EditPermissionModalType> = (props) => {
    const { id, level } = props
    const notReady = !id || !level
    const { isLoading: permissionsLoading, permission } = useHasPermission({
      id: id,
      level,
      permission: 'ADMIN',
    })

    if (permissionsLoading || notReady) {
      return (
        <div className='my-4 text-center'>
          <Loader />
        </div>
      )
    }
    if (!permission) {
      return (
        <div
          className='my-4 text-center text-muted'
          data-test='no-organisation-permissions'
        >
          To manage permissions you need to be admin of this {level}.
        </div>
      )
    }

    return <InnerComponent {...props} />
  }
  return WrappedComponent
}
const _EditPermissionsModal: FC<EditPermissionModalType> = withAdminPermissions(
  forwardRef((props: EditPermissionModalType) => {
    const {
      className,
      envId,
      group,
      id,
      isEditGroupPermission,
      isEditUserPermission,
      isGroup,
      level,
      name,
      onSave,
      parentId,
      parentLevel,
      parentSettingsLink,
      permissionChanged,
      push,
      role,
      roles,
      user,
    } = props

    const [entityPermissions, setEntityPermissions] =
      useState<EntityPermissions>({
        admin: false,
        permissions: [],
      })
    const [parentError, setParentError] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showRoles, setShowRoles] = useState<boolean>(false)
    const [valueChanged, setValueChanged] = useState(false)

    const projectId =
      props.level === 'project'
        ? props.id
        : props.level === 'environment'
        ? props.parentId
        : undefined

    const { data: tags, isLoading: tagsLoading } = useGetTagsQuery(
      { projectId: `${projectId}` },
      { skip: !projectId },
    )

    const [permissionWasCreated, setPermissionWasCreated] =
      useState<boolean>(false)
    const [rolesSelected, setRolesSelected] = useState<
      {
        role: number
        user_role_id: number | undefined
        group_role_id: number | undefined
      }[]
    >([])

    const { data: permissions } = useGetAvailablePermissionsQuery({ level })
    const { data: userWithRolesData, isSuccess: userWithRolesDataSuccesfull } =
      useGetUserWithRolesQuery(
        {
          org_id: id,
          user_id: parseInt(`${user?.id}`),
        },
        { skip: level !== 'organisation' || !user?.id },
      )

    const {
      data: groupWithRolesData,
      isSuccess: groupWithRolesDataSuccesfull,
    } = useGetGroupWithRoleQuery(
      {
        group_id: parseInt(`${group?.id}`),
        org_id: id,
      },
      { skip: level !== 'organisation' || !group?.id },
    )

    useEffect(() => {
      if (user && userWithRolesDataSuccesfull) {
        const resultArray = userWithRolesData?.results?.map((userRole) => ({
          group_role_id: undefined,
          role: userRole.id,
          user_role_id: user?.id,
        }))
        setRolesSelected(resultArray)
      }
      //eslint-disable-next-line
    }, [userWithRolesDataSuccesfull])

    useEffect(() => {
      if (group && groupWithRolesDataSuccesfull) {
        const resultArray = groupWithRolesData?.results?.map((groupRole) => ({
          group_role_id: group?.id,
          role: groupRole.id,
          user_role_id: undefined,
        }))
        setRolesSelected(resultArray)
      }
      //eslint-disable-next-line
    }, [groupWithRolesDataSuccesfull])

    const processResults = (results: (UserPermission | GroupPermission)[]) => {
      const foundPermission = isGroup
        ? find(
            results || [],
            (r) => (r as GroupPermission).group.id === group?.id,
          )
        : role
        ? find(results || [], (r) => (r as GroupPermission).role === role?.id)
        : find(
            results || [],
            (r) => (r as UserPermission).user?.id === user?.id,
          )
      const permissions =
        (role && (level === 'project' || level === 'environment')
          ? foundPermission?.permissions
          : (foundPermission?.permissions || []).map((v) => ({
              permission_key: v,
              tags: [],
            }))) || []
      return {
        ...(foundPermission || {}),
        group: group?.id,
        //Since role permissions and other permissions are different in data structure, adjust permissions to match
        permissions,
        user: user?.id,
      } as EntityPermissions
    }

    const [
      createRolePermissionUser,
      { data: usersData, isSuccess: userAdded },
    ] = useCreateRolesPermissionUsersMutation()

    const [deleteRolePermissionUser] = useDeleteRolesPermissionUsersMutation()
    const [deleteUserWithRoles] = useDeleteUserWithRolesMutation()
    const [deleteGroupWithRoles] = useDeleteGroupWithRoleMutation()
    const [
      createRolePermissionGroup,
      { data: groupsData, isSuccess: groupAdded },
    ] = useCreateRolePermissionGroupMutation()
    const [parentWarning, setParentWarning] = useState(false)

    const [deleteRolePermissionGroup] = useDeleteRolePermissionGroupMutation()

    const [
      updateRolePermissions,
      {
        isError: errorUpdating,
        isLoading: isRolePermUpdating,
        isSuccess: isRolePermUpdated,
      },
    ] = useUpdateRolePermissionsMutation()

    const [
      createRolePermissions,
      {
        isError: errorCreating,
        isLoading: isRolePermCreating,
        isSuccess: isRolePermCreated,
      },
    ] = useCreateRolePermissionsMutation()

    const tagBasedPermissions =
      Utils.getFlagsmithHasFeature('tag_based_permissions') && !!role
    useEffect(() => {
      const isSaving = isRolePermCreating || isRolePermUpdating
      if (isSaving) {
        setSaving(true)
      }
      if (isRolePermCreated || isRolePermUpdated) {
        setPermissionWasCreated(true)
        toast(
          `${level.charAt(0).toUpperCase() + level.slice(1)} permissions Saved`,
        )
        permissionChanged?.()
        onSave?.()
        setSaving(false)
      }
      if (errorUpdating || errorCreating) {
        setSaving(false)
      }

      //eslint-disable-next-line
    }, [
      errorUpdating,
      errorCreating,
      isRolePermCreated,
      isRolePermUpdated,
      isRolePermCreating,
      isRolePermUpdating,
    ])

    const { data: organisationPermissions, isLoading: organisationIsLoading } =
      useGetRoleOrganisationPermissionsQuery(
        {
          organisation_id: parseInt(`${role?.organisation}`),
          role_id: parseInt(`${role?.id}`),
        },
        { skip: !role || level !== 'organisation' },
      )

    const { data: projectPermissions, isLoading: projectIsLoading } =
      useGetRoleProjectPermissionsQuery(
        {
          organisation_id: parseInt(`${role?.organisation}`),
          project_id: parseInt(`${id}`),
          role_id: parseInt(`${role?.id}`),
        },
        {
          skip:
            !id ||
            !!envId ||
            // TODO: https://github.com/Flagsmith/flagsmith/issues/3020
            !role?.organisation ||
            level !== 'project',
        },
      )

    const { data: envPermissions, isLoading: envIsLoading } =
      useGetRoleEnvironmentPermissionsQuery(
        {
          env_id: parseInt(`${envId || id}`),
          organisation_id: parseInt(`${role?.organisation}`),
          role_id: parseInt(`${role?.id}`),
        },
        {
          skip: !role || (!envId && !id) || level !== 'environment',
        },
      )

    useEffect(() => {
      if (
        !organisationIsLoading &&
        organisationPermissions &&
        level === 'organisation'
      ) {
        const entityPermissions = processResults(
          organisationPermissions.results,
        )
        setEntityPermissions(entityPermissions)
      }
      //eslint-disable-next-line
    }, [organisationPermissions, organisationIsLoading])

    useEffect(() => {
      if (!projectIsLoading && projectPermissions && level === 'project') {
        const entityPermissions = processResults(projectPermissions?.results)
        setEntityPermissions(entityPermissions)
      }
      //eslint-disable-next-line
    }, [projectPermissions, projectIsLoading])

    useEffect(() => {
      if (!envIsLoading && envPermissions && level === 'environment') {
        const entityPermissions = processResults(envPermissions?.results)
        setEntityPermissions(entityPermissions)
      }
      //eslint-disable-next-line
    }, [envPermissions, envIsLoading])

    useEffect(() => {
      let parentGet = Promise.resolve()
      if (!role && parentLevel) {
        const parentUrl = isGroup
          ? `${parentLevel}s/${parentId}/user-group-permissions/`
          : `${parentLevel}s/${parentId}/user-permissions/`
        parentGet = _data
          .get(`${Project.api}${parentUrl}`)
          .then((results: (UserPermission & GroupPermission)[]) => {
            const entityPermissions = processResults(results)
            if (
              !entityPermissions.admin &&
              !entityPermissions.permissions.find(
                (v) => v.permission_key === `VIEW_${parentLevel.toUpperCase()}`,
              )
            ) {
              // e.g. trying to set an environment permission but don't have view_project
              setParentError(true)
            } else {
              setParentError(false)
            }
          })
          .catch(() => {
            setParentWarning(true)
            return []
          })
      }
      if (!role) {
        parentGet
          .then(() => {
            const url = isGroup
              ? `${level}s/${id}/user-group-permissions/`
              : `${level}s/${id}/user-permissions/`
            _data
              .get(`${Project.api}${url}`)
              .then((results: (UserPermission & GroupPermission)[]) => {
                // @ts-ignore
                const entityPermissions = processResults(results)
                setEntityPermissions(entityPermissions)
              })
          })
          .catch(() => {
            setParentError(true)
          })
      }
      //eslint-disable-next-line
  }, [])

    const admin = () => entityPermissions && entityPermissions.admin

    const hasPermission = (key: string) => {
      if (admin()) return true
      return entityPermissions.permissions.find(
        (permission) => permission.permission_key === key,
      )
    }

    const getPermissionType = (key: string) => {
      if (admin()) return 'GRANTED'
      const permission = entityPermissions.permissions.find(
        (v) => v.permission_key === key,
      )

      if (!permission) return 'NONE'

      if (permission.tags?.length || limitedPermissions.includes(key)) {
        return 'GRANTED_FOR_TAGS'
      }

      return 'GRANTED'
    }

    const save = useCallback(() => {
      const entityId =
        typeof entityPermissions.id === 'undefined' ? '' : entityPermissions.id
      setValueChanged(false)
      if (!role) {
        const url = isGroup
          ? `${level}s/${id}/user-group-permissions/${entityId}`
          : `${level}s/${id}/user-permissions/${entityId}`
        setSaving(true)
        const action = entityId ? 'put' : 'post'
        _data[action](`${Project.api}${url}${entityId && '/'}`, {
          ...entityPermissions,
          permissions: entityPermissions.permissions.map(
            (v) => v.permission_key,
          ),
        })
          .then(
            (
              res: Omit<EntityPermissions, 'permissions'> & {
                permissions: string[]
              },
            ) => {
              setEntityPermissions({
                ...res,
                permissions: (res.permissions || []).map((v) => ({
                  permission_key: v,
                  tags: [],
                })),
              })
              toast(
                `${
                  level.charAt(0).toUpperCase() + level.slice(1)
                } Permissions Saved`,
              )
              onSave && onSave()
            },
          )
          .catch(() => {
            toast(`Error Saving Permissions`, 'danger')
          })
          .finally(() => {
            setSaving(false)
          })
      } else {
        const body = {
          permissions:
            level === 'organisation'
              ? entityPermissions.permissions.map((v) => v.permission_key)
              : entityPermissions.permissions,
        } as Partial<Req['createRolePermission']['body']>
        if (level === 'project') {
          body.admin = entityPermissions.admin
          body.project = id
        }
        if (level === 'environment') {
          body.admin = entityPermissions.admin
          body.environment = (envId || id) as number
        }
        if (entityId || permissionWasCreated) {
          updateRolePermissions({
            body: body as Req['createRolePermission']['body'],
            id: entityId as number,
            level:
              level === 'organisation'
                ? level
                : (`${level}s` as PermissionLevel),
            organisation_id: role.organisation,
            role_id: role.id,
          }).then(onRoleSaved as any)
        } else {
          createRolePermissions({
            body: body as Req['createRolePermission']['body'],
            level:
              level === 'organisation'
                ? level
                : (`${level}s` as PermissionLevel),
            organisation_id: role.organisation,
            role_id: role.id,
          }).then(onRoleSaved as any)
        }
      }
    }, [
      createRolePermissions,
      entityPermissions,
      envId,
      id,
      isGroup,
      level,
      onSave,
      permissionWasCreated,
      role,
      updateRolePermissions,
    ])
    const [limitedPermissions, setLimitedPermissions] = useState<string[]>([])

    useEffect(() => {
      if (valueChanged) {
        save()
      }
      //eslint-disable-next-line
    }, [valueChanged])

    const selectPermissions = (
      key: string,
      value: 'GRANTED' | 'GRANTED_FOR_TAGS' | 'NONE',
      tags: number[] = [],
    ) => {
      const updatedPermissions = [
        ...entityPermissions.permissions.filter(
          (v) => v.permission_key !== key,
        ),
      ]
      const updatedLimitedPermissions = limitedPermissions.filter(
        (v) => v !== key,
      )
      if (value === 'NONE') {
        setEntityPermissions({
          ...entityPermissions,
          permissions: updatedPermissions,
        })
      } else {
        setEntityPermissions({
          ...entityPermissions,
          permissions: updatedPermissions.concat([
            {
              permission_key: key,
              tags,
            },
          ]),
        })
      }
      if (value === 'GRANTED_FOR_TAGS') {
        setLimitedPermissions(updatedLimitedPermissions.concat([key]))
      } else {
        setLimitedPermissions(updatedLimitedPermissions)
      }
    }
    const togglePermission = (key: string) => {
      if (role) {
        permissionChanged?.()
        const updatedPermissions = [...entityPermissions.permissions]
        const index = updatedPermissions.findIndex(
          (v) => v.permission_key === key,
        )
        if (index === -1) {
          updatedPermissions.push({ permission_key: key, tags: [] })
        } else {
          updatedPermissions.splice(index, 1)
        }

        setEntityPermissions({
          ...entityPermissions,
          permissions: updatedPermissions,
        })
      } else {
        const newEntityPermissions = { ...entityPermissions }

        const index = newEntityPermissions.permissions.findIndex(
          (v) => v.permission_key === key,
        )
        if (index === -1) {
          newEntityPermissions.permissions.push({
            permission_key: key,
            tags: [],
          })
        } else {
          newEntityPermissions.permissions.splice(index, 1)
        }
        setEntityPermissions(newEntityPermissions)
      }
    }

    const toggleAdmin = () => {
      permissionChanged?.()
      setEntityPermissions({
        ...entityPermissions,
        admin: !entityPermissions.admin,
      })
    }
    const addRole = (roleId: number) => {
      if (level === 'organisation') {
        if (user) {
          createRolePermissionUser({
            data: {
              user: user.id,
            },
            organisation_id: id,
            role_id: roleId,
          })
        }
        if (group) {
          createRolePermissionGroup({
            data: {
              group: group.id,
            },
            organisation_id: id,
            role_id: roleId,
          })
        }
      }
    }

    const onRoleRemoved = (res: { error?: any }) => {
      if (!res?.error) {
        toast('User role removed')
      } else {
        toast('Error removing role', 'danger')
      }
    }

    const onRoleSaved = (res: { error?: any }) => {
      // @ts-ignore rtk incorrect types
      if (res.error) {
        toast('Failed to Save', 'danger')
      }
    }

    const removeOwner = (roleId: number) => {
      const roleSelected = rolesAdded.find((item) => item.id === roleId)
      if (level === 'organisation') {
        if (user) {
          if (isEditUserPermission) {
            deleteUserWithRoles({
              org_id: id,
              role_id: roleId,
              user_id: user?.id,
            }).then(onRoleRemoved as any)
          } else {
            deleteRolePermissionUser({
              organisation_id: id,
              role_id: roleId,
              user_id: roleSelected?.user_role_id!,
            }).then(onRoleRemoved as any)
          }
        }
        if (group) {
          if (isEditGroupPermission) {
            deleteGroupWithRoles({
              group_id: group?.id,
              org_id: id,
              role_id: roleId,
            }).then(onRoleRemoved as any)
          } else if (roleSelected) {
            deleteRolePermissionGroup({
              group_id: roleSelected.group_role_id!,
              organisation_id: id,
              role_id: roleId,
            }).then(onRoleRemoved as any)
          }
        }
      }
      setRolesSelected((rolesSelected || []).filter((v) => v.role !== roleId))
    }

    useEffect(() => {
      if (userAdded || groupAdded) {
        if (user) {
          setRolesSelected(
            (rolesSelected || []).concat({
              group_role_id: undefined,
              role: usersData?.role!,
              user_role_id: usersData?.id,
            }),
          )
        }
        if (group) {
          setRolesSelected(
            (rolesSelected || []).concat({
              group_role_id: groupsData?.id,
              role: groupsData?.role!,
              user_role_id: undefined,
            }),
          )
        }
        toast('Role assigned')
      }
      //eslint-disable-next-line
    }, [userAdded, usersData, groupsData, groupAdded])

    const getRoles = (
      roles: Role[] = [],
      selectedRoles: typeof rolesSelected,
    ) => {
      return roles
        .filter((v) => selectedRoles.find((a) => a.role === v.id))
        .map((role) => {
          const matchedRole = selectedRoles.find((r) => r.role === role.id)
          if (matchedRole) {
            if (user) {
              return {
                group_role_id: undefined,
                ...role,
                user_role_id: matchedRole.user_role_id,
              }
            }
            if (group) {
              return {
                user_role_id: undefined,
                ...role,
                group_role_id: matchedRole.group_role_id,
              }
            }
          }
          return {
            group_role_id: undefined,
            user_role_id: undefined,
            ...role,
          }
        })
    }

    const getEditText = () => {
      if (isGroup) {
        return `the ${group?.name || ''} group`
      }
      if (user) {
        return `${user.first_name || ''} ${user.last_name || ''}`
      }
      if (role) {
        return role.name
      }
      return name
    }

    const rolesAdded = getRoles(roles, rolesSelected || [])
    const isAdmin = admin()

    return !permissions || !entityPermissions ? (
      <div className='modal-body text-center'>
        <Loader />
      </div>
    ) : (
      <PlanBasedAccess className='px-4 pt-4' feature={'RBAC'} theme={'page'}>
        <div>
          <div className={classNames('modal-body', className || 'px-4 mt-4')}>
            {level !== 'organisation' && (
              <div className='mb-2'>
                <Row className={role ? 'py-2' : ''}>
                  <Flex>
                    <div className='font-weight-medium text-dark mb-1'>
                      Administrator
                    </div>
                  </Flex>
                  <Switch
                    disabled={saving}
                    data-test={`admin-switch-${level}`}
                    onChange={() => {
                      toggleAdmin()
                      setValueChanged(true)
                    }}
                    checked={isAdmin}
                  />
                </Row>
              </div>
            )}
            <PanelSearch
              filterRow={(item: AvailablePermission, search: string) => {
                const name = Format.enumeration.get(item.key).toLowerCase()
                return name.includes(search?.toLowerCase() || '')
              }}
              title='Permissions'
              className='no-pad mb-2 overflow-visible'
              items={permissions}
              renderRow={(p: AvailablePermission, index: number) => {
                const levelUpperCase = level.toUpperCase()
                const disabled =
                  level !== 'organisation' &&
                  p.key !== `VIEW_${levelUpperCase}` &&
                  !hasPermission(`VIEW_${levelUpperCase}`)
                const permission = entityPermissions.permissions.find(
                  (v) => v.permission_key === p.key,
                )
                const permissionType = getPermissionType(p.key)
                return (
                  <Row
                    key={p.key}
                    style={admin() ? { opacity: 0.5 } : undefined}
                    className='list-item list-item-sm px-3 py-2'
                  >
                    <Row space>
                      <Flex>
                        <strong>{Format.enumeration.get(p.key)}</strong>
                        <div className='list-item-subtitle'>
                          {p.description}
                        </div>
                        {permissionType === 'GRANTED_FOR_TAGS' && (
                          <AddEditTags
                            projectId={`${projectId}`}
                            value={permission?.tags || []}
                            onChange={(v) => {
                              setValueChanged(true)
                              selectPermissions(p.key, 'GRANTED_FOR_TAGS', v)
                            }}
                          />
                        )}
                      </Flex>
                      {tagBasedPermissions ? (
                        <div className='ms-2' style={{ width: 200 }}>
                          <Select
                            value={permissionOptions.find(
                              (v) => v.value === permissionType,
                            )}
                            onChange={(v) => {
                              setValueChanged(true)
                              selectPermissions(p.key, v.value)
                            }}
                            className='react-select select-sm'
                            disabled={disabled || admin() || saving}
                            options={
                              p.supports_tag
                                ? permissionOptions
                                : permissionOptions.filter(
                                    (v) => v.value !== 'GRANTED_FOR_TAGS',
                                  )
                            }
                            components={{ SingleValue }}
                          />
                        </div>
                      ) : (
                        <Switch
                          data-test={`permission-switch-${p.key}`}
                          onChange={() => {
                            setValueChanged(true)
                            togglePermission(p.key)
                          }}
                          disabled={disabled || admin() || saving}
                          checked={!disabled && hasPermission(p.key)}
                        />
                      )}
                    </Row>
                  </Row>
                )
              }}
            />

            <p className='text-right mt-5 text-dark'>
              This will edit the permissions for{' '}
              <strong>{getEditText()}</strong>.
            </p>

            {!!parentWarning && (
              <InfoMessage>
                You do not have permission to verify whether this user has view
                access for this {parentLevel}. If you need assistance, please
                contact a {parentLevel} administrator.
              </InfoMessage>
            )}
            {parentError && !role && (
              <div className='mt-4'>
                <InfoMessage>
                  The selected {isGroup ? 'group' : 'user'} does not have
                  explicit user permissions to view this {parentLevel}. If the
                  user does not belong to any groups with this permissions, you
                  may have to adjust their permissions in{' '}
                  <a
                    onClick={() => {
                      if (parentSettingsLink) {
                        push(parentSettingsLink)
                      }
                      closeModal()
                    }}
                  >
                    <strong>{parentLevel} settings</strong>
                  </a>
                  .
                </InfoMessage>
              </div>
            )}
          </div>
          {roles && level === 'organisation' && (
            <FormGroup className='px-4'>
              <InputGroup
                component={
                  <div>
                    <Row>
                      <strong style={{ width: 70 }}>Roles: </strong>
                      {rolesAdded?.map((r) => (
                        <Row
                          key={r.id}
                          onClick={() => removeOwner(r.id)}
                          className='chip'
                          style={{ marginBottom: 4, marginTop: 4 }}
                        >
                          <span className='font-weight-bold'>{r.name}</span>
                          <span className='chip-icon ion'>
                            <IonIcon
                              icon={closeIcon}
                              style={{ fontSize: '13px' }}
                            />
                          </span>
                        </Row>
                      ))}
                      <Button
                        theme='text'
                        onClick={() => setShowRoles(true)}
                        style={{ width: 70 }}
                      >
                        Add Role
                      </Button>
                    </Row>
                  </div>
                }
                type='text'
                title='Assign roles'
                tooltip='Assigns what role the user/group will have'
                inputProps={{
                  className: 'full-width',
                  style: { minHeight: 80 },
                }}
                className='full-width'
                placeholder='Add an optional description...'
              />
            </FormGroup>
          )}
          {level !== 'environment' && level !== 'project' && (
            <div className='px-4'>
              <MyRoleSelect
                orgId={id}
                level={level}
                value={rolesSelected?.map((v) => v.role)}
                onAdd={addRole}
                onRemove={removeOwner}
                isOpen={showRoles}
                onToggle={() => setShowRoles(!showRoles)}
              />
            </div>
          )}
        </div>
      </PlanBasedAccess>
    )
  }),
)

export const EditPermissionsModal = ConfigProvider(
  _EditPermissionsModal,
) as unknown as FC<EditPermissionModalType>

const rolesWidths = [250, 600, 100]
const EditPermissions: FC<EditPermissionsType> = (props) => {
  const {
    envId,
    id,
    level,
    onSaveGroup,
    onSaveUser,
    parentId,
    parentLevel,
    parentSettingsLink,
    permissions,
    roleTabTitle,
    roles,
    router,
    tabClassName,
  } = props
  const [tab, setTab] = useState()
  const editUserPermissions = (user: User) => {
    openModal(
      `Edit ${Format.camelCase(level)} Permissions`,
      <EditPermissionsModal
        name={`${user.first_name} ${user.last_name}`}
        id={id}
        onSave={onSaveUser}
        level={level}
        parentId={parentId}
        parentLevel={parentLevel}
        parentSettingsLink={parentSettingsLink}
        user={user}
        push={router.history.push}
      />,
      'p-0 side-modal',
    )
  }

  const editGroupPermissions = (group: UserGroup) => {
    openModal(
      `Edit ${Format.camelCase(level)} Permissions`,
      <EditPermissionsModal
        name={`${group.name}`}
        id={id}
        isGroup
        onSave={onSaveGroup}
        level={level}
        parentId={parentId}
        parentLevel={parentLevel}
        parentSettingsLink={parentSettingsLink}
        group={group}
        push={router.history.push}
      />,
      'p-0 side-modal',
    )
  }
  const editRolePermissions = (role: Role) => {
    openModal(
      `Edit ${Format.camelCase(level)} Role Permissions`,
      <EditPermissionsModal
        name={`${role.name}`}
        id={id}
        envId={envId}
        level={level}
        role={role}
        push={router.history.push}
      />,
      'p-0 side-modal',
    )
  }
  return (
    <div className='mt-4'>
      <Row>
        <h5>Manage Permissions</h5>
      </Row>
      <p className='fs-small lh-sm col-md-8 mb-4'>
        Flagsmith lets you manage fine-grained permissions for your projects and
        environments.{' '}
        <Button
          theme='text'
          href='https://docs.flagsmith.com/system-administration/rbac'
          target='_blank'
          className='fw-normal'
        >
          Learn about User Roles.
        </Button>
      </p>
      <Tabs urlParam='type' value={tab} onChange={setTab} theme='pill'>
        <TabItem tabLabel='Users'>
          <OrganisationProvider>
            {({ isLoading, users }) => (
              <div className='mt-4'>
                {isLoading && !users?.length && (
                  <div className='centered-container'>
                    <Loader />
                  </div>
                )}
                {!!users?.length && (
                  <div>
                    <FormGroup className='panel no-pad pl-2 pr-2 panel--nested'>
                      <div className={tabClassName}>
                        <PanelSearch
                          id='org-members-list'
                          title='Users'
                          className='panel--transparent'
                          items={users}
                          itemHeight={64}
                          header={
                            <Row className='table-header'>
                              <Flex className='table-column px-3'>User</Flex>
                              <Flex className='table-column'>Role</Flex>
                              <div
                                style={{ width: '80px' }}
                                className='table-column text-center'
                              >
                                Action
                              </div>
                            </Row>
                          }
                          renderRow={(user: User) => {
                            const { email, first_name, id, last_name, role } =
                              user
                            const onClick = () => {
                              if (role !== 'ADMIN') {
                                editUserPermissions(user)
                              }
                            }
                            const matchingPermissions = permissions?.find(
                              (v) => v.user.id === id,
                            )

                            return (
                              <Row
                                onClick={onClick}
                                space
                                className={`list-item${
                                  role === 'ADMIN' ? '' : ' clickable'
                                }`}
                                key={id}
                              >
                                <Flex className='table-column px-3'>
                                  <div className='mb-1 font-weight-medium'>
                                    {`${first_name} ${last_name}`}{' '}
                                    {id == AccountStore.getUserId() && '(You)'}
                                  </div>
                                  <div className='list-item-subtitle'>
                                    {email}
                                  </div>
                                </Flex>
                                {role === 'ADMIN' ? (
                                  <Flex className='table-column fs-small lh-sm'>
                                    <Tooltip
                                      title={'Organisation Administrator'}
                                    >
                                      {
                                        'Organisation administrators have all permissions enabled.<br/>To change the role of this user, visit Organisation Settings.'
                                      }
                                    </Tooltip>
                                  </Flex>
                                ) : (
                                  <Flex
                                    onClick={onClick}
                                    className='table-column fs-small lh-sm'
                                  >
                                    {matchingPermissions &&
                                    matchingPermissions.admin
                                      ? `${Format.camelCase(
                                          level,
                                        )} Administrator`
                                      : 'Regular User'}
                                  </Flex>
                                )}
                                <div
                                  style={{ width: '80px' }}
                                  className='text-center'
                                >
                                  {role !== 'ADMIN' && (
                                    <Icon
                                      name='setting'
                                      width={20}
                                      fill='#656D7B'
                                    />
                                  )}
                                </div>
                              </Row>
                            )
                          }}
                          renderNoResults={
                            <div>You have no users in this organisation.</div>
                          }
                          filterRow={(item: User, search: string) => {
                            const strToSearch = `${item.first_name} ${item.last_name} ${item.email}`
                            return (
                              strToSearch
                                .toLowerCase()
                                .indexOf(search.toLowerCase()) !== -1
                            )
                          }}
                        />
                      </div>

                      <div id='select-portal' />
                    </FormGroup>
                  </div>
                )}
              </div>
            )}
          </OrganisationProvider>
        </TabItem>
        <TabItem tabLabel='Groups'>
          <FormGroup className='panel no-pad pl-2 mt-4 pr-2 panel--nested'>
            <div className={tabClassName}>
              <UserGroupList
                noTitle
                orgId={AccountStore.getOrganisation().id}
                projectId={level === 'project' ? id : undefined}
                onClick={(group: UserGroup) => editGroupPermissions(group)}
              />
            </div>
          </FormGroup>
        </TabItem>
        <TabItem tabLabel='Roles'>
          <PlanBasedAccess className='mt-4' feature={'RBAC'} theme='page'>
            <Row space className='mt-4'>
              <h5 className='m-b-0'>{roleTabTitle}</h5>
            </Row>
            <PanelSearch
              id='org-members-list'
              title={'Roles'}
              className='no-pad'
              items={roles}
              itemHeight={65}
              header={
                <Row className='table-header px-3'>
                  <div
                    style={{
                      width: rolesWidths[0],
                    }}
                  >
                    Roles
                  </div>
                  <div
                    style={{
                      width: rolesWidths[1],
                    }}
                  >
                    Description
                  </div>
                </Row>
              }
              renderRow={(role: Role) => (
                <Row
                  className='list-item clickable cursor-pointer'
                  key={role.id}
                >
                  <Row
                    onClick={() => editRolePermissions(role)}
                    className='table-column px-3'
                    style={{
                      width: rolesWidths[0],
                    }}
                  >
                    {role.name}
                  </Row>
                  <Row
                    className='table-column px-3'
                    onClick={() => editRolePermissions(role)}
                    style={{
                      width: rolesWidths[1],
                    }}
                  >
                    {role.description}
                  </Row>
                </Row>
              )}
              renderNoResults={
                <Panel title={'Roles'} className='no-pad'>
                  <div className='search-list'>
                    <Row className='list-item p-3 text-muted'>
                      {`You currently have no roles.`}
                    </Row>
                  </div>
                </Panel>
              }
              isLoading={false}
            />
          </PlanBasedAccess>
        </TabItem>
      </Tabs>
    </div>
  )
}

export default ConfigProvider(EditPermissions) as unknown as FC<
  Omit<EditPermissionsType, 'router'>
>
