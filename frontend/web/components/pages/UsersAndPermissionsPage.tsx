import React, { FC, useState } from 'react'
import classNames from 'classnames'
import JSONReference from 'components/JSONReference'
import Button from 'components/base/forms/Button'
import Tabs from 'components/base/forms/Tabs'
import TabItem from 'components/base/forms/TabItem'
import Utils from 'common/utils/utils'
import Constants from 'common/constants'
import ConfigProvider from 'common/providers/ConfigProvider'
import InviteUsersModal from 'components/modals/InviteUsers'
import InfoMessage from 'components/InfoMessage'
import OrganisationProvider from 'common/providers/OrganisationProvider'
import AccountStore from 'common/stores/account-store'
import AccountProvider from 'common/providers/AccountProvider'
import {
  Invite,
  InviteLink,
  Organisation,
  SubscriptionMeta,
  User,
  UserGroupSummary,
} from 'common/types/responses'
import CreateGroup from 'components/modals/CreateGroup'
import UserGroupList from 'components/UserGroupList'
import { useGetRolesQuery } from 'common/services/useRole'
import AppActions from 'common/dispatcher/app-actions'
import { RouterChildContext } from 'react-router'
import map from 'lodash/map'
import Input from 'components/base/forms/Input'
import ErrorMessage from 'components/ErrorMessage'
import PanelSearch from 'components/PanelSearch'
import Format from 'common/utils/format'
import moment from 'moment'
import PermissionsTabs from 'components/PermissionsTabs'
import sortBy from 'lodash/sortBy'
import UserAction from 'components/UserAction'
import Icon from 'components/Icon'
import RolesTable from 'components/RolesTable'
import UsersGroups from 'components/UsersGroups'
import PlanBasedBanner, { getPlanBasedOption } from 'components/PlanBasedAccess'
import { useHasPermission } from 'common/providers/Permission'

type UsersAndPermissionsPageType = {
  router: RouterChildContext['router']
}

const widths = [300, 200, 80]

type UsersAndPermissionsInnerType = {
  organisation: Organisation
  error: any
  invalidateInviteLink: typeof AppActions.invalidateInviteLink
  inviteLinks: InviteLink[] | null
  invites: Invite[] | null
  isLoading: boolean
  users: User[]
  subscriptionMeta: SubscriptionMeta | null
  router: RouterChildContext['router']
}

