import { RequestLogger, Selector, t } from 'testcafe'
import { FlagsmithValue } from '../common/types/responses';
import { E2E_USER, PASSWORD } from './config';
import { cli } from 'yaml/dist/cli';

export const LONG_TIMEOUT = 40000

export const byId = (id: string) => `[data-test="${id}"]`

export type MultiVariate = { value: string; weight: number }

export type Rule = {
  name: string
  operator: string
  value: string | number | boolean
  ors?: Rule[]
}
export const setText = async (selector: string, text: string) => {
  logUsingLastSection(`Set text ${selector} : ${text}`)
  if (text) {
    return t
      .selectText(selector)
      .pressKey('delete')
      .selectText(selector) // Prevents issue where input tabs out of focus
      .typeText(selector, `${text}`)
  } else {
    return t
      .selectText(selector) // Prevents issue where input tabs out of focus
      .pressKey('delete')
  }
}

export const waitForElementVisible = async (selector: string) => {
  logUsingLastSection(`Waiting element visible ${selector}`)
  return t
    .expect(Selector(selector).visible)
    .ok(`waitForElementVisible(${selector})`, { timeout: LONG_TIMEOUT })
}

export const waitForElementNotClickable = async (selector: string) => {
  logUsingLastSection(`Waiting element visible ${selector}`)
  await t
    .expect(Selector(selector).visible)
    .ok(`waitForElementVisible(${selector})`, { timeout: LONG_TIMEOUT })
  await t
      .expect(Selector(selector).hasAttribute('disabled')).ok()
}

export const waitForElementClickable = async (selector: string) => {
  logUsingLastSection(`Waiting element visible ${selector}`)
  await t
    .expect(Selector(selector).visible)
    .ok(`waitForElementVisible(${selector})`, { timeout: LONG_TIMEOUT })
  await t
      .expect(Selector(selector).hasAttribute('disabled')).notOk()
}

export const logResults = async (requests: LoggedRequest[], t) => {
  if (!t.testRun?.errs?.length) {
    log('Finished without errors')
    return // do not log anything for passed tests
  }
  log('Start of Requests')
  log(
    undefined,
    JSON.stringify(
      requests.filter((v) => {
        if (
          v.request?.url?.includes('get-subscription-metadata') ||
          v.request?.url?.includes('analytics/flags')
        ) {
          return false
        }
        if (
          v.response &&
          v.response?.statusCode >= 200 &&
          v.response?.statusCode < 300
        ) {
          return false
        }
        return true
      }),
      null,
      2,
    ),
  )
  logUsingLastSection('Session JavaScript Errors')
  logUsingLastSection(JSON.stringify(await t.getBrowserConsoleMessages()))
  log('End of Requests')
}

export const waitForElementNotExist = async (selector: string) => {
  logUsingLastSection(`Waiting element not visible ${selector}`)
  return t.expect(Selector(selector).exists).notOk('', { timeout: 10000 })
}
export const gotoFeatures = async () => {
  await click('#features-link')
  await waitForElementVisible('#show-create-feature-btn')
}

export const click = async (selector: string) => {
  await waitForElementVisible(selector)
  await t
    .scrollIntoView(selector)
    .expect(Selector(selector).hasAttribute('disabled'))
    .notOk('ready for testing', { timeout: 5000 })
    .hover(selector)
    .click(selector)
}

export const clickByText = async (text:string, element = 'button') => {
  logUsingLastSection(`Click by text ${text} ${element}`)
  const selector = Selector(element).withText(text);
  await t
      .scrollIntoView(selector)
      .expect(Selector(selector).hasAttribute('disabled'))
      .notOk('ready for testing', { timeout: 5000 })
      .hover(selector)
      .click(selector)
}

export const gotoSegments = async () => {
  await click('#segments-link')
}

