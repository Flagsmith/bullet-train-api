import React from 'react'
import UserGroupsStore from 'common/stores/user-group-store'

const UserGroupProvider = class extends React.Component {
  static displayName = 'UserGroupProvider'

  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoading: !UserGroupsStore.model,
      userGroups: UserGroupsStore.model,
      userGroupsPaging: UserGroupsStore.paging,
    }
    ES6Component(this)
  }

  componentDidMount() {
    this.listenTo(UserGroupsStore, 'change', () => {
      this.setState({
        isLoading: UserGroupsStore.isLoading,
        isSaving: UserGroupsStore.isSaving,
        userGroups: UserGroupsStore.model,
        userGroupsPaging: UserGroupsStore.paging,
      })
    })

    this.listenTo(UserGroupsStore, 'saved', () => {
      this.props.onSave && this.props.onSave()
    })
  }

  render() {
    return this.props.children({ ...this.state })
  }
}

UserGroupProvider.propTypes = {
  children: OptionalFunc,
  onSave: OptionalFunc,
}

module.exports = UserGroupProvider
