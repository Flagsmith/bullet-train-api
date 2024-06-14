import {
  byId,
  click,
  createFeature,
  gotoTraits,
  log,
  login,
  toggleFeature,
} from '../helpers.cafe'
import { PASSWORD, E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS } from '../config'
import { Selector, t } from 'testcafe'

export default async function () {
  log('Login')
  await login(E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS, PASSWORD)
  log('User only can see an project')
  await click('#project-select-0')
  await t
    .expect(Selector('#project-select-1').exists)
    .notOk('The element"#project-select-1" should not be present')
  log('User with permissions can Handle the Features')
  await createFeature(0, 'test_feature', false)
  await toggleFeature(0, true)
  await t.eval(() => {
    window.scrollBy(0, 15000)
  })
  log('User withou permissions cannot create traits')
  await gotoTraits()
  const createTraitBtn = Selector(byId('add-trait'))
  await t.expect(createTraitBtn.hasAttribute('disabled')).ok()
}
