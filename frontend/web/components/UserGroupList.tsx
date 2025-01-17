import React, { FC, ReactNode, useState } from 'react'
const CreateGroup = require('./modals/CreateGroup')
import Button from './base/forms/Button'
import AccountStore from 'common/stores/account-store'
import {
  UserGroup,
  GroupPermission,
  UserGroupSummary,
} from 'common/types/responses'
import {
  useDeleteGroupMutation,
  useGetGroupsQuery,
} from 'common/services/useGroup'
import { useGetUserGroupPermissionQuery } from 'common/services/useUserGroupPermission'
import PanelSearch from './PanelSearch'
import { sortBy } from 'lodash'
import InfoMessage from './InfoMessage'
import Icon from './Icon'
import PermissionsSummaryList from './PermissionsSummaryList'
import Panel from './base/grid/Panel'
import { useGetGroupSummariesQuery } from 'common/services/useGroupSummary'

type UserGroupListType = {
  noTitle?: boolean
  orgId: string
  projectId?: number | string
  showRemove?: boolean
  onClick: (group: UserGroup) => void
  onEditPermissions?: (group: UserGroup) => void
}

type UserGroupsRowType = {
  id: number
  index: number
  name: string
  permissionSummary?: ReactNode
  group: UserGroup | GroupPermission
  orgId: string
  showRemove?: boolean
  onClick: (group: UserGroup) => void
  onEditPermissions?: (group: UserGroup) => void
}
const UserGroupsRow: FC<UserGroupsRowType> = ({
  group,
  id,
  index,
  name,
  onClick,
  onEditPermissions,
  orgId,
  permissionSummary,
  showRemove,
}) => {
  const [deleteGroup] = useDeleteGroupMutation({})
  const isAdmin = AccountStore.isAdmin()

  const removeGroup = (id: number, name: string) => {
    openConfirm({
      body: (
        <div>
          {'Are you sure you want to delete '}
          <strong>{name}</strong>
          {'? This action cannot be undone.'}
        </div>
      ),
      destructive: true,
      onYes: () => deleteGroup({ id, orgId }),
      title: 'Delete Group',
      yesText: 'Confirm',
    })
  }
  const _onClick = () => {
    if (onClick) {
      onClick(group)
    } else {
      openModal(
        'Edit Group',
        <CreateGroup isEdit orgId={orgId} group={group} />,
        'side-modal',
      )
    }
  }
  return (
    <Row
      space
      onClick={_onClick}
      className='list-item list-item-sm clickable'
      key={id}
      data-test={`user-item-${index}`}
    >
      <Flex className=' table-column px-3'>
        <div className='font-weight-medium'>{name}</div>
      </Flex>
      {permissionSummary && <Flex>{permissionSummary}</Flex>}

      {onEditPermissions && isAdmin ? (
        <div
          style={{
            width: '170px',
          }}
          onClick={() => onEditPermissions(group)}
          className='table-column'
        >
          <Button theme='text' size='small'>
            <Icon name='edit' width={18} fill='#6837FC' /> Edit Permissions
          </Button>
        </div>
      ) : (
        <div style={{ width: '140px' }} className='table-column'></div>
      )}
      {showRemove ? (
        <div style={{ width: '80px' }} className='table-column text-center'>
          {isAdmin && (
            <Button
              id='remove-group'
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                removeGroup(id, name)
              }}
              className='btn btn-with-icon'
            >
              <Icon name='trash-2' width={20} fill='#656D7B' />
            </Button>
          )}
        </div>
      ) : (
        <div
          onClick={_onClick}
          style={{ width: '72px' }}
          className='px-3 text-center'
        >
          <Icon name='setting' width={20} fill='#656D7B' />
        </div>
      )}
    </Row>
  )
}

const UserGroupList: FC<UserGroupListType> = ({
  noTitle,
  onClick,
  onEditPermissions,
  orgId,
  projectId,
  showRemove,
}) => {
  const [page, setPage] = useState(1)
  const { data: userGroups, isLoading } = useGetGroupSummariesQuery(
    {
      orgId: `${orgId}`,
    },
    {
      skip: !orgId,
    },
  )
  const { data: userGroupsPermission, isLoading: userGroupPermissionLoading } =
    useGetUserGroupPermissionQuery(
      {
        project_id: `${projectId}`,
      },
      {
        skip: !projectId,
      },
    )

  const mergeduserGroupsPermissionWithUserGroups = userGroupsPermission
    ? [...userGroupsPermission]
    : []

  userGroups?.forEach?.((group) => {
    const existingPermissionIndex =
      mergeduserGroupsPermissionWithUserGroups.findIndex(
        (userGroupPermission) => userGroupPermission.group.id === group.id,
      )
    if (existingPermissionIndex === -1) {
      mergeduserGroupsPermissionWithUserGroups.push({
        admin: false,
        group: group,
        id: group.id,
        permissions: [],
        tag_based_permissions: [],
      })
    }
  })

  return (
    <FormGroup>
      <div className='col-md-6'>
        <InfoMessage collapseId={'user-groups'}>
          Group admins and users with the organisation permission{' '}
          <strong>Manage Groups</strong> can invite additional members to
          groups.
        </InfoMessage>
      </div>
      <PanelSearch
        id='users-list'
        title={noTitle ? '' : 'Groups'}
        className='no-pad'
        itemHeight={64}
        items={
          userGroupsPermission
            ? sortBy(mergeduserGroupsPermissionWithUserGroups, 'group.name')
            : sortBy(userGroups, 'name')
        }
        paging={mergeduserGroupsPermissionWithUserGroups || userGroups}
        nextPage={() => setPage(page + 1)}
        prevPage={() => setPage(page - 1)}
        goToPage={setPage}
        header={
          showRemove && (
            <Row className='table-header'>
              <Flex className='table-column px-3'>Groups</Flex>
              <div style={{ width: '170px' }} className='table-column'>
                Action
              </div>
              <div
                style={{ width: '80px' }}
                className='table-column text-center'
              >
                Remove
              </div>
            </Row>
          )
        }
        renderRow={(group: UserGroup | GroupPermission, index: number) => {
          if (userGroupsPermission) {
            const {
              admin,
              group: userPermissionGroup,
              permissions,
            } = group as GroupPermission
            return (
              <UserGroupsRow
                group={userPermissionGroup}
                id={userPermissionGroup.id}
                index={index}
                name={userPermissionGroup.name}
                onClick={onClick}
                onEditPermissions={onEditPermissions}
                orgId={orgId}
                permissionSummary={
                  <PermissionsSummaryList
                    permissions={permissions?.map((v) => ({
                      permission_key: v,
                      tags: [],
                    }))}
                    isAdmin={admin}
                    numberToTruncate={3}
                  />
                }
                showRemove={showRemove}
              />
            )
          } else {
            const { id, name } = group as UserGroup
            return (
              <UserGroupsRow
                group={group}
                id={id}
                index={index}
                name={name}
                onClick={onClick}
                onEditPermissions={onEditPermissions}
                orgId={orgId}
                showRemove={showRemove}
              />
            )
          }
        }}
        isLoading={isLoading || userGroupPermissionLoading}
        renderNoResults={
          <Panel title={noTitle ? '' : 'Groups'} className='no-pad'>
            <div className='search-list'>
              <Row className='list-item p-3 text-muted'>
                You have no groups in your organisation.
              </Row>
            </div>
          </Panel>
        }
      />
    </FormGroup>
  )
}

export default UserGroupList
