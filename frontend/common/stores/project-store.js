import { getIsWidget } from 'components/pages/WidgetPage'
import OrganisationStore from './organisation-store'

import Constants from 'common/constants'
import Utils from 'common/utils/utils'
import { getStore } from 'common/store'
import { projectService } from 'common/services/useProject'
import { environmentService } from 'common/services/useEnvironment'

const Dispatcher = require('../dispatcher/dispatcher')
const BaseStore = require('./base/_store')

const data = require('../data/base/_data')

const controller = {
  createEnv: ({
    cloneFeatureStatesAsync,
    cloneId,
    description,
    metadata,
    name,
    projectId,
  }) => {
    API.trackEvent(Constants.events.CREATE_ENVIRONMENT)
    store.saving()
    const req = cloneId
      ? data.post(`${Project.api}environments/${cloneId}/clone/`, {
          clone_feature_states_async: cloneFeatureStatesAsync,
          description,
          name,
        })
      : data.post(`${Project.api}environments/`, {
          description,
          name,
          project: projectId,
        })
    req
      .then((res) =>
        data
          .put(`${Project.api}environments/${res.api_key}/`, {
            description,
            metadata: metadata || [],
            name,
            project: projectId,
          })
          .then((res) =>
            data
              .post(
                `${Project.api}environments/${
                  res.api_key
                }/${Utils.getIdentitiesEndpoint()}/`,
                {
                  environment: res.api_key,
                  identifier: `${name.toLowerCase()}_user_123456`,
                },
              )
              .then(() => {
                store.savedEnv = res
                if (store.model && store.model.environments) {
                  store.model.environments = store.model.environments.concat([
                    res,
                  ])
                }
                store.saved()
                getStore().dispatch(
                  environmentService.util.invalidateTags(['Environment']),
                )
                AppActions.refreshOrganisation()
              }),
          ),
      )
      .catch((e) => {
        API.ajaxHandler(store, e)
      })
  },

  deleteEnv: (env) => {
    API.trackEvent(Constants.events.REMOVE_ENVIRONMENT)
    data.delete(`${Project.api}environments/${env.api_key}/`).then(() => {
      store.model.environments = _.filter(
        store.model.environments,
        (e) => e.id !== env.id,
      )
      getStore().dispatch(
        environmentService.util.invalidateTags(['Environment']),
      )
      store.trigger('removed', env)
      store.saved()
      AppActions.refreshOrganisation()
    })
  },

  editEnv: (env) => {
    API.trackEvent(Constants.events.EDIT_ENVIRONMENT)
    data
      .put(`${Project.api}environments/${env.api_key}/`, env)
      .then((res) => {
        const index = _.findIndex(store.model.environments, { id: env.id })
        store.model.environments[index] = res
        store.saved()
        getStore().dispatch(
          environmentService.util.invalidateTags(['Environment']),
        )
        AppActions.refreshOrganisation()
      })
      .catch((e) => {
        e.json()
          .then((result) => {
            if (result?.metadata?.[0]) {
              toast(result.metadata[0], 'danger')
            } else {
              toast('Error updating the environment', 'danger')
            }
          })
          .catch((e) => {
            API.ajaxHandler(store, e)
          })
      })
  },
  editProject: (project) => {
    store.saving()
    data.put(`${Project.api}projects/${project.id}/`, project).then((res) => {
      store.model = Object.assign(store.model, res)
      getStore().dispatch(projectService.util.invalidateTags(['Project']))
      AppActions.refreshOrganisation()
      store.saved()
    })
  },
  getProject: (id, cb, force) => {
    if (!id) {
      if (!getIsWidget()) {
        !force && AsyncStorage.removeItem('lastEnv')
        document.location.href = '/404'
      }
    } else if (force) {
      store.loading()

      return Promise.all([
        data.get(`${Project.api}projects/${id}/`),
        data.get(`${Project.api}environments/?project=${id}`).catch(() => []),
      ])
        .then(([project, environments]) => {
          project.max_segments_allowed = project.max_segments_allowed
          project.max_features_allowed = project.max_features_allowed
          project.max_segment_overrides_allowed =
            project.max_segment_overrides_allowed
          project.total_features = project.total_features || 0
          project.total_segments = project.total_segments || 0
          store.model = Object.assign(project, {
            environments: _.sortBy(environments.results, 'name'),
          })
          if (project.organisation !== OrganisationStore.id) {
            AppActions.selectOrganisation(project.organisation)
            AppActions.getOrganisation(project.organisation)
          }
          store.id = id
          store.loaded()
          if (cb) {
            cb()
          }
        })
        .catch(() => {
          if (!getIsWidget()) {
            document.location.href = '/404?entity=project'
          }
        })
    } else if (!store.model || !store.model.environments || store.id !== id) {
      store.loading()

      Promise.all([
        data.get(`${Project.api}projects/${id}/`),
        data.get(`${Project.api}environments/?project=${id}`).catch(() => []),
      ])
        .then(([project, environments]) => {
          project.max_segments_allowed = project.max_segments_allowed
          project.max_features_allowed = project.max_features_allowed
          project.max_segment_overrides_allowed =
            project.max_segment_overrides_allowed
          project.total_features = project.total_features || 0
          project.total_segments = project.total_segments || 0
          store.model = Object.assign(project, {
            environments: _.sortBy(environments.results, 'name'),
          })
          if (project.organisation !== OrganisationStore.id) {
            AppActions.selectOrganisation(project.organisation)
            AppActions.getOrganisation(project.organisation)
          }
          store.id = id
          store.loaded()
          if (cb) {
            cb()
          }
        })
        .catch(() => {
          if (!getIsWidget()) {
            AsyncStorage.removeItem('lastEnv')
            document.location.href = '/404?entity=project'
          }
        })
    }
  },
  migrateProject: (id) => {
    store.loading()
    data.post(`${Project.api}projects/${id}/migrate-to-edge/`).then(() => {
      controller.getProject(id, () => store.saved(), true)
    })
  },
}