export const getLogger = () =>
  RequestLogger(/api\/v1/, {
    logRequestBody: true,
    logRequestHeaders: true,
    logResponseBody: true,
    logResponseHeaders: true,
    stringifyRequestBody: true,
    stringifyResponseBody: true,
  })

export const createRole = async (roleName: string, index: number, users: number[]) => {
  await click(byId('tab-item-roles'))
  await click(byId('create-role'))
  await setText(byId('role-name'), roleName)
  await click(byId('save-role'))
  await click(byId(`role-${index}`))
  await click(byId('members-tab'))
  await click(byId('assigned-users'))
  for (const userId of users) {
    await click(byId(`assignees-list-item-${userId}`))
  }
  await closeModal()
}


export const editRoleMembers = async (index:number)=>{
  await click(byId('tab-item-roles'))
  await click(byId('create-role'))
  await setText(byId('role-name'), roleName)
  await click(byId('save-role'))
}

export const gotoTraits = async () => {
  await click('#features-link')
  await click('#users-link')
  await click(byId('user-item-0'))
  await waitForElementVisible('#add-trait')
}

export const createTrait = async (
  index: number,
  id: string,
  value: string | boolean | number,
) => {
  await click('#add-trait')
  await waitForElementVisible('#create-trait-modal')
  await setText('[name="traitID"]', id)
  await setText('[name="traitValue"]', `${value}`)
  await click('#create-trait-btn')
  await t.wait(2000)
  await t.eval(() => location.reload())
  await waitForElementVisible(byId(`user-trait-value-${index}`))
  const expectedValue = typeof value === 'string' ? `"${value}"` : `${value}`
  await assertTextContent(byId(`user-trait-value-${index}`), expectedValue)
}

export const deleteTrait = async (index: number) => {
  await click(byId(`delete-user-trait-${index}`))
  await click('#confirm-btn-yes')
  await waitForElementNotExist(byId(`user-trait-${index}`))
}

const lastTestSection = {}
let lastTestName = undefined

export const logUsingLastSection = (message?: string) => {
  log(undefined, message)
}

// eslint-disable-next-line no-console
export const log = (section: string | undefined, message?: string) => {
  const testName = t.test.name
  const sectionName = section ?? lastTestSection[testName]

  if (lastTestName !== testName || lastTestSection[testName] !== sectionName) {
    const ellipsis = section === sectionName ? '' : '...'
    console.log(
      '\n',
      '\x1b[32m',
      `${testName ? `${ellipsis}[${testName} tests] ` : ''}${sectionName}`,
      '\x1b[0m',
      '\n',
    )
    lastTestSection[testName] = sectionName
    lastTestName = testName
  }
  if (message) {
    console.log(message)
  }
}

export const viewFeature = async (index: number) => {
  await click(byId(`feature-item-${index}`))
  await waitForElementVisible('#create-feature-modal')
}

export const addSegmentOverrideConfig = async (
  index: number,
  value: string | boolean | number,
  selectionIndex = 0,
) => {
  await click(byId('segment_overrides'))
  await click(byId(`select-segment-option-${selectionIndex}`))

  await waitForElementVisible(byId(`segment-override-value-${index}`))
  await setText(byId(`segment-override-value-${index}`), `${value}`)
  await click(byId(`segment-override-toggle-${index}`))
}

export const addSegmentOverride = async (
  index: number,
  value: string | boolean | number,
  selectionIndex = 0,
  mvs: MultiVariate[] = [],
) => {
  await click(byId('segment_overrides'))
  await click(byId(`select-segment-option-${selectionIndex}`))
  await waitForElementVisible(byId(`segment-override-value-${index}`))
  if (value) {
    await click(`${byId(`segment-override-${index}`)} [role="switch"]`)
  }
  if (mvs) {
    await Promise.all(
      mvs.map(async (v, i) => {
        await setText(
          `.segment-overrides ${byId(`featureVariationWeight${v.value}`)}`,
          `${v.weight}`,
        )
      }),
    )
  }
}

