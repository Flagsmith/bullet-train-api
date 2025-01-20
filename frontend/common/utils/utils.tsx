import AccountStore from 'common/stores/account-store'
import ProjectStore from 'common/stores/project-store'
import Project from 'common/project'
import {
  ChangeSet,
  ContentType,
  FeatureState,
  FeatureStateValue,
  FlagsmithValue,
  MultivariateFeatureStateValue,
  MultivariateOption,
  Organisation,
  Project as ProjectType,
  ProjectFlag,
  SegmentCondition,
  Tag,
} from 'common/types/responses'
import flagsmith from 'flagsmith'
import { ReactNode } from 'react'
import _ from 'lodash'
import ErrorMessage from 'components/ErrorMessage'
import WarningMessage from 'components/WarningMessage'
import Constants from 'common/constants'
import Format from './format'
import { defaultFlags } from 'common/stores/default-flags'
import Color from 'color'

const semver = require('semver')

export type PaidFeature =
  | 'FLAG_OWNERS'
  | 'RBAC'
  | 'AUDIT'
  | 'FORCE_2FA'
  | '4_EYES'
  | 'STALE_FLAGS'
  | 'VERSIONING_DAYS'
  | 'AUDIT_DAYS'
  | 'AUTO_SEATS'
  | 'METADATA'
  | 'REALTIME'
  | 'SAML'
  | 'SCHEDULE_FLAGS'
  | 'CREATE_ADDITIONAL_PROJECT'
  | '2FA'

// Define a type for plan categories
type Plan = 'start-up' | 'scale-up' | 'enterprise' | null

