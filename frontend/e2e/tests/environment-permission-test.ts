import {
  byId,
  click, clickByText, closeModal, createEnvironment,
  createFeature, editRemoteConfig,
  gotoTraits,
  log,
  login, logout, setUserPermission,
  toggleFeature, waitForElementClickable, waitForElementNotClickable, waitForElementNotExist, waitForElementVisible,
} from '../helpers.cafe';
import {
  PASSWORD,
  E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS,
  E2E_USER,
  E2E_NON_ADMIN_USER_WITH_PROJECT_PERMISSIONS,
} from '../config';
import { Selector, t } from 'testcafe'
import { cli } from 'yaml/dist/cli';

export default async function () {
  log('Login')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  log('User can only view project')
  await click('#project-select-0')
  await t
    .expect(Selector('#project-select-1').exists)
    .notOk('The element"#project-select-1" should not be present')
  await logout()

  log('User with permissions can Handle the Features')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await createFeature(0, 'test_feature', false)
  await toggleFeature(0, true)
  await logout()

  log('User without permissions cannot create traits')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await gotoTraits()
  const createTraitBtn = Selector(byId('add-trait'))
  await t.expect(createTraitBtn.hasAttribute('disabled')).ok()
  await logout()

  log('User without permissions cannot see audit logs')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await waitForElementNotExist(byId('audit-log-link'))
  await logout()

  log('Create new environment')
  await login(E2E_USER, PASSWORD)
  await clickByText('My Test Project 6 Env Permission')
  await click('#create-env-link')
  await createEnvironment('Production')
  await logout()
  log('User without permissions cannot see environment')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await waitForElementVisible(byId('switch-environment-development'))
  await waitForElementNotExist(byId('switch-environment-production'))
  await logout()

  log('Grant view environment permission')
  await login(E2E_USER, PASSWORD)
  await setUserPermission(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, 'VIEW_ENVIRONMENT', 'Production', 'environment', 'My Test Project 6 Env Permission' )
  await logout()
  log('User with permissions can see environment')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await waitForElementVisible(byId('switch-environment-production'))
  await waitForElementVisible(byId('switch-environment-production'))
  await logout()

  log('User with permissions can update feature state')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await createFeature(0,'my_feature',"foo",'A test feature')
  await editRemoteConfig(0, 'bar')
  await logout()
  log('User without permission cannot create a segment override')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await click(byId('feature-item-0'))
  await click(byId('segment_overrides'))
  await waitForElementNotClickable('#update-feature-segments-btn')
  await closeModal()
  await logout()
  log('Grant MANAGE_IDENTITIES permission')
  await login(E2E_USER, PASSWORD)
  await setUserPermission(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, 'MANAGE_SEGMENT_OVERRIDES', 'Development', 'environment', 'My Test Project 6 Env Permission' )
  await logout()
  log('User with permission can create a segment override')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await click(byId('feature-item-0'))
  await click(byId('segment_overrides'))
  await waitForElementClickable('#update-feature-segments-btn')
  await closeModal()
  await logout()

  log('User without permissions cannot update feature state')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await waitForElementClickable(byId('feature-switch-0-on'))
  await click(byId('switch-environment-production'))
  await waitForElementNotClickable(byId('feature-switch-0-on'))
  await click(byId('feature-item-0'))
  await waitForElementNotClickable(byId('update-feature-btn'))
  await closeModal()
  await logout()

  log('User with permissions can view identities')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await waitForElementVisible('#users-link')
  await logout()

  log('User without permissions cannot add user trait')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await click('#users-link')
  await click(byId('user-item-0'))
  await waitForElementNotClickable(byId('add-trait'))
  await logout()

  log('Grant MANAGE_IDENTITIES permission')
  await login(E2E_USER, PASSWORD)
  await setUserPermission(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, 'MANAGE_IDENTITIES', 'Development', 'environment', 'My Test Project 6 Env Permission' )
  await logout()
  log('User with permissions can add user trait')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await click('#users-link')
  await click(byId('user-item-0'))
  await waitForElementClickable(byId('add-trait'))
  await logout()


  log('Remove VIEW_IDENTITIES permission')
  await login(E2E_USER, PASSWORD)
  await setUserPermission(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, 'VIEW_IDENTITIES', 'Development', 'environment', 'My Test Project 6 Env Permission' )
  await logout()
  log('User without permissions cannot view identities')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  await click('#project-select-0')
  await click('#users-link')
  await waitForElementVisible(byId('missing-view-identities'))
}