export const saveFeature = async () => {
  await click('#update-feature-btn')
  await waitForElementVisible('.toast-message')
  await waitForElementNotExist('.toast-message')
  await closeModal()
  await waitForElementNotExist('#create-feature-modal')
}

export const saveFeatureSegments = async () => {
  await click('#update-feature-segments-btn')
  await waitForElementVisible('.toast-message')
  await waitForElementNotExist('.toast-message')
  await closeModal()
  await waitForElementNotExist('#create-feature-modal')
}

export const createEnvironment = async (name:string) => {
  await setText('[name="envName"]', name)
  await click('#create-env-btn')
  await waitForElementVisible(byId(`switch-environment-${name.toLowerCase()}-active`))
}

export const goToUser = async (index: number) => {
  await click('#features-link')
  await click('#users-link')
  await click(byId(`user-item-${index}`))
}

export const gotoFeature = async (index: number) => {
  await click(byId(`feature-item-${index}`))
  await waitForElementVisible('#create-feature-modal')
}

export const setSegmentOverrideIndex = async (
  index: number,
  newIndex: number,
) => {
  await click(byId('segment_overrides'))
  await setText(byId(`sort-${index}`), `${newIndex}`)
}

export const assertTextContent = (selector: string, v: string) =>
  t.expect(Selector(selector).textContent).eql(v)
export const assertTextContentContains = (selector: string, v: string) =>
  t.expect(Selector(selector).textContent).contains(v)
export const getText = (selector: string) => Selector(selector).innerText

export const deleteSegment = async (index: number, name: string) => {
  await click(byId(`remove-segment-btn-${index}`))
  await setText('[name="confirm-segment-name"]', name)
  await click('#confirm-remove-segment-btn')
  await waitForElementNotExist(`remove-segment-btn-${index}`)
}

export const login = async (email: string, password: string) => {
  await setText('[name="email"]', `${email}`)
  await setText('[name="password"]', `${password}`)
  await click('#login-btn')
  await waitForElementVisible('#project-manage-widget')
}
export const logout = async () => {
  await click('#account-settings-link')
  await click('#logout-link')
  await waitForElementVisible('#login-page')
}

export const goToFeatureVersions = async (featureIndex:number) =>{
  await gotoFeature(featureIndex)
  await click(byId('change-history'))
}

export const compareVersion = async (
    featureIndex:number,
    versionIndex:number,
    compareOption: 'LIVE'|'PREVIOUS'|null,
    oldEnabled:boolean,
    newEnabled:boolean,
    oldValue?:FlagsmithValue,
    newValue?:FlagsmithValue
) =>{
  await goToFeatureVersions(featureIndex)
  await click(byId(`history-item-${versionIndex}-compare`))
  if(compareOption==='LIVE') {
    await click(byId(`history-item-${versionIndex}-compare-live`))
  } else if(compareOption==='PREVIOUS') {
    await click(byId(`history-item-${versionIndex}-compare-previous`))
  }

  await assertTextContent(byId(`old-enabled`), `${oldEnabled}`)
  await assertTextContent(byId(`new-enabled`), `${newEnabled}`)
  if(oldValue) {
    await assertTextContent(byId(`old-value`), `${oldValue}`)
  }
  if(newValue) {
    await assertTextContent(byId(`old-value`), `${oldValue}`)
  }
  await closeModal()
}
export const assertNumberOfVersions = async (index:number, versions:number) =>{
  await goToFeatureVersions(index)
  await waitForElementVisible(byId(`history-item-${versions-2}-compare`))
  await closeModal()
}

