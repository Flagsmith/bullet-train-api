import fetch from 'node-fetch'
import { test, fixture } from 'testcafe'
import { waitForReact } from 'testcafe-react-selectors'

import Project from '../common/project'
import { getLogger, logout, logResults } from './helpers.cafe'
import environmentTest from './tests/environment-test'
import inviteTest from './tests/invite-test'
import projectTest from './tests/project-test'
import { testSegment1, testSegment2, testSegment3 } from './tests/segment-test'
import initialiseTests from './tests/initialise-tests'
import flagTests from './tests/flag-tests'
import versioningTests from './tests/versioning-tests'
import organisationPermissionTest from './tests/organisation-permission-test'
import projectPermissionTest from './tests/project-permission-test'
import environmentPermissionTest from './tests/environment-permission-test'
import rolesTest from './tests/roles-test'

require('dotenv').config()

const url = `http://localhost:${process.env.PORT || 8080}/`
const e2eTestApi = `${process.env.FLAGSMITH_API_URL || Project.api}e2etests/teardown/`
const logger = getLogger()

console.log(
  '\n',
  '\x1b[32m',
  `E2E using API: ${e2eTestApi}. E2E URL: ${url}`,
  '\x1b[0m',
  '\n',
)

fixture`E2E Tests`.requestHooks(logger).before(async () => {
  const token = process.env.E2E_TEST_TOKEN
    ? process.env.E2E_TEST_TOKEN
    : process.env[`E2E_TEST_TOKEN_${Project.env.toUpperCase()}`]

  if (token) {
    await fetch(e2eTestApi, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-E2E-Test-Auth-Token': token.trim(),
      },
      body: JSON.stringify({}),
    }).then((res) => {
      if (res.ok) {
        // eslint-disable-next-line no-console
        console.log(
          '\n',
          '\x1b[32m',
          'e2e teardown successful',
          '\x1b[0m',
          '\n',
        )
      } else {
        // eslint-disable-next-line no-console
        console.error(
          '\n',
          '\x1b[31m',
          'e2e teardown failed',
          res.status,
          '\x1b[0m',
          '\n',
        )
      }
      console.log('Starting E2E tests')
    })
  } else {
    // eslint-disable-next-line no-console
    console.error(
      '\n',
      '\x1b[31m',
      'e2e teardown failed - no available token',
      '\x1b[0m',
      '\n',
    )
  }
}).page`${url}`
  .beforeEach(async () => {
    await waitForReact()
  })
  .afterEach(async (t) => {
    await logResults(logger.requests, t)
  })

test('Segment-part-1', async () => {
  await testSegment1()
  await logout()
})

test('Segment-part-2', async () => {
  await testSegment2()
  await logout()
})

test('Segment-part-3', async () => {
  await testSegment3()
  await logout()
})

test('Flag', async () => {
  await flagTests()
  await logout()
})

test('Signup', async () => {
  await initialiseTests()
  await logout()
})

test('Invite', async () => {
  await inviteTest()
})

test('Environment', async () => {
  await environmentTest()
  await logout()
})

test('Project', async () => {
  await projectTest()
  await logout()
})

test('Versioning', async () => {
  await versioningTests()
  await logout()
})

test('Organisation-permission', async () => {
  await organisationPermissionTest()
  await logout()
})

test('Project-permission', async () => {
  await projectPermissionTest()
  await logout()
})

test('Environment-permission', async () => {
  await environmentPermissionTest()
  await logout()
})
