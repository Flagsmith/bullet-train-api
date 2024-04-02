import { Component } from 'react'
import OrganisationStore from 'common/stores/organisation-store'
import AccountStore from 'common/stores/account-store'

const OrganisationProvider = class extends Component {
  static displayName = 'OrganisationProvider'

  constructor(props, context) {
    super(props, context)
    this.state = {
      invites: OrganisationStore.getInvites(),
      isLoading: OrganisationStore.isLoading,
      name:
        AccountStore.getOrganisation() && AccountStore.getOrganisation().name,
      project: OrganisationStore.getProject(),
      projects: OrganisationStore.getProjects(),
      subscriptionMeta: OrganisationStore.getSubscriptionMeta(),
      users: OrganisationStore.getUsers(),
    }
    ES6Component(this)
    if (props.onRemoveProject) {
      this.listenTo(OrganisationStore, 'removed', props.onRemoveProject)
    }

    this.listenTo(OrganisationStore, 'change', () => {
      this.setState({
        inviteLinks: OrganisationStore.getInviteLinks(),
        invites: OrganisationStore.getInvites(),
        isLoading: OrganisationStore.isLoading,
        isSaving: OrganisationStore.isSaving,
        project: OrganisationStore.getProject(),
        projects: OrganisationStore.getProjects(this.props.id),
        subscriptionMeta: OrganisationStore.getSubscriptionMeta(),
        users: OrganisationStore.getUsers(),
      })
    })
    this.listenTo(OrganisationStore, 'saved', () => {
      this.props.onSave && this.props.onSave(OrganisationStore.savedId)
    })
  }

  createProject = (name) => {
    AppActions.createProject(name)
  }

  selectProject = (id) => {
    AppActions.getProject(id)
  }

  render() {
    return this.props.children({
      ...{
        inviteLinks: OrganisationStore.getInviteLinks(),
        invites: OrganisationStore.getInvites(),
        isLoading: OrganisationStore.isLoading,
        isSaving: OrganisationStore.isSaving,
        project: OrganisationStore.getProject(),
        projects: OrganisationStore.getProjects(this.props.id),
        subscriptionMeta: OrganisationStore.getSubscriptionMeta(),
        users: OrganisationStore.getUsers(),
      },
      createProject: this.createProject,
      invalidateInviteLink: AppActions.invalidateInviteLink,
      selectProject: this.selectProject,
    })
  }
}

OrganisationProvider.propTypes = {
  children: OptionalFunc,
  id: OptionalString,
  onSave: OptionalFunc,
}

export default OrganisationProvider