const store = Object.assign({}, BaseStore, {
  getEnvironment: (api_key) =>
    store.model && _.find(store.model.environments, { api_key }),
  getEnvironmentById: (id) =>
    store.model && _.find(store.model.environments, { id }),
  getEnvironmentIdFromKey: (api_key) => {
    const env = _.find(store.model.environments, { api_key })
    return env && env.id
  },
  getEnvironmentIdFromKeyAsync: async (projectId, apiKey) => {
    if (store.model && `${store.model.id}` === `${projectId}`) {
      return await Promise.resolve(store.getEnvironmentIdFromKey(apiKey))
    }
    return await controller.getProject(projectId, null, true).then(() => {
      return Promise.resolve(store.getEnvironmentIdFromKey(apiKey))
    })
  },
  getEnvs: () => store.model && store.model.environments,
  getIsVersioned: (api_key) => {
    const env = _.find(store.model.environments, { api_key })
    return env && env.use_v2_feature_versioning
  },
  getMaxFeaturesAllowed: () => {
    return store.model && store.model.max_features_allowed
  },
  getMaxSegmentOverridesAllowed: () => {
    return store.model && store.model.max_segment_overrides_allowed
  },
  getMaxSegmentsAllowed: () => {
    return store.model && store.model.max_segments_allowed
  },
  getStaleFlagsLimit: () => {
    return store.model && store.model.stale_flags_limit_days
  },
  getTotalFeatures: () => {
    return store.model && store.model.total_features
  },
  getTotalSegmentOverrides: () => {
    return store.model && store.model.environment.total_segment_overrides
  },
  getTotalSegments: () => {
    return store.model && store.model.total_segments
  },
  id: 'project',
  model: null,
})

store.dispatcherIndex = Dispatcher.register(store, (payload) => {
  const action = payload.action // this is our action from handleViewAction

  switch (action.actionType) {
    case Actions.MIGRATE_PROJECT:
      controller.migrateProject(action.projectId)
      break
    case Actions.GET_PROJECT:
      controller.getProject(action.projectId)
      break
    case Actions.CREATE_ENV:
      controller.createEnv(action)
      break
    case Actions.EDIT_ENVIRONMENT:
      controller.editEnv(action.env)
      break
    case Actions.DELETE_ENVIRONMENT:
      controller.deleteEnv(action.env)
      break
    case Actions.EDIT_PROJECT:
      controller.editProject(action.id, action.project)
      break
    case Actions.LOGOUT:
      store.model = null
      break
    default:
  }
})
controller.store = store
export default controller.store
