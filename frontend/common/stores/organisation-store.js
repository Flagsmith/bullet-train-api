import Constants from 'common/constants'

const Dispatcher = require('../dispatcher/dispatcher')
const BaseStore = require('./base/_store')
const data = require('../data/base/_data')
const _ = require('lodash')

const controller = {
  createProject: (name) => {
    store.saving()
    const createSampleUser = (res, envName, project) =>
      data
        .post(
          `${Project.api}environments/${
            res.api_key
          }/${Utils.getIdentitiesEndpoint(project)}/`,
          {
            environment: res.id,
            identifier: `${envName}_user_123456`,
          },
        )
        .then(() => res)
    if (
      AccountStore.model.organisations.length === 1 &&
      (!store.model.projects || !store.model.projects.length)
    ) {
      API.trackEvent(Constants.events.CREATE_FIRST_PROJECT)
    }
    API.trackEvent(Constants.events.CREATE_PROJECT)
    data
      .post(`${Project.api}projects/`, { name, organisation: store.id })
      .then((project) => {
        Promise.all([
          data
            .post(`${Project.api}environments/`, {
              name: 'Development',
              project: project.id,
            })
            .then((res) => createSampleUser(res, 'development', project)),
          data
            .post(`${Project.api}environments/`, {
              name: 'Production',
              project: project.id,
            })
            .then((res) => createSampleUser(res, 'production', project)),
        ]).then((res) => {
          project.environments = res
          store.model.projects = store.model.projects.concat(project)
          store.savedId = {
            environmentId: res[0].api_key,
            projectId: project.id,
          }
          store.saved()
        })
      })
  },
  deleteInvite: (id) => {
    store.saving()
    data
      .delete(`${Project.api}organisations/${store.id}/invites/${id}/`)
      .then(() => {
        API.trackEvent(Constants.events.DELETE_INVITE)
        if (store.model) {
          store.model.invites = _.filter(
            store.model.invites,
            (i) => i.id !== id,
          )
        }
        store.saved()
      })
      .catch((e) => API.ajaxHandler(store, e))
  },

  deleteProject: (id) => {
    store.saving()
    if (store.model) {
      store.model.projects = _.filter(store.model.projects, (p) => p.id !== id)
      store.model.keyedProjects = _.keyBy(store.model.projects, 'id')
    }
    API.trackEvent(Constants.events.REMOVE_PROJECT)
    data.delete(`${Project.api}projects/${id}/`).then(() => {
      store.trigger('removed')
    })
  },
  deleteUser: (id) => {
    store.saving()
    data
      .post(`${Project.api}organisations/${store.id}/remove-users/`, [{ id }])
      .then(() => {
        API.trackEvent(Constants.events.DELETE_USER)
        if (store.model) {
          store.model.users = _.filter(store.model.users, (u) => u.id !== id)
        }
        store.saved()
      })
      .catch((e) => API.ajaxHandler(store, e))
  },
  editOrganisation: (name) => {
    store.saving()
    data
      .put(`${Project.api}organisations/${store.id}/`, { name })
      .then((res) => {
        const idx = _.findIndex(store.model.organisations, {
          id: store.organisation.id,
        })
        if (idx !== -1) {
          store.model.organisations[idx] = res
          store.organisation = res
        }
        store.saved()
      })
  },
  getOrganisation: (id, force) => {
    if (id !== store.id || force) {
      store.id = id
      store.loading()

      Promise.all(
        [
          data.get(`${Project.api}projects/?organisation=${id}`),
          data.get(`${Project.api}organisations/${id}/users/`),
        ].concat(
          AccountStore.getOrganisationRole(id) === 'ADMIN'
            ? [
                data.get(`${Project.api}organisations/${id}/invites/`),
                data
                  .get(
                    `${Project.api}organisations/${id}/get-subscription-metadata/`,
                  )
                  .catch(() => null),
              ]
            : [],
        ),
      ).then((res) => {
        if (id === store.id) {
          // eslint-disable-next-line prefer-const
          let [_projects, users, invites, subscriptionMeta] = res
          let projects = _.sortBy(_projects, 'name')

          store.model = {
            ...store.model,
            invites: invites && invites.results,
            subscriptionMeta,
            users,
          }

          if (Project.hideInviteLinks) {
            store.loaded()
          } else {
            data
              .get(`${Project.api}organisations/${id}/invite-links/`)
              .then((links) => {
                store.model.inviteLinks = links
                if (!links || !links.length) {
                  Promise.all([
                    data.post(
                      `${Project.api}organisations/${id}/invite-links/`,
                      {
                        role: 'ADMIN',
                      },
                    ),
                    data.post(
                      `${Project.api}organisations/${id}/invite-links/`,
                      {
                        role: 'USER',
                      },
                    ),
                  ]).then(() => {
                    data
                      .get(`${Project.api}organisations/${id}/invite-links/`)
                      .then((links) => {
                        store.model.inviteLinks = links

                        store.loaded()
                      })
                  })
                } else {
                  store.loaded()
                }
              })
              .catch((e) => {
                API.ajaxHandler(store, e)
              })
          }

          return Promise.all(
            projects.map((project, i) =>
              data
                .get(`${Project.api}environments/?project=${project.id}`)
                .then((res) => {
                  projects[i].environments = _.sortBy(res.results, 'name')
                })
                .catch(() => {
                  projects[i].environments = []
                }),
            ),
          ).then(() => {
            projects.sort((a, b) => {
              const textA = a.name.toLowerCase()
              const textB = b.name.toLowerCase()
              return textA < textB ? -1 : textA > textB ? 1 : 0
            })
            store.model.projects = projects
            store.model.keyedProjects = _.keyBy(store.model.projects, 'id')
            store.loaded()
          })
        }
      })
    }
  },
  invalidateInviteLink: (link) => {
    const id = AccountStore.getOrganisation().id
    data
      .delete(`${Project.api}organisations/${id}/invite-links/${link.id}/`)
      .then(() =>
        data.post(`${Project.api}organisations/${id}/invite-links/`, {
          role: 'ADMIN',
        }),
      )
      .then(() =>
        data
          .get(`${Project.api}organisations/${id}/invite-links/`)
          .then((links) => {
            store.model.inviteLinks = links
            store.loaded()
          }),
      )
  },
  inviteUsers: (invites) => {
    store.saving()
    data
      .post(`${Project.api}organisations/${store.id}/invite/`, {
        frontend_base_url: `${document.location.origin}/email-invite/`,
        invites: invites.map((invite) => {
          API.trackEvent(Constants.events.INVITE)
          return {
            email: invite.emailAddress,
            role: invite.role.value,
          }
        }),
      })
      .then((res) => {
        store.model.invites = store.model.invites || []
        store.model.invites = store.model.invites.concat(res)
        store.saved()
        toast('Invite(s) sent successfully')
      })
      .catch((e) => {
        store.saved()
        toast(
          `Failed to send invite(s). ${
            e && e.error ? e.error : 'Please try again later'
          }`,
        )
      })
  },
  resendInvite: (id) => {
    data
      .post(`${Project.api}organisations/${store.id}/invites/${id}/resend/`)
      .then(() => {
        API.trackEvent(Constants.events.RESEND_INVITE)
        toast('Invite resent successfully')
      })
      .catch((e) => {
        toast(
          `Failed to resend invite. ${
            e && e.error ? e.error : 'Please try again later'
          }`,
        )
      })
  },
  updateUserRole: (id, role) => {
    data
      .post(
        `${Project.api}organisations/${store.id}/users/${id}/update-role/`,
        { role },
      )
      .then(() => {
        API.trackEvent(Constants.events.UPDATE_USER_ROLE)
        const index = _.findIndex(store.model.users, (user) => user.id === id)
        if (index !== -1) {
          store.model.users[index].role = role
          store.saved()
        }
      })
      .catch((e) => {
        toast(
          `Failed to update this user's role. ${
            e && e.error ? e.error : 'Please try again later'
          }`,
        )
      })
  },
}

