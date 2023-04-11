import React, { Component } from 'react'
import UserGroupsProvider from 'common/providers/UserGroupsProvider'
import ConfigProvider from 'common/providers/ConfigProvider'
import Switch from 'components/Switch'
import { getGroup } from 'common/services/useGroup'
import { getStore } from 'common/store'
import { components } from 'react-select'

const widths = [80, 80]
const CreateGroup = class extends Component {
  static displayName = 'CreateGroup'

  static contextTypes = {
    router: propTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoading: !!this.props.group,
    }
    if (this.props.group) {
      this.loadGroup()
    }
  }

  loadGroup = () => {
    getGroup(
      getStore(),
      {
        id: this.props.group.id,
        orgId: this.props.orgId,
      },
      { forceRefetch: true },
    ).then((res) => {
      const group = res.data
      this.setState({
        existingUsers: group
          ? group.users.map((v) => ({
              group_admin: v.group_admin,
              id: v.id,
            }))
          : [],
        external_id: group ? group.external_id : undefined,
        isLoading: false,
        is_default: group ? group.is_default : false,
        name: group ? group.name : '',
        users: group
          ? group.users.map((v) => ({
              group_admin: v.group_admin,
              id: v.id,
            }))
          : [],
      })
    })
  }

  close() {
    closeModal()
  }

  componentDidMount = () => {
    if (!this.props.isEdit && !E2E) {
      this.focusTimeout = setTimeout(() => {
        this.input.focus()
        this.focusTimeout = null
      }, 500)
    }
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout)
    }
  }

  getUsersToRemove = (users) =>
    _.filter(users, ({ id }) => !_.find(this.state.users, { id }))

  getUsersAdminChanged = (existingUsers, value) => {
    return _.filter(this.state.users, (user) => {
      if (!!user.group_admin !== value) {
        //Ignore user
        return false
      }
      const existingUser = _.find(
        existingUsers,
        (existingUser) => existingUser.id === user.id,
      )
      const isAlreadyAdmin = !!existingUser?.group_admin

      return isAlreadyAdmin !== value
    })
  }

  save = () => {
    const { external_id, is_default, name, users } = this.state

    const data = {
      external_id,
      is_default: !!this.state.is_default,
      name,
      users,
      usersToAddAdmin: this.getUsersAdminChanged(
        this.state.existingUsers,
        true,
      ),
    }
    if (this.props.group) {
      AppActions.updateGroup(this.props.orgId, {
        ...data,
        id: this.props.group.id,
        usersToRemove: this.getUsersToRemove(this.state.existingUsers),
        usersToRemoveAdmin: this.getUsersAdminChanged(
          this.state.existingUsers,
          false,
        ),
      })
    } else {
      AppActions.createGroup(this.props.orgId, data)
    }
  }

  toggleUser = (id, group_admin, update) => {
    const isMember = _.find(this.state.users, { id })
    const users = _.filter(this.state.users, (u) => u.id !== id)
    this.setState({
      users: isMember && !update ? users : users.concat([{ group_admin, id }]),
    })
  }

  render() {
    const { external_id, isLoading, name } = this.state
    const isEdit = !!this.props.group
    const isAdmin = AccountStore.isAdmin()
    const yourEmail = AccountStore.model.email
    return (
      <OrganisationProvider>
        {({ users }) => {
          const activeUsers = _.intersectionBy(users, this.state.users, 'id')
          const inactiveUsers = _.differenceBy(users, this.state.users, 'id')
          return isLoading ? (
            <div className='text-center'>
              <Loader />
            </div>
          ) : (
            <UserGroupsProvider onSave={this.close}>
              {({ isSaving }) => (
                <form
                  onSubmit={(e) => {
                    Utils.preventDefault(e)
                    this.save()
                  }}
                >
                  <InputGroup
                    title='Group name*'
                    ref={(e) => (this.input = e)}
                    data-test='groupName'
                    inputProps={{
                      className: 'full-width',
                      name: 'groupName',
                    }}
                    value={name}
                    onChange={(e) =>
                      this.setState({ name: Utils.safeParseEventValue(e) })
                    }
                    isValid={name && name.length}
                    type='text'
                    name='Name*'
                    placeholder='E.g. Developers'
                  />
                  <InputGroup
                    title='External ID'
                    ref={(e) => (this.input = e)}
                    data-test='groupName'
                    inputProps={{
                      className: 'full-width',
                      name: 'groupName',
                    }}
                    value={external_id}
                    onChange={(e) =>
                      this.setState({
                        external_id: Utils.safeParseEventValue(e),
                      })
                    }
                    isValid={name && name.length}
                    type='text'
                    name='Name*'
                    placeholder='Add an optional external reference ID'
                  />

                  <InputGroup
                    title='Add new users by default'
                    tooltipPlace='top'
                    tooltip='New users that sign up to your organisation will be automatically added to this group with USER permissions'
                    ref={(e) => (this.input = e)}
                    data-test='groupName'
                    component={
                      <Switch
                        onChange={(e) =>
                          this.setState({
                            is_default: Utils.safeParseEventValue(e),
                          })
                        }
                        checked={!!this.state.is_default}
                      />
                    }
                    inputProps={{
                      className: 'full-width',
                      name: 'groupName',
                    }}
                    value={name}
                    isValid={name && name.length}
                    type='text'
                  />
                  <div className='mb-4'>
                    <label>Group members</label>
                    <div style={{ width: 350 }}>
                      <Select
                        disabled={!inactiveUsers?.length}
                        components={{
                          Option: (props) => {
                            const { email, first_name, id, last_name } =
                              props.data.user || {}
                            return (
                              <components.Option {...props}>
                                {`${first_name} ${last_name}`}{' '}
                                {id == AccountStore.getUserId() && '(You)'}
                                <div className='list-item-footer faint'>
                                  {email}
                                </div>
                              </components.Option>
                            )
                          },
                        }}
                        value={{ label: 'Add a user' }}
                        onChange={(v) => this.toggleUser(v.value)}
                        options={inactiveUsers.map((user) => ({
                          label: `${user.first_name || ''} ${
                            user.last_name || ''
                          } ${user.email} ${user.id}`,
                          user,
                          value: user.id,
                        }))}
                      />
                    </div>

                    <PanelSearch
                      noResultsText={(search) =>
                        search ? (
                          <>
                            No results found for <strong>{search}</strong>
                          </>
                        ) : (
                          'This group has no members'
                        )
                      }
                      id='org-members-list'
                      title='Members'
                      className='mt-4 no-pad overflow-visible'
                      renderSearchWithNoResults
                      items={_.sortBy(activeUsers, 'first_name')}
                      filterRow={(item, search) => {
                        const strToSearch = `${item.first_name} ${item.last_name} ${item.email} ${item.id}`
                        return (
                          strToSearch
                            .toLowerCase()
                            .indexOf(search.toLowerCase()) !== -1
                        )
                      }}
                      header={
                        <>
                          <Row className='table-header'>
                            <Flex>User</Flex>
                            {Utils.getFlagsmithHasFeature('group_admins') && (
                              <div style={{ paddingLeft: 5, width: widths[0] }}>
                                Admin
                              </div>
                            )}
                            <div
                              className='text-right'
                              style={{ width: widths[1] }}
                            >
                              Remove
                            </div>
                          </Row>
                        </>
                      }
                      renderRow={({ email, first_name, id, last_name }) => {
                        const matchingUser = this.state.users.find(
                          (v) => v.id === id,
                        )
                        const isGroupAdmin = matchingUser?.group_admin
                        return (
                          <Row className='list-item' key={id}>
                            <Flex>
                              {`${first_name} ${last_name}`}{' '}
                              {id == AccountStore.getUserId() && '(You)'}
                              <div className='list-item-footer faint'>
                                {email}
                              </div>
                            </Flex>
                            {Utils.getFlagsmithHasFeature('group_admins') && (
                              <div style={{ width: widths[0] }}>
                                <Switch
                                  onChange={(e) => {
                                    this.toggleUser(id, e, true)
                                  }}
                                  checked={isGroupAdmin}
                                />
                              </div>
                            )}
                            <div
                              className='text-right'
                              style={{ width: widths[1] }}
                            >
                              <button
                                type='button'
                                disabled={!(isAdmin || email !== yourEmail)}
                                id='remove-feature'
                                onClick={() => this.toggleUser(id)}
                                className='btn btn--with-icon'
                              >
                                <RemoveIcon />
                              </button>
                            </div>
                          </Row>
                        )
                      }}
                    />
                  </div>
                  <div className='text-right'>
                    {isEdit ? (
                      <Button
                        data-test='update-feature-btn'
                        id='update-feature-btn'
                        disabled={isSaving || !name}
                      >
                        {isSaving ? 'Updating' : 'Update Group'}
                      </Button>
                    ) : (
                      <Button
                        data-test='create-feature-btn'
                        id='create-feature-btn'
                        disabled={isSaving || !name}
                      >
                        {isSaving ? 'Creating' : 'Create Group'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </UserGroupsProvider>
          )
        }}
      </OrganisationProvider>
    )
  }
}

CreateGroup.propTypes = {}

module.exports = ConfigProvider(CreateGroup)
