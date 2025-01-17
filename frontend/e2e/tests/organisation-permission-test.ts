import {
  byId,
  click, clickByText,
  closeModal,
  log,
  login, logout,
  setText, waitForElementClickable, waitForElementNotClickable,
  waitForElementVisible,
} from '../helpers.cafe';
import {
  PASSWORD,
  E2E_NON_ADMIN_USER_WITH_ORG_PERMISSIONS,
  E2E_NON_ADMIN_USER_WITH_PROJECT_PERMISSIONS,
} from '../config';
import { Selector, t } from 'testcafe'

export default async function () {
  log('Login')
  await login(E2E_NON_ADMIN_USER_WITH_ORG_PERMISSIONS, PASSWORD)
  log('User without permissions cannot see any Project')
  await t
    .expect(Selector('#project-select-0').exists)
    .notOk('The element"#project-select-0" should not be present')
  log('User with permissions can Create a Project')
  await waitForElementClickable( byId('create-first-project-btn'))

  log('User can manage groups')
  await click(byId('users-and-permissions'))
  await clickByText('Groups')
  await waitForElementClickable("#btn-invite-groups")
  await logout()
  log('Login as project user')
  await login(E2E_NON_ADMIN_USER_WITH_PROJECT_PERMISSIONS, PASSWORD)
  log('User cannot manage users or groups')
  await click(byId('users-and-permissions'))
  await clickByText('Groups')
  await waitForElementNotClickable("#btn-invite-groups")
}