const store = Object.assign({}, BaseStore, {
  getInviteLinks() {
    return store.model && store.model.inviteLinks
  },
  getInvites: () => store.model && store.model.invites,
  getProject(id) {
    return (
      store.model && store.model.keyedProjects && store.model.keyedProjects[id]
    )
  },
  getProjects() {
    return store.model && store.model.projects
  },

  getSubscriptionMeta() {
    return store.model && store.model.subscriptionMeta
  },
  getUsers: () => store.model && store.model.users,
  id: 'account',
})

store.dispatcherIndex = Dispatcher.register(store, (payload) => {
  const action = payload.action // this is our action from handleViewAction

  switch (action.actionType) {
    case Actions.GET_ORGANISATION:
      controller.getOrganisation(action.id || store.id, action.force)
      break
    case Actions.CREATE_PROJECT:
      controller.createProject(action.name)
      break
    case Actions.DELETE_PROJECT:
      controller.deleteProject(action.id)
      break
    case Actions.INVITE_USERS:
      controller.inviteUsers(action.invites)
      break
    case Actions.DELETE_INVITE:
      controller.deleteInvite(action.id)
      break
    case Actions.DELETE_USER:
      controller.deleteUser(action.id)
      break
    case Actions.RESEND_INVITE:
      controller.resendInvite(action.id)
      break
    case Actions.UPDATE_USER_ROLE:
      controller.updateUserRole(action.id, action.role)
      break
    case Actions.INVALIDATE_INVITE_LINK:
      controller.invalidateInviteLink(action.link)
      break
    case Actions.LOGOUT:
      store.id = null
      break
    default:
  }
})
controller.store = store
module.exports = controller.store