const UsersAndPermissionsInner: FC<UsersAndPermissionsInnerType> = ({
  error,
  invalidateInviteLink,
  inviteLinks,
  invites,
  isLoading,
  organisation,
  router,
  subscriptionMeta,
  users,
}) => {
  const paymentsEnabled = Utils.getFlagsmithHasFeature('payments_enabled')
  const verifySeatsLimit = Utils.getFlagsmithHasFeature(
    'verify_seats_limit_for_invite_links',
  )
  const manageUsersPermission = useHasPermission({
    id: AccountStore.getOrganisation()?.id,
    level: 'organisation',
    permission: 'MANAGE_USERS',
  })
  const manageGroupsPermission = useHasPermission({
    id: AccountStore.getOrganisation()?.id,
    level: 'organisation',
    permission: 'MANAGE_USER_GROUPS',
  })

  const roleChanged = (id: number, { value: role }: { value: string }) => {
    AppActions.updateUserRole(id, role)
  }
  const { data: roles } = useGetRolesQuery({ organisation_id: organisation.id })

  const editGroup = (group: UserGroupSummary) => {
    openModal(
      'Edit Group',
      <CreateGroup
        roles={roles}
        isEdit
        orgId={AccountStore.getOrganisation().id}
        group={group}
      />,
      'side-modal',
    )
  }
  const meta = subscriptionMeta || organisation.subscription || { max_seats: 1 }
  const max_seats = meta.max_seats || 1
  const isAWS = AccountStore.getPaymentMethod() === 'AWS_MARKETPLACE'
  const autoSeats = !isAWS && Utils.getPlansPermission('AUTO_SEATS')
  const usedSeats = paymentsEnabled && organisation.num_seats >= max_seats
  const overSeats = paymentsEnabled && organisation.num_seats > max_seats
  const [role, setRole] = useState<'ADMIN' | 'USER'>('ADMIN')

  const editUserPermissions = (user: User, organisationId: number) => {
    openModal(
      user.first_name || user.last_name
        ? `${user.first_name} ${user.last_name}`
        : `${user.email}`,
      <div>
        <Tabs uncontrolled hideNavOnSingleTab>
          {user.role !== 'ADMIN' && (
            <TabItem tabLabel='Permissions'>
              <div className='pt-4'>
                <PermissionsTabs
                  uncontrolled
                  user={user}
                  orgId={organisationId}
                />
              </div>
            </TabItem>
          )}
          <TabItem tabLabel='Groups'>
            <div className='pt-4'>
              <UsersGroups user={user} orgId={organisationId} />
            </div>
          </TabItem>
        </Tabs>
      </div>,
      'p-0 side-modal',
    )
  }
  const formatLastLoggedIn = (last_login: string | undefined) => {
    if (!last_login) return 'Never'

    const diff = moment().diff(moment(last_login), 'days')
    if (diff >= 30) {
      return (
        <div className='mb-1'>
          {`${diff} days ago`}
          <br />
          <div className='list-item-subtitle'>
            {moment(last_login).format('Do MMM YYYY')}
          </div>
        </div>
      )
    }
    return 'Within 30 days'
  }

  const deleteUser = (id: number, userDisplayName: string) => {
    openConfirm({
      body: (
        <div>
          Are you sure you want to remove the user{' '}
          <strong>{userDisplayName}</strong> from the organisation? This action
          cannot be undone.
        </div>
      ),
      destructive: true,
      onYes: () => AppActions.deleteUser(id),
      title: 'Delete User',
      yesText: 'Confirm',
    })
  }
  const deleteInvite = (id: number) => {
    openConfirm({
      body: (
        <div>
          Are you sure you want to delete this invite? This action cannot be
          undone.
        </div>
      ),
      destructive: true,
      onYes: () => AppActions.deleteInvite(id),
      title: 'Delete Invite',
      yesText: 'Confirm',
    })
  }
  const needsUpgradeForAdditionalSeats =
    (overSeats && (!verifySeatsLimit || !autoSeats)) ||
    (!autoSeats && usedSeats)
  return (
    <div className='app-container container'>
      <JSONReference
        showNamesButton
        className='mt-4'
        title={'Members'}
        json={users}
      />
      <JSONReference title={'Invite Links'} json={inviteLinks} />

      <FormGroup className='mt-4'>
        <div className='col-md-8'>
          <h5 className='mb-2'>Manage Users and Permissions</h5>
          <p className='mb-4 fs-small lh-sm'>
            Flagsmith lets you manage fine-grained permissions for your projects
            and environments, invite members as a user or an administrator and
            then set permission in your Project and Environment settings.{' '}
            <Button
              theme='text'
              href='https://docs.flagsmith.com/system-administration/rbac'
              target='_blank'
              className='fw-normal'
            >
              Learn about User Roles.
            </Button>
          </p>
        </div>
        <div>
          <div>
            <div>
              {isLoading && (
                <div className='centered-container'>
                  <Loader />
                </div>
              )}
              {!isLoading && (
                <div>
                  <Tabs urlParam={'type'} theme='pill' uncontrolled>
                    <TabItem tabLabel='Members'>
                      <Row space className='mt-4'>
                        <h5 className='mb-0'>Team Members</h5>
                        {Utils.renderWithPermission(
                          !manageUsersPermission.permission,
                          Constants.organisationPermissions('Admin'),
                          <Button
                            disabled={
                              needsUpgradeForAdditionalSeats ||
                              !manageUsersPermission.permission
                            }
                            id='btn-invite'
                            onClick={() =>
                              openModal(
                                'Invite Users',
                                <InviteUsersModal />,
                                'p-0 side-modal',
                              )
                            }
                            type='button'
                            size='small'
                          >
                            Invite members
                          </Button>,
                        )}
                      </Row>
                      <FormGroup className='mt-2'>
                        {paymentsEnabled && !isLoading && (
                          <div className='col-md-6 mt-3 mb-4'>
                            <InfoMessage>
                              {'You are currently using '}
                              <strong
                                className={overSeats ? 'text-danger' : ''}
                              >
                                {`${organisation.num_seats} of ${max_seats}`}
                              </strong>
                              {` seat${
                                organisation.num_seats === 1 ? '' : 's'
                              } `}{' '}
                              for your plan.{' '}
                              {usedSeats && (
                                <>
                                  {overSeats &&
                                  (!verifySeatsLimit || !autoSeats) ? (
                                    <strong>
                                      If you wish to invite any additional
                                      members, please{' '}
                                      {
                                        <a href='#' onClick={Utils.openChat}>
                                          Contact us
                                        </a>
                                      }
                                      .
                                    </strong>
                                  ) : needsUpgradeForAdditionalSeats ? (
                                    <div className='fw-semibold'>
                                      If you wish to invite any additional
                                      members, please{' '}
                                      {
                                        <a
                                          href='#'
                                          onClick={() => {
                                            router.history.replace(
                                              Constants.getUpgradeUrl(),
                                            )
                                          }}
                                        >
                                          Upgrade your plan
                                        </a>
                                      }
                                      .
                                    </div>
                                  ) : (
                                    <strong>
                                      You will automatically be charged
                                      $20/month for each additional member that
                                      joins your organisation.
                                    </strong>
                                  )}
                                </>
                              )}
                            </InfoMessage>
                          </div>
                        )}
                        {inviteLinks &&
                          (!verifySeatsLimit ||
                            !needsUpgradeForAdditionalSeats) && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                              }}
                            >
                              <div className='mt-3'>
                                <Row>
                                  <div className='mr-3' style={{ width: 257 }}>
                                    <Select
                                      value={{
                                        label:
                                          role === 'ADMIN'
                                            ? 'Organisation Administrator'
                                            : 'User',
                                        value: role,
                                      }}
                                      onChange={(v: {
                                        value: 'ADMIN' | 'USER'
                                      }) => setRole(v.value)}
                                      options={[
                                        {
                                          label: 'Organisation Administrator',
                                          value: 'ADMIN',
                                        },
                                        getPlanBasedOption(
                                          {
                                            label: 'User',
                                            value: 'USER',
                                          },
                                          'RBAC',
                                        ),
                                      ]}
                                      className='react-select select-sm'
                                    />
                                  </div>
                                  {inviteLinks?.find(
                                    (f) => f.role === role,
                                  ) && (
                                    <>
                                      <Flex className='mr-4'>
                                        <Input
                                          style={{
                                            width: 257,
                                          }}
                                          value={`${
                                            document.location.origin
                                          }/invite-link/${
                                            inviteLinks?.find(
                                              (f) => f.role === role,
                                            )?.hash
                                          }`}
                                          data-test='invite-link'
                                          inputClassName='input input--wide'
                                          type='text'
                                          readonly='readonly'
                                          title={<h3>Link</h3>}
                                          placeholder='Link'
                                          size='small'
                                        />
                                      </Flex>
                                      <Row>
                                        <Button
                                          theme='secondary'
                                          size='small'
                                          onClick={() => {
                                            Utils.copyToClipboard(
                                              `${
                                                document.location.origin
                                              }/invite/${
                                                inviteLinks?.find(
                                                  (f) => f.role === role,
                                                )?.hash
                                              }`,
                                              'Link copied',
                                            )
                                          }}
                                        >
                                          Copy Invite Link
                                        </Button>
                                        <Button
                                          className='ml-3'
                                          size='small'
                                          type='button'
                                          onClick={() => {
                                            openConfirm({
                                              body: 'This will generate a new invite link for the selected role, users will no longer be able to use the existing one. Are you sure?',
                                              onYes: () => {
                                                invalidateInviteLink(
                                                  inviteLinks.find(
                                                    (f) => f.role === role,
                                                  ),
                                                )
                                              },
                                              title: 'Regenerate Invite Link',
                                              yesText: 'Confirm',
                                            })
                                          }}
                                        >
                                          Regenerate
                                        </Button>
                                      </Row>
                                    </>
                                  )}
                                </Row>
                              </div>
                              <p className='my-4 col-md-8'>
                                Anyone with link can join as a standard user,
                                once they have joined you can edit their role
                                from the team members panel.{' '}
                                <Button
                                  theme='text'
                                  target='_blank'
                                  href='https://docs.flagsmith.com/advanced-use/permissions'
                                  className='fw-normal'
                                >
                                  Learn about User Roles.
                                </Button>
                              </p>
                              <div className='text-right mt-2'>
                                {error && <ErrorMessage error={error} />}
                              </div>
                            </form>
                          )}
                        <PanelSearch
                          id='org-members-list'
                          title='Members'
                          className='no-pad'
                          header={
                            <Row className='table-header'>
                              <Flex className='table-column px-3'>User</Flex>
                              <div
                                className='table-column'
                                style={{
                                  minWidth: widths[0],
                                }}
                              >
                                Role
                              </div>
                              <div
                                style={{
                                  width: widths[1],
                                }}
                                className='table-column'
                              >
                                Last logged in
                              </div>
                              <div
                                style={{
                                  width: widths[2],
                                }}
                                className='table-column text-center'
                              >
                                Actions
                              </div>
                            </Row>
                          }
                          items={users}
                          itemHeight={65}
                          renderRow={(user: User, i: number) => {
                            const {
                              email,
                              first_name,
                              id,
                              last_login,
                              last_name,
                              role,
                            } = user

                            const onRemoveClick = () => {
                              deleteUser(
                                id,
                                Format.userDisplayName({
                                  email,
                                  firstName: first_name,
                                  lastName: last_name,
                                }),
                              )
                            }
                            const onEditClick = () => {
                              editUserPermissions(user, organisation.id)
                            }
                            return (
                              <Row
                                data-test={`user-${i}`}
                                space
                                className={classNames('list-item clickable')}
                                onClick={onEditClick}
                                key={id}
                              >
                                <Flex className='table-column px-3 font-weight-medium'>
                                  {`${first_name} ${last_name}`}{' '}
                                  {id === AccountStore.getUserId() && '(You)'}
                                  <div className='list-item-subtitle mt-1'>
                                    {email}
                                  </div>
                                </Flex>

                                <div
                                  style={{
                                    width: widths[0],
                                  }}
                                  className='table-column'
                                >
                                  <div>
                                    {organisation.role === 'ADMIN' &&
                                    id !== AccountStore.getUserId() ? (
                                      <div>
                                        <Select
                                          data-test='select-role'
                                          placeholder='Select a role'
                                          value={
                                            role && {
                                              label: Constants.roles[role],
                                              value: role,
                                            }
                                          }
                                          onChange={(e: InputEvent) =>
                                            roleChanged(
                                              id,
                                              Utils.safeParseEventValue(e),
                                            )
                                          }
                                          options={map(
                                            Constants.roles,
                                            (label, value) =>
                                              value === 'ADMIN'
                                                ? {
                                                    label,
                                                    value,
                                                  }
                                                : getPlanBasedOption(
                                                    {
                                                      label,
                                                      value,
                                                    },
                                                    'RBAC',
                                                  ),
                                          )}
                                          menuPortalTarget={document.body}
                                          menuPosition='absolute'
                                          menuPlacement='auto'
                                          className='react-select select-xsm'
                                        />
                                      </div>
                                    ) : (
                                      <div className='px-3 fs-small lh-sm'>
                                        {Constants.roles[role] || ''}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: widths[1],
                                  }}
                                  className='table-column'
                                >
                                  <div className='fs-small lh-sm'>
                                    {formatLastLoggedIn(last_login)}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: widths[2],
                                  }}
                                  className='table-column d-flex justify-content-end'
                                >
                                  <UserAction
                                    onRemove={onRemoveClick}
                                    onEdit={onEditClick}
                                    canRemove={AccountStore.isAdmin()}
                                    canEdit={AccountStore.isAdmin()}
                                  />
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
                        <div id='select-portal' />
                      </FormGroup>

                      {invites && invites.length ? (
                        <FormGroup className='margin-top'>
                          <PanelSearch
                            itemHeight={70}
                            id='org-invites-list'
                            title='Invites Pending'
                            className='no-pad'
                            items={sortBy(invites, 'email')}
                            header={
                              <Row className='table-header'>
                                <Flex className='table-column px-3'>User</Flex>
                                <div
                                  style={{
                                    width: widths[0],
                                  }}
                                  className='table-column'
                                >
                                  Role
                                </div>
                                <div
                                  style={{
                                    width: widths[1],
                                  }}
                                  className='table-column'
                                >
                                  Action
                                </div>
                              </Row>
                            }
                            renderRow={(
                              {
                                date_created,
                                email,
                                id,
                                invited_by,
                                link,
                              }: Invite,
                              i: number,
                            ) => (
                              <Row
                                data-test={`pending-invite-${i}`}
                                className='list-item'
                                key={id}
                              >
                                <div className='flex flex-1 px-3'>
                                  {email || link}
                                  <div className='list-item-subtitle mt-1'>
                                    Created{' '}
                                    {moment(date_created).format('DD/MMM/YYYY')}
                                  </div>
                                  {invited_by ? (
                                    <div className='list-item-subtitle'>
                                      Invited by{' '}
                                      {invited_by.first_name
                                        ? `${invited_by.first_name} ${invited_by.last_name}`
                                        : invited_by.email}
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  style={{
                                    width: widths[0],
                                  }}
                                  className='table-column'
                                >
                                  {link ? (
                                    ' '
                                  ) : (
                                    <Button
                                      id='resend-invite'
                                      type='button'
                                      onClick={() =>
                                        AppActions.resendInvite(id)
                                      }
                                      theme='text'
                                      size='small'
                                    >
                                      Resend
                                    </Button>
                                  )}
                                </div>
                                <div
                                  className='table-column text-center'
                                  style={{
                                    width: widths[5],
                                  }}
                                >
                                  <Button
                                    id='delete-invite'
                                    type='button'
                                    onClick={() => deleteInvite(id)}
                                    className='btn btn-with-icon'
                                  >
                                    <Icon
                                      name='trash-2'
                                      width={20}
                                      fill='#656D7B'
                                    />
                                  </Button>
                                </div>
                              </Row>
                            )}
                            filterRow={(item: Invite, search: string) =>
                              item.email
                                .toLowerCase()
                                .indexOf(search.toLowerCase()) !== -1
                            }
                          />
                        </FormGroup>
                      ) : null}
                    </TabItem>
                    <TabItem tabLabel='Groups' data-test='tab-item-groups'>
                      <div>
                        <Row space className='mt-4 mb-1'>
                          <h5 className='mb-0'>User Groups</h5>
                          {Utils.renderWithPermission(
                            manageGroupsPermission.permission,
                            Constants.organisationPermissions(
                              'Manage User Groups',
                            ),
                            <Button
                              id='btn-invite-groups'
                              disabled={!manageGroupsPermission.permission}
                              onClick={() =>
                                openModal(
                                  'Create Group',
                                  <CreateGroup orgId={organisation.id} />,
                                  'side-modal',
                                )
                              }
                              type='button'
                              size='small'
                            >
                              Create Group
                            </Button>,
                          )}
                        </Row>
                        <p className='col-md-8 mb-4'>
                          Groups allow you to manage permissions for viewing and
                          editing projects, features and environments.
                        </p>
                        <UserGroupList
                          showRemove
                          onClick={editGroup}
                          orgId={`${organisation.id}`}
                        />
                      </div>
                    </TabItem>
                    <TabItem tabLabel='Roles' data-test='tab-item-roles'>
                      <PlanBasedBanner
                        feature='RBAC'
                        theme={'page'}
                        className='mt-4'
                      >
                        <RolesTable
                          organisationId={organisation.id}
                          users={users}
                        />
                      </PlanBasedBanner>
                    </TabItem>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormGroup>
    </div>
  )
}

const UsersAndPermissionsPage: FC<UsersAndPermissionsPageType> = ({
  router,
}) => {
  return (
    <AccountProvider>
      {({ organisation }: { organisation: Organisation | null }) => (
        <OrganisationProvider id={AccountStore.getOrganisation()?.id}>
          {({
            error,
            invalidateInviteLink,
            inviteLinks,
            invites,
            isLoading,
            subscriptionMeta,
            users,
          }) => {
            if (!organisation) {
              return (
                <div className='text-center'>
                  <Loader />
                </div>
              )
            }
            return (
              <UsersAndPermissionsInner
                router={router}
                organisation={organisation}
                error={error}
                invalidateInviteLink={invalidateInviteLink}
                inviteLinks={inviteLinks}
                invites={invites}
                isLoading={isLoading}
                users={users}
                subscriptionMeta={subscriptionMeta}
              />
            )
          }}
        </OrganisationProvider>
      )}
    </AccountProvider>
  )
}

export default ConfigProvider(UsersAndPermissionsPage)
