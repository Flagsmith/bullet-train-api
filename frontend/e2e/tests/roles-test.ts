import {
  byId,
  click,
  createFeature,
  log,
  login,
  setText,
  waitForElementVisible,
  closeModal,
  logout,
  gotoTraits,
  deleteFeature, createRole,
} from '../helpers.cafe';
import {
  PASSWORD,
  E2E_NON_ADMIN_USER_WITH_A_ROLE,
  E2E_USER,
} from '../config'
import { t } from 'testcafe'

export default async function () {
  log('Login')
  await login(E2E_USER, PASSWORD)
  await click('#project-select-6')
  await createFeature(0, 'test_feature', false)
  log('Go to Roles')
  await click(byId('org-settings-link'))
  await click(byId('users-and-permissions'))
  await waitForElementVisible(byId('tab-item-roles'))
  log('Create Role')
  await createRole('test_role', 0, [4])
  log('Add project permissions to the Role')
  await click(byId(`role-0`))
  await click(byId('permissions-tab'))
  await click(byId('permissions-tab'))
  await waitForElementVisible(byId('project-permissions-tab'))
  await click(byId('project-permissions-tab'))
  await click(byId('permissions-my test project 7 role'))
  await click(byId('admin-switch-project'))
  log('Add environment permissions to the Role')
  await waitForElementVisible(byId('environment-permissions-tab'))
  await click(byId('environment-permissions-tab'))
  await click(byId('project-select'))
  await waitForElementVisible(byId('project-select-option-6'))
  await click(byId('project-select-option-6'))
  await click(byId('permissions-development'))
  await click(byId('admin-switch-environment'))
  await closeModal()
  await logout(t)
  log('Login with the user with a new Role')
  await t.eval(() => location.reload());
  await t.wait(2000);
  await login(E2E_NON_ADMIN_USER_WITH_A_ROLE, PASSWORD)
  await click('#project-select-0')
  log('User with permissions can Handle the Features')
  const flagName = 'test_feature'
  await deleteFeature(0, flagName)

  log('User with permissions can See the Identities')
  await gotoTraits()
}