export const createRemoteConfig = async (
  index: number,
  name: string,
  value: string | number | boolean,
  description = 'description',
  defaultOff?: boolean,
  mvs: MultiVariate[] = [],
) => {
  const expectedValue = typeof value === 'string' ? `"${value}"` : `${value}`
  await gotoFeatures()
  await click('#show-create-feature-btn')
  await setText(byId('featureID'), name)
  await setText(byId('featureValue'), `${value}`)
  await setText(byId('featureDesc'), description)
  if (!defaultOff) {
    await click(byId('toggle-feature-button'))
  }
  await Promise.all(
    mvs.map(async (v, i) => {
      await click(byId('add-variation'))

      await setText(byId(`featureVariationValue${i}`), v.value)
      await setText(byId(`featureVariationWeight${v.value}`), `${v.weight}`)
    }),
  )
  await click(byId('create-feature-btn'))
  await waitForElementVisible(byId(`feature-value-${index}`))
  await assertTextContent(byId(`feature-value-${index}`), expectedValue)
  await closeModal()
}

export const createOrganisationAndProject = async (organisationName:string,projectName:string) =>{
  log('Create Organisation')
  await click(byId('home-link'))
  await click(byId('create-organisation-btn'))
  await setText('[name="orgName"]', organisationName)
  await click('#create-org-btn')
  await waitForElementVisible(byId('project-manage-widget'))

  log('Create Project')
  await click('.btn-project-create')
  await setText(byId('projectName'), projectName)
  await click(byId('create-project-btn'))
  await waitForElementVisible(byId('features-page'))
}
export const editRemoteConfig = async (
  index: number,
  value: string | number | boolean,
  toggleFeature: boolean = false,
  mvs: MultiVariate[] = [],
) => {
  const expectedValue = typeof value === 'string' ? `"${value}"` : `${value}`
  await gotoFeatures()

  await click(byId(`feature-item-${index}`))
  await setText(byId('featureValue'), `${value}`)
  if (toggleFeature) {
    await click(byId('toggle-feature-button'))
  }
  await Promise.all(
      mvs.map(async (v, i) => {
        await setText(byId(`featureVariationWeight${v.value}`), `${v.weight}`)
      }),
  )
  await click(byId('update-feature-btn'))
  if(value) {
    await waitForElementVisible(byId(`feature-value-${index}`))
    await assertTextContent(byId(`feature-value-${index}`), expectedValue)
  }
  await closeModal()
}
export const closeModal = async () => {
  await t.click('body', {
    offsetX: 50,
    offsetY: 50,
  })
}
export const createFeature = async (
  index: number,
  name: string,
  value?: string | boolean | number,
  description = 'description',
) => {
  await gotoFeatures()
  await click('#show-create-feature-btn')
  await setText(byId('featureID'), name)
  await setText(byId('featureDesc'), description)
  if (value) {
    await click(byId('toggle-feature-button'))
  }
  await click(byId('create-feature-btn'))
  await waitForElementVisible(byId(`feature-item-${index}`))
  await closeModal()
}

export const deleteFeature = async (index: number, name: string) => {
  await click(byId(`feature-action-${index}`))
  await waitForElementVisible(byId(`remove-feature-btn-${index}`))
  await click(byId(`remove-feature-btn-${index}`))
  await setText('[name="confirm-feature-name"]', name)
  await click('#confirm-remove-feature-btn')
  await waitForElementNotExist(`remove-feature-btn-${index}`)
}

export const toggleFeature = async (index: number, toValue: boolean) => {
  await click(byId(`feature-switch-${index}${toValue ? '-off' : 'on'}`))
  await click('#confirm-toggle-feature-btn')
  await waitForElementVisible(
    byId(`feature-switch-${index}${toValue ? '-on' : 'off'}`),
  )
}

export const setUserPermissions = async (index: number, toValue: boolean) => {
  await click(byId(`feature-switch-${index}${toValue ? '-off' : 'on'}`))
  await click('#confirm-toggle-feature-btn')
  await waitForElementVisible(
    byId(`feature-switch-${index}${toValue ? '-on' : 'off'}`),
  )
}

