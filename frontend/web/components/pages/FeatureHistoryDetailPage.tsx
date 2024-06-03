import React, { FC, useState } from 'react'
import ConfigProvider from 'common/providers/ConfigProvider'
import { RouterChildContext } from 'react-router'
import ProjectStore from 'common/stores/project-store'
import {
  useGetFeatureVersionQuery,
  useGetFeatureVersionsQuery,
} from 'common/services/useFeatureVersion'
import { useGetUsersQuery } from 'common/services/useUser'
import AccountStore from 'common/stores/account-store'
import { Environment } from 'common/types/responses'
import PageTitle from 'components/PageTitle'
import FeatureVersion from 'components/FeatureVersion'
import moment from 'moment'
import ErrorMessage from 'components/ErrorMessage'
import Tabs from 'components/base/forms/Tabs'
import TabItem from 'components/base/forms/TabItem'

type FeatureHistoryPageType = {
  router: RouterChildContext['router']

  match: {
    params: {
      id: string
      environmentId: string
      projectId: string
    }
  }
}

const FeatureHistoryPage: FC<FeatureHistoryPageType> = ({ match, router }) => {
  const [open, setOpen] = useState(false)

  const env: Environment | undefined = ProjectStore.getEnvironment(
    match.params.environmentId,
  ) as any
  // @ts-ignore
  const environmentId = `${env?.id}`
  const uuid = match.params.id
  const { data: users } = useGetUsersQuery({
    organisationId: AccountStore.getOrganisation().id,
  })
  const { data, error, isLoading } = useGetFeatureVersionQuery({
    uuid,
  })
  const featureId = data?.feature
  const {
    data: versions,
    error: versionsError,
    isLoading: versionsLoading,
  } = useGetFeatureVersionsQuery(
    {
      environmentId,
      featureId: featureId as any,
    },
    {
      skip: !featureId,
    },
  )
  const user = users?.find((user) => data?.published_by === user.id)
  const live = versions?.results?.[0]
  return (
    <div className='container app-container'>
      <PageTitle title={'History'}>
        <div>
          View and rollback history of feature values, multivariate values and
          segment overrides.
        </div>
      </PageTitle>
      {!!(error || versionsError) && (
        <ErrorMessage>{error || versionsError}</ErrorMessage>
      )}

      {(isLoading || versionsLoading) && (
        <div className='text-center'>
          <Loader />
        </div>
      )}
      {!!data && !!versions && (
        <div>
          <Row className='list-item py-2'>
            <div className='flex-fill'>
              <div className='mb-4'>
                Published{' '}
                <strong>
                  {moment(data.live_from).format('Do MMM HH:mma')}
                </strong>{' '}
                by{' '}
                <strong>
                  {user
                    ? `${user.first_name || ''} ${user.last_name || ''} `
                    : 'System '}
                </strong>
              </div>
              <Tabs urlParam='compare' theme='pill' uncontrolled>
                {!!data.previous_version_uuid && (
                  <TabItem tabLabel='Compare to Previous'>
                    <div className='mt-4'>
                      <FeatureVersion
                        projectId={`${match.params.projectId}`}
                        featureId={parseInt(featureId)}
                        environmentId={environmentId}
                        newUUID={data.uuid}
                        oldUUID={data.previous_version_uuid}
                      />
                    </div>
                  </TabItem>
                )}
                {versions?.results?.[0].uuid !== data.uuid && (
                  <TabItem tabLabel='Compare to Live'>
                    <div className='mt-4'>
                      <FeatureVersion
                        projectId={`${match.params.projectId}`}
                        featureId={parseInt(featureId)}
                        environmentId={environmentId}
                        newUUID={live!.uuid}
                        oldUUID={data.uuid}
                      />
                    </div>
                  </TabItem>
                )}
              </Tabs>
            </div>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ConfigProvider(FeatureHistoryPage)
