import React, { FC, forwardRef, Ref, useState } from 'react'
import Icon from './Icon'
import { EditPermissionsModal } from './EditPermissions'
import {
  useGetRoleEnvironmentPermissionsQuery,
  useGetRoleProjectPermissionsQuery,
} from 'common/services/useRolePermission'
import { PermissionLevel } from 'common/types/requests'
import { Role, User, UserGroupSummary } from 'common/types/responses'
import PanelSearch from './PanelSearch'
import PermissionsSummaryList from './PermissionsSummaryList'

type NameAndId = {
  name: string
  id: number | string
  [key: string]: any
}

type RolePermissionsListProps = {
  mainItems: NameAndId[]
  role?: Role | undefined
  ref?: Ref<any>
  level: PermissionLevel
  filter: string
  orgId?: string
  user?: User
  group?: UserGroupSummary
}

export type PermissionsSummaryType = {
  level: PermissionLevel
  levelId: number
  organisationId: number
  role?: Role
}
const PermissionsSummary: FC<PermissionsSummaryType> = ({
  level,
  levelId,
  organisationId,
  role,
}) => {
  const { data: projectPermissions, isLoading: projectIsLoading } =
    useGetRoleProjectPermissionsQuery(
      {
        organisation_id: organisationId,
        project_id: levelId,
        role_id: parseInt(`${role?.id}`),
      },
      { skip: !levelId || level !== 'project' || !role },
    )

  const { data: envPermissions, isLoading: envIsLoading } =
    useGetRoleEnvironmentPermissionsQuery(
      {
        env_id: levelId,
        organisation_id: organisationId,
        role_id: parseInt(`${role?.id}`),
      },
      { skip: !levelId || level !== 'environment' || !role },
    )

  const permissions = projectPermissions || envPermissions
  const roleResult = permissions?.results.filter(
    (item) => item.role === role?.id,
  )
  const rolePermissions =
    roleResult && roleResult.length > 0 ? roleResult[0].permissions : []

  const isAdmin =
    roleResult && roleResult.length > 0 ? roleResult[0].admin : false

  return projectIsLoading || envIsLoading ? null : (
    <PermissionsSummaryList isAdmin={isAdmin} permissions={rolePermissions} />
  )
}

const RolePermissionsList: React.FC<RolePermissionsListProps> = forwardRef(
  ({ filter, group, level, mainItems, orgId, role, user }, ref) => {
    const [expandedItems, setExpandedItems] = useState<(string | number)[]>([])

    const mainItemsFiltered =
      mainItems &&
      mainItems?.filter((v) => {
        const search = filter.toLowerCase()
        if (!search) return true
        return `${v.name}`.toLowerCase().includes(search)
      })

    const toggleExpand = async (id: string | number) => {
      setExpandedItems((prevExpanded) =>
        prevExpanded.includes(id)
          ? prevExpanded.filter((item) => item !== id)
          : [...prevExpanded, id],
      )
    }

    return (
      <PanelSearch
        header={
          <Row className='table-header'>
            <Flex className='px-3'>Name</Flex>
          </Row>
        }
        renderRow={(mainItem: NameAndId, index: number) => (
          <div
            className='list-item d-flex flex-column justify-content-center py-2 list-item-sm clickable'
            data-test={`permissions-${mainItem.name.toLowerCase()}`}
            key={mainItem.id}
          >
            <Row
              className='px-3 flex-fill align-items-center user-select-none clickable'
              key={index}
              onClick={() => toggleExpand(mainItem.id)}
            >
              <Flex>
                <div className={'list-item-subtitle'}>
                  <strong>{mainItem.name}</strong>{' '}
                </div>
              </Flex>
              <Flex>
                <div className={'list-item-subtitle'}>
                  <PermissionsSummary
                    level={level}
                    levelId={mainItem.id}
                    organisationId={orgId}
                    role={role}
                  />
                </div>
              </Flex>
              <div>
                <Icon
                  fill={'#9DA4AE'}
                  name={
                    expandedItems.includes(mainItem.id)
                      ? 'chevron-down'
                      : 'chevron-right'
                  }
                />
              </div>
            </Row>
            <div>
              {expandedItems.includes(mainItem.id) && (
                <EditPermissionsModal
                  id={mainItem.id}
                  level={level}
                  role={role}
                  className='mt-2 px-3'
                  isGroup={!!group}
                  parentId={mainItem.parentId}
                  group={group}
                  user={user}
                />
              )}
            </div>
          </div>
        )}
        items={mainItemsFiltered || []}
        className='no-pad overflow-visible'
      />
    )
  },
)

export default RolePermissionsList