export const setSegmentRule = async (
  ruleIndex: number,
  orIndex: number,
  name: string,
  operator: string,
  value: string | number | boolean,
) => {
  await setText(byId(`rule-${ruleIndex}-property-${orIndex}`), name)
  if (operator) {
    await setText(byId(`rule-${ruleIndex}-operator-${orIndex}`), operator)
  }
  await setText(byId(`rule-${ruleIndex}-value-${orIndex}`), `${value}`)
}

export const createSegment = async (
  index: number,
  id: string,
  rules?: Rule[],
) => {
  await click(byId('show-create-segment-btn'))
  await setText(byId('segmentID'), id)
  for (let x = 0; x < rules.length; x++) {
    const rule = rules[x]
    if (x > 0) {
      // eslint-disable-next-line no-await-in-loop
      await click(byId('add-rule'))
    }
    // eslint-disable-next-line no-await-in-loop
    await setSegmentRule(x, 0, rule.name, rule.operator, rule.value)
    if (rule.ors) {
      for (let orIndex = 0; orIndex < rule.ors.length; orIndex++) {
        const or = rule.ors[orIndex]
        // eslint-disable-next-line no-await-in-loop
        await click(byId(`rule-${x}-or`))
        // eslint-disable-next-line no-await-in-loop
        await setSegmentRule(x, orIndex + 1, or.name, or.operator, or.value)
      }
    }
  }

  // Create
  await click(byId('create-segment'))
  await waitForElementVisible(byId(`segment-${index}-name`))
  await assertTextContent(byId(`segment-${index}-name`), id)
  await closeModal()
}

export const waitAndRefresh = async (waitFor = 3000) => {
  logUsingLastSection(`Waiting for ${waitFor}ms, then refreshing.`)
  await t.wait(waitFor)
  await t.eval(() => location.reload())
}

export const refreshUntilElementVisible = async (selector: string, maxRetries=20) => {
  const element = Selector(selector);
  const isElementVisible = async () => await element.exists && await element.visible;
  let retries = 0;
  while (retries < maxRetries && !(await isElementVisible())) {
    await t.eval(() => location.reload()); // Reload the page
    await t.wait(3000);
    retries++;
  }
  return t.scrollIntoView(element)
}

const permissionsMap = {
  'CREATE_PROJECT': 'organisation',
  'MANAGE_USERS': 'organisation',
  'MANAGE_USER_GROUPS': 'organisation',
  'VIEW_PROJECT': 'project',
  'CREATE_ENVIRONMENT': 'project',
  'DELETE_FEATURE': 'project',
  'CREATE_FEATURE': 'project',
  'MANAGE_SEGMENTS': 'project',
  'VIEW_AUDIT_LOG': 'project',
  'VIEW_ENVIRONMENT': 'environment',
  'UPDATE_FEATURE_STATE': 'environment',
  'MANAGE_IDENTITIES': 'environment',
  'CREATE_CHANGE_REQUEST': 'environment',
  'APPROVE_CHANGE_REQUEST': 'environment',
  'VIEW_IDENTITIES': 'environment',
  'MANAGE_SEGMENT_OVERRIDES': 'environment',
  'MANAGE_TAGS': 'project',
} as const;


export const setUserPermission = async (email: string, permission: keyof typeof permissionsMap | 'ADMIN', entityName:string|null, entityLevel?: 'project'|'environment'|'organisation', parentName?: string) => {
  await click(byId('users-and-permissions'))
  await click(byId(`user-${email}`))
  const level = permissionsMap[permission] || entityLevel
  await click(byId(`${level}-permissions-tab`))
  if(parentName) {
    await clickByText(parentName, 'a')
  }
  if(entityName) {
    await click(byId(`permissions-${entityName.toLowerCase()}`))
  }
  if(permission==='ADMIN') {
    await click(byId(`admin-switch-${level}`))
  } else {
    await click(byId(`permission-switch-${permission}`))
  }
  await closeModal()
}

export default {}