export const planNames = {
  enterprise: 'Enterprise',
  free: 'Free',
  scaleUp: 'Scale-Up',
  startup: 'Startup',
}
const Utils = Object.assign({}, require('./base/_utils'), {
  appendImage: (src: string) => {
    const img = document.createElement('img')
    img.src = src
    document.body.appendChild(img)
  },

  calculateControl(
    multivariateOptions: MultivariateOption[],
    variations?: MultivariateFeatureStateValue[],
  ) {
    if (!multivariateOptions || !multivariateOptions.length) {
      return 100
    }
    let total = 0
    multivariateOptions.map((v) => {
      const variation =
        variations &&
        variations.find((env) => env.multivariate_feature_option === v.id)
      total += variation
        ? variation.percentage_allocation
        : typeof v.default_percentage_allocation === 'number'
        ? v.default_percentage_allocation
        : (v as any).percentage_allocation
      return null
    })
    return 100 - total
  },

  calculateRemainingLimitsPercentage(
    total: number | undefined,
    max: number | undefined,
    threshold = 90,
  ) {
    if (total === 0) {
      return 0
    }
    const percentage = (total / max) * 100
    if (percentage >= threshold) {
      return {
        percentage: Math.floor(percentage),
      }
    }
    return 0
  },

  canCreateOrganisation() {
    return (
      !Utils.getFlagsmithHasFeature('disable_create_org') &&
      (!Project.superUserCreateOnly ||
        (Project.superUserCreateOnly && AccountStore.isSuper()))
    )
  },

  changeRequestsEnabled(value: number | null | undefined) {
    return typeof value === 'number'
  },

  colour(
    c: string,
    fallback = Constants.defaultTagColor,
  ): InstanceType<typeof Color> {
    let res: Color
    try {
      res = Color(c)
    } catch (_) {
      res = Color(fallback)
    }
    return res
  },

  copyFeatureName: (featureName: string) => {
    navigator.clipboard.writeText(featureName)
    toast('Copied to clipboard')
  },
  displayLimitAlert(type: string, percentage: number | undefined) {
    const envOrProject =
      type === 'segment overrides' ? 'environment' : 'project'
    return percentage >= 100 ? (
      <ErrorMessage
        error={`Your ${envOrProject} reached the limit of ${type}, please contact support to discuss increasing this limit.`}
      />
    ) : percentage ? (
      <WarningMessage
        warningMessage={`Your ${envOrProject} is  using ${percentage}% of the total allowance of ${type}.`}
      />
    ) : null
  },
  escapeHtml(html: string) {
    const text = document.createTextNode(html)
    const p = document.createElement('p')
    p.appendChild(text)
    return p.innerHTML
  },
  featureStateToValue(featureState: FeatureStateValue) {
    if (!featureState) {
      return null
    }

    //@ts-ignore value_type is the type key on core traits
    switch (featureState.value_type || featureState.type) {
      case 'bool':
        return featureState.boolean_value
      case 'float':
        return featureState.float_value
      case 'int':
        return featureState.integer_value
      default:
        return featureState.string_value
    }
  },
  findOperator(
    operator: SegmentCondition['operator'],
    value: string,
    conditions: SegmentCondition[],
  ) {
    const findAppended = `${value}`.includes(':')
      ? (conditions || []).find((v) => {
          const split = value.split(':')
          const targetKey = `:${split[split.length - 1]}`
          return v.value === operator + targetKey
        })
      : false
    if (findAppended) return findAppended

    return conditions.find((v) => v.value === operator)
  },
  /** Checks whether the specified flag exists, which is different from the flag being enabled or not. This is used to
   *  only add behaviour to Flagsmith-on-Flagsmith flags that have been explicitly created by customers.
   */
  flagsmithFeatureExists(flag: string) {
    return Object.prototype.hasOwnProperty.call(flagsmith.getAllFlags(), flag)
  },
  getApproveChangeRequestPermission() {
    return 'APPROVE_CHANGE_REQUEST'
  },
  getContentType(contentTypes: ContentType[], model: string, type: string) {
    return contentTypes.find((c: ContentType) => c[model] === type) || null
  },
  getCreateProjectPermission(organisation: Organisation) {
    if (organisation?.restrict_project_create_to_admin) {
      return 'ADMIN'
    }
    return 'CREATE_PROJECT'
  },
  getCreateProjectPermissionDescription(organisation: Organisation) {
    if (organisation?.restrict_project_create_to_admin) {
      return 'Administrator'
    }
    return 'Create Project'
  },
  getFeatureStatesEndpoint(_project: ProjectType) {
    const project = _project || ProjectStore.model
    if (project && project.use_edge_identities) {
      return 'edge-featurestates'
    }
    return 'featurestates'
  },
  getFlagValue(
    projectFlag: ProjectFlag,
    environmentFlag: FeatureState,
    identityFlag: FeatureState,
    multivariate_options: MultivariateFeatureStateValue[],
  ) {
    if (!environmentFlag) {
      return {
        description: projectFlag.description,
        enabled: false,
        feature_state_value: projectFlag.initial_value,
        is_archived: projectFlag.is_archived,
        is_server_key_only: projectFlag.is_server_key_only,
        multivariate_options: projectFlag.multivariate_options,
        name: projectFlag.name,
        tags: projectFlag.tags,
        type: projectFlag.type,
      }
    }
    if (identityFlag) {
      return {
        description: projectFlag.description,
        enabled: identityFlag.enabled,
        feature_state_value: identityFlag.feature_state_value,
        is_archived: projectFlag.is_archived,
        is_server_key_only: projectFlag.is_server_key_only,
        multivariate_options: projectFlag.multivariate_options,
        name: projectFlag.name,
        type: projectFlag.type,
      }
    }
    return {
      description: projectFlag.description,
      enabled: environmentFlag.enabled,
      feature_state_value: environmentFlag.feature_state_value,
      is_archived: projectFlag.is_archived,
      is_server_key_only: projectFlag.is_server_key_only,
      multivariate_options: projectFlag.multivariate_options.map((v) => {
        const matching =
          multivariate_options &&
          multivariate_options.find(
            (m) => v.id === m.multivariate_feature_option,
          )
        return {
          ...v,
          default_percentage_allocation: matching
            ? matching.percentage_allocation
            : v.default_percentage_allocation,
        }
      }),
      name: projectFlag.name,
      tags: projectFlag.tags,
      type: projectFlag.type,
    }
  },
  getFlagsmithHasFeature(key: string) {
    return flagsmith.hasFeature(key)
  },
  getFlagsmithJSONValue(key: string, defaultValue: any) {
    return flagsmith.getValue(key, { fallback: defaultValue, json: true })
  },
  getFlagsmithValue(key: string) {
    return flagsmith.getValue(key)
  },
  getIdentitiesEndpoint(_project: ProjectType) {
    const project = _project || ProjectStore.model
    if (project && project.use_edge_identities) {
      return 'edge-identities'
    }
    return 'identities'
  },

  getIntegrationData() {
    return Utils.getFlagsmithJSONValue(
      'integration_data',
      defaultFlags.integration_data,
    )
  },

  getIsEdge() {
    const model = ProjectStore.model as null | ProjectType

    if (ProjectStore.model && model?.use_edge_identities) {
      return true
    }
    return false
  },
  getManageFeaturePermission(isChangeRequest: boolean) {
    if (isChangeRequest) {
      return 'CREATE_CHANGE_REQUEST'
    }
    return 'UPDATE_FEATURE_STATE'
  },
  getManageFeaturePermissionDescription(isChangeRequest: boolean) {
    if (isChangeRequest) {
      return 'Create Change Request'
    }
    return 'Update Feature State'
  },
  getManageUserPermission() {
    return 'MANAGE_IDENTITIES'
  },
  getManageUserPermissionDescription() {
    return 'Manage Identities'
  },
  getNextPlan: (skipFree?: boolean) => {
    const currentPlan = Utils.getPlanName(AccountStore.getActiveOrgPlan())
    if (currentPlan !== planNames.enterprise && !Utils.isSaas()) {
      return planNames.enterprise
    }
    switch (currentPlan) {
      case planNames.free: {
        return skipFree ? planNames.startup : planNames.scaleUp
      }
      case planNames.startup: {
        return planNames.startup
      }
      default: {
        return planNames.enterprise
      }
    }
  },
  getOrganisationHomePage(id?: string) {
    const orgId = id || AccountStore.getOrganisation()?.id
    if (!orgId) {
      return `/organisations`
    }
    return `/organisation/${orgId}/projects`
  },

  getPlanName: (plan: string) => {
    if (plan && plan.includes('free')) {
      return planNames.free
    }
    if (plan && plan.includes('scale-up')) {
      return planNames.scaleUp
    }
    if (plan && plan.includes('startup')) {
      return planNames.startup
    }
    if (plan && plan.includes('start-up')) {
      return planNames.startup
    }
    if (Utils.isEnterpriseImage() || (plan && plan.includes('enterprise'))) {
      return planNames.enterprise
    }
    return planNames.free
  },
  getPlanPermission: (plan: string, feature: PaidFeature) => {
    const planName = Utils.getPlanName(plan)
    if (!plan || planName === planNames.free) {
      return false
    }
    const isScaleupOrGreater = planName !== planNames.startup
    const isEnterprise = planName === planNames.enterprise
    if (feature === 'AUTO_SEATS') {
      return isScaleupOrGreater && !isEnterprise
    }

    const requiredPlan = Utils.getRequiredPlan(feature)
    if (requiredPlan === 'enterprise') {
      return isEnterprise
    } else if (requiredPlan === 'scale-up') {
      return isScaleupOrGreater
    }
    return true
  },
  getPlansPermission: (feature: PaidFeature) => {
    const isOrgPermission = feature !== '2FA'
    const plans = isOrgPermission
      ? AccountStore.getActiveOrgPlan()
        ? [AccountStore.getActiveOrgPlan()]
        : null
      : AccountStore.getPlans()

    if (!plans || !plans.length) {
      return false
    }
    const found = _.find(
      plans.map((plan: string) => Utils.getPlanPermission(plan, feature)),
      (perm) => !!perm,
    )
    return !!found
  },
  getProjectColour(index: number) {
    return Constants.projectColors[index % (Constants.projectColors.length - 1)]
  },

  getRequiredPlan: (feature: PaidFeature) => {
    let plan
    switch (feature) {
      case 'FLAG_OWNERS':
      case 'RBAC':
      case 'AUDIT':
      case '4_EYES': {
        plan = 'scale-up'
        break
      }
      case 'STALE_FLAGS':
      case 'REALTIME':
      case 'METADATA':
      case 'SAML': {
        plan = 'enterprise'
        break
      }

      case 'SCHEDULE_FLAGS':
      case 'CREATE_ADDITIONAL_PROJECT':
      case '2FA':
      case 'FORCE_2FA': {
        plan = 'start-up' // startup or greater
        break
      }
      default: {
        plan = null
        break
      }
    }
    if (plan && !Utils.isSaas()) {
      plan = 'enterprise'
    }
    return plan as Plan
  },

  getSDKEndpoint(_project: ProjectType) {
    const project = _project || ProjectStore.model

    if (project && project.use_edge_identities) {
      return Project.flagsmithClientEdgeAPI
    }
    return Project.api
  },

  getSegmentOperators() {
    return Utils.getFlagsmithJSONValue(
      'segment_operators',
      defaultFlags.segment_operators,
    )
  },

  getShouldHideIdentityOverridesTab(_project: ProjectType) {
    const project = _project || ProjectStore.model
    if (!Utils.getIsEdge()) {
      return false
    }

    return !!(
      project &&
      project.use_edge_identities &&
      !project.show_edge_identity_overrides_for_feature
    )
  },

  getShouldSendIdentityToTraits(_project: ProjectType) {
    const project = _project || ProjectStore.model
    if (project && project.use_edge_identities) {
      return false
    }
    return true
  },

  getShouldUpdateTraitOnDelete(_project: ProjectType) {
    const project = _project || ProjectStore.model
    if (project && project.use_edge_identities) {
      return true
    }
    return false
  },

  getTagColour(index: number) {
    return Constants.tagColors[index % (Constants.tagColors.length - 1)]
  },

  getTraitEndpoint(environmentId: string, userId: string) {
    const model = ProjectStore.model as null | ProjectType

    if (model?.use_edge_identities) {
      return `${Project.api}environments/${environmentId}/edge-identities/${userId}/list-traits/`
    }
    return `${Project.api}environments/${environmentId}/identities/${userId}/traits/`
  },

  getTraitEndpointMethod(id?: number) {
    if ((ProjectStore.model as ProjectType | null)?.use_edge_identities) {
      return 'put'
    }
    return id ? 'put' : 'post'
  },

  getTypedValue(
    str: FlagsmithValue,
    boolToString?: boolean,
    testWithTrim?: boolean,
  ) {
    if (typeof str === 'undefined') {
      return ''
    }
    if (typeof str !== 'string') {
      return str
    }

    const typedValue = testWithTrim ? str.trim() : str
    const isNum = /^-?\d+$/.test(typedValue)

    if (isNum && parseInt(typedValue) > Number.MAX_SAFE_INTEGER) {
      return `${str}`
    }

    if (typedValue === 'true') {
      if (boolToString) return 'true'
      return true
    }
    if (typedValue === 'false') {
      if (boolToString) return 'false'
      return false
    }

    if (isNum) {
      if (str.indexOf('.') !== -1) {
        return parseFloat(typedValue)
      }
      return parseInt(typedValue)
    }

    return str
  },

  getUpdateTraitEndpoint(environmentId: string, userId: string, id?: string) {
    if ((ProjectStore.model as ProjectType | null)?.use_edge_identities) {
      return `${Project.api}environments/${environmentId}/edge-identities/${userId}/update-traits/`
    }
    return `${
      Project.api
    }environments/${environmentId}/identities/${userId}/traits/${
      id ? `${id}/` : ''
    }`
  },

  getViewIdentitiesPermission() {
    return 'VIEW_IDENTITIES'
  },
  hasEmailProvider: () =>
    global.flagsmithVersion?.backend?.has_email_provider ?? false,
  isEnterpriseImage: () => global.flagsmithVersion?.backend.is_enterprise,
  isMigrating() {
    const model = ProjectStore.model as null | ProjectType
    if (
      model?.migration_status === 'MIGRATION_IN_PROGRESS' ||
      model?.migration_status === 'MIGRATION_SCHEDULED'
    ) {
      return true
    }
    return false
  },
  isSaas: () => global.flagsmithVersion?.backend?.is_saas,
  isValidNumber(value: any) {
    return /^-?\d*\.?\d+$/.test(`${value}`)
  },
  isValidURL(value: any) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return regex.test(value)
  },
  loadScriptPromise(url: string) {
    return new Promise((resolve) => {
      const cb = function () {
        // @ts-ignore
        this.removeEventListener('load', cb)
        resolve(null)
      }
      const head = document.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.addEventListener('load', cb)
      script.src = url
      head.appendChild(script)
    })
  },
  numberWithCommas(x: number) {
    if (typeof x !== 'number') return ''
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  openChat() {
    // @ts-ignore
    if (typeof $crisp !== 'undefined') {
      // @ts-ignore
      $crisp.push(['do', 'chat:open'])
    }
    // @ts-ignore
    if (window.zE) {
      // @ts-ignore
      zE('messenger', 'open')
    }
  },

  removeElementFromArray(array: any[], index: number) {
    return array.slice(0, index).concat(array.slice(index + 1))
  },

  renderWithPermission(permission: boolean, name: string, el: ReactNode) {
    return permission ? (
      el
    ) : (
      <Tooltip title={<div>{el}</div>} place='right'>
        {name}
      </Tooltip>
    )
  },
  sanitiseDiffString: (value: FlagsmithValue) => {
    if (value === undefined || value == null) {
      return ''
    }
    return `${value}`
  },

  tagDisabled: (tag: Tag | undefined) => {
    const hasStaleFlagsPermission = Utils.getPlansPermission('STALE_FLAGS')
    return tag?.type === 'STALE' && !hasStaleFlagsPermission
  },

  validateMetadataType(type: string, value: any) {
    switch (type) {
      case 'int': {
        return Utils.isValidNumber(value)
      }
      case 'url': {
        return Utils.isValidURL(value)
      }
      case 'bool': {
        return value === 'true' || value === 'false'
      }
      default:
        return true
    }
  },
  validateRule(rule: SegmentCondition) {
    if (!rule) return false
    if (rule.delete) {
      return true
    }

    const operators = Utils.getSegmentOperators()
    const operatorObj = Utils.findOperator(rule.operator, rule.value, operators)

    if (operatorObj?.type === 'number') {
      return Utils.isValidNumber(rule.value)
    }

    if (operatorObj?.value?.toLowerCase?.().includes('semver')) {
      return !!semver.valid(`${rule.value.split(':')[0]}`)
    }

    switch (rule.operator) {
      case 'PERCENTAGE_SPLIT': {
        const value = parseFloat(rule.value)
        return !isNaN(value) && value >= 0 && value <= 100
      }
      case 'REGEX': {
        try {
          if (!rule.value) {
            throw new Error('')
          }
          new RegExp(`${rule.value}`)
          return true
        } catch (e) {
          return false
        }
      }
      case 'MODULO': {
        const valueSplit = rule.value.split('|')
        if (valueSplit.length === 2) {
          const [divisor, remainder] = [
            parseFloat(valueSplit[0]),
            parseFloat(valueSplit[1]),
          ]
          return (
            !isNaN(divisor) &&
            divisor > 0 &&
            !isNaN(remainder) &&
            remainder >= 0
          )
        }
        return false
      }
      default:
        return (
          (operatorObj && operatorObj.hideValue) ||
          (rule.value !== '' && rule.value !== undefined && rule.value !== null)
        )
    }
  },
  valueToFeatureState(value: FlagsmithValue, trimSpaces = true) {
    const val = Utils.getTypedValue(value, undefined, trimSpaces)

    if (typeof val === 'boolean') {
      return {
        boolean_value: val,
        integer_value: null,
        string_value: null,
        type: 'bool',
      }
    }

    if (typeof val === 'number') {
      return {
        boolean_value: null,
        integer_value: val,
        string_value: null,
        type: 'int',
      }
    }

    return {
      boolean_value: null,
      integer_value: null,
      string_value: value === null ? null : val || '',
      type: 'unicode',
    }
  },

  valueToTrait(value: FlagsmithValue) {
    const val = Utils.getTypedValue(value)

    if (typeof val === 'boolean') {
      return {
        boolean_value: val,
        integer_value: null,
        string_value: null,
        value_type: 'bool',
      }
    }

    if (typeof val === 'number') {
      return {
        boolean_value: null,
        integer_value: val,
        string_value: null,
        value_type: 'int',
      }
    }

    return {
      boolean_value: null,
      integer_value: null,
      string_value: value === null ? null : val || '',
      value_type: 'unicode',
    }
  },
})

export default Utils
