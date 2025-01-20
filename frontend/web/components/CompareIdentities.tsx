import React, { FC, useEffect, useMemo, useState } from 'react'
import IdentitySelect, { IdentitySelectType } from './IdentitySelect'
import Utils from 'common/utils/utils'
import EnvironmentSelect from './EnvironmentSelect'
import {
  useGetIdentityFeatureStatesAllQuery,
  useCreateCloneIdentityFeatureStatesMutation,
} from 'common/services/useIdentityFeatureState'
import { useGetProjectFlagsQuery } from 'common/services/useProjectFlag'
import Tag from './tags/Tag'
import PanelSearch from './PanelSearch'
import { ProjectFlag, Res } from 'common/types/responses'
import Icon from './Icon'
import Switch from './Switch'
import FeatureValue from './FeatureValue'
import { sortBy } from 'lodash'
import { useHasPermission } from 'common/providers/Permission'
import Constants from 'common/constants'
import Button from './base/forms/Button'
import ProjectStore from 'common/stores/project-store'
import SegmentOverridesIcon from './SegmentOverridesIcon'
import IdentityOverridesIcon from './IdentityOverridesIcon'
import Tooltip from './Tooltip'
import PageTitle from './PageTitle'

type CompareIdentitiesType = {
  projectId: string
  environmentId: string
}
const selectWidth = 300
const featureNameWidth = 300

const calculateFeatureDifference = (
  projectFlagId: number,
  leftUser: Res['identityFeatureStates'] | undefined,
  rightUser: Res['identityFeatureStates'] | undefined,
) => {
  const featureStateLeft = leftUser?.find((v) => v.feature.id === projectFlagId)
  const featureStateRight = rightUser?.find(
    (v) => v.feature.id === projectFlagId,
  )
  const enabledDifferent =
    featureStateLeft?.enabled !== featureStateRight?.enabled
  const valueDifferent =
    featureStateLeft?.feature_state_value !==
    featureStateRight?.feature_state_value

  return {
    enabledDifferent,
    featureStateLeft,
    featureStateRight,
    valueDifferent,
  }
}
const CompareIdentities: FC<CompareIdentitiesType> = ({
  environmentId: _environmentId,
  projectId,
}) => {
  const [leftId, setLeftId] = useState<IdentitySelectType['value']>()
  const [rightId, setRightId] = useState<IdentitySelectType['value']>()
  const { data: projectFlags, refetch } = useGetProjectFlagsQuery({
    environment: ProjectStore.getEnvironmentIdFromKey(_environmentId),
    project: projectId,
  })
  const [environmentId, setEnvironmentId] = useState(_environmentId)
  const [showArchived, setShowArchived] = useState(false)

  const { isLoading: permissionLoading, permission } = useHasPermission({
    id: environmentId,
    level: 'environment',
    permission: Utils.getViewIdentitiesPermission(),
  })

  const { data: leftUser } = useGetIdentityFeatureStatesAllQuery(
    { environment: environmentId, user: `${leftId?.value}` },
    { skip: !leftId },
  )
  const { data: rightUser } = useGetIdentityFeatureStatesAllQuery(
    { environment: environmentId, user: `${rightId?.value}` },
    { skip: !rightId },
  )
  const [createCloneIdentityFeatureStates] =
    useCreateCloneIdentityFeatureStatesMutation()

  useEffect(() => {
    // Clear users whenever environment or project is changed
    setLeftId(null)
    setRightId(null)
  }, [environmentId, projectId])

  const filteredItems = useMemo(() => {
    if (!projectFlags?.results) return projectFlags?.results

    return sortBy(
      projectFlags.results.filter((v) => {
        if (showArchived) {
          return true
        }
        return !v.is_archived
      }),
      (projectFlag) => {
        const { id, name } = projectFlag
        const { enabledDifferent, valueDifferent } = calculateFeatureDifference(
          id,
          leftUser,
          rightUser,
        )
        const isDifferent = enabledDifferent || valueDifferent ? 0 : 1
        return `${isDifferent}${name}`
      },
    )
  }, [projectFlags, showArchived, leftUser, rightUser])

  const isReady =
    !!leftId && !!rightId && !!leftUser && !!rightUser && !!projectFlags

  const isEdge = Utils.getIsEdge()

  const goUser = (user: IdentitySelectType['value'], feature: string) => {
    window.open(
      `${
        document.location.origin
      }/project/${projectId}/environment/${environmentId}/users/${encodeURIComponent(
        user!.label,
      )}/${user!.value}?flag=${encodeURIComponent(feature)}`,
      '_blank',
    )
  }

  const cloneIdentityValues = (
    leftIdentityName: string,
    rightIdentityName: string,
    leftIdentityId: string,
    rightIdentityId: string,
    environmentId: string,
  ) => {
    const body =
      Utils.getFeatureStatesEndpoint() === 'featurestates'
        ? { source_identity_id: leftIdentityId }
        : { source_identity_uuid: leftIdentityId }

    return openConfirm({
      body: (
        <div>
          {'This will copy any Identity overrides from '}{' '}
          <strong>{leftIdentityName}</strong> {'to '}
          <strong>{`${rightIdentityName}.`}</strong>{' '}
          {'Any existing Identity overrides on '}
          <strong>{`${rightIdentityName}`}</strong> {'will be lost.'}
          <br />
        </div>
      ),
      destructive: true,
      onYes: () => {
        createCloneIdentityFeatureStates({
          body: body,
          environment_id: environmentId,
          identity_id: rightIdentityId,
        }).then(() => {
          toast('Identity overrides successfully cloned!')
          refetch()
        })
      },
      title: 'Clone Identity overrides',
      yesText: 'Confirm',
    })
  }

  return (
    <div>
      <div className='col-md-8'>
        <h5 className='mb-1'>Compare Identities</h5>
        <p className='fs-small mb-4 lh-sm'>
          Compare feature states between 2 identities.
        </p>
      </div>
      <div className='mb-2' style={{ width: selectWidth }}>
        <EnvironmentSelect
          value={environmentId}
          projectId={projectId}
          onChange={(v) => {
            setRightId(null)
            setLeftId(null)
            setEnvironmentId(v)
          }}
        />
      </div>
      {!permission && !permissionLoading ? (
        <div
          dangerouslySetInnerHTML={{
            __html: Constants.environmentPermissions('View Identities'),
          }}
        />
      ) : (
        <Row>
          <div style={{ width: selectWidth }}>
            <IdentitySelect
              value={leftId}
              isEdge={isEdge}
              ignoreIds={[`${rightId?.value}`]}
              onChange={setLeftId}
              environmentId={environmentId}
            />
          </div>
          <div className='mx-3'>
            <Icon
              name='arrow-right'
              width={20}
              fill={
                Utils.getFlagsmithHasFeature('dark_mode') ? '#fff' : '#1A2634'
              }
            />
          </div>
          <div style={{ width: selectWidth }}>
            <IdentitySelect
              value={rightId}
              ignoreIds={[`${leftId?.value}`]}
              isEdge={isEdge}
              onChange={setRightId}
              environmentId={environmentId}
            />
          </div>
        </Row>
      )}

      {isReady && (
        <>
          <PageTitle
            title={'Changed Flags'}
            className='mt-3'
            cta={
              <>
                {Utils.getFlagsmithHasFeature('clone_identities') && (
                  <>
                    <Tooltip
                      title={
                        <Button
                          disabled={!leftId || !rightId || !environmentId}
                          onClick={() => {
                            cloneIdentityValues(
                              leftId?.label,
                              rightId?.label,
                              leftId?.value,
                              rightId?.value,
                              environmentId,
                            )
                          }}
                          className='ms-2 me-2'
                        >
                          {'Clone Features states'}
                        </Button>
                      }
                    >
                      {`Clone the Features states from ${leftId?.label} to ${rightId?.label}`}
                    </Tooltip>
                  </>
                )}
              </>
            }
          ></PageTitle>
          <PanelSearch
            className='no-pad mt-4'
            searchPanel={
              <Row className='mb-2'>
                <Tag
                  selected={showArchived}
                  onClick={() => {
                    setShowArchived(!showArchived)
                  }}
                  className='px-2 py-2 ml-2 mr-2'
                  tag={Constants.archivedTag}
                />
              </Row>
            }
            items={filteredItems}
            renderRow={(data: ProjectFlag) => {
              const { description, id, name } = data
              const {
                enabledDifferent,
                featureStateLeft,
                featureStateRight,
                valueDifferent,
              } = calculateFeatureDifference(id, leftUser, rightUser)
              const goUserLeft = () => {
                goUser(leftId, data.name)
              }
              const goUserRight = () => {
                goUser(leftId, data.name)
              }

              return (
                <Flex className={'flex-row list-item'}>
                  <div
                    style={{ width: featureNameWidth }}
                    className={`table-column ${
                      !enabledDifferent && !valueDifferent && 'faded'
                    }`}
                  >
                    <Row>
                      <span className='font-weight-medium'>
                        <Tooltip title={<span>{name}</span>}>
                          {description}
                        </Tooltip>
                      </span>
                      <Button
                        onClick={() => Utils.copyToClipboard(name)}
                        theme='icon'
                        className='ms-2 me-2'
                      >
                        <Icon name='copy' />
                      </Button>
                      <SegmentOverridesIcon
                        count={data.num_segment_overrides}
                      />
                      <IdentityOverridesIcon
                        count={data.num_identity_overrides}
                        showPlusIndicator={
                          data.is_num_identity_overrides_complete === false
                        }
                      />
                    </Row>
                  </div>
                  <div
                    onClick={goUserLeft}
                    className={`table-column ${!enabledDifferent && 'faded'}`}
                    style={{ width: '120px' }}
                  >
                    <Switch checked={featureStateLeft?.enabled} />
                  </div>
                  <Flex
                    onClick={goUserLeft}
                    className={`table-column ${!valueDifferent && 'faded'}`}
                  >
                    {featureStateLeft && (
                      <FeatureValue
                        includeEmpty={false}
                        value={featureStateLeft?.feature_state_value}
                      />
                    )}
                  </Flex>
                  <div
                    onClick={goUserRight}
                    className={`table-column ${!enabledDifferent && 'faded'}`}
                    style={{ width: '120px' }}
                  >
                    <Switch checked={featureStateRight?.enabled} />
                  </div>
                  <Flex
                    onClick={goUserRight}
                    className={`table-column ${!valueDifferent && 'faded'}`}
                  >
                    {featureStateRight && (
                      <FeatureValue
                        includeEmpty={false}
                        value={featureStateRight?.feature_state_value}
                      />
                    )}
                  </Flex>
                </Flex>
              )
            }}
            header={
              <Row className='table-header'>
                <div
                  className='table-column px-3'
                  style={{ width: featureNameWidth }}
                >
                  Name
                </div>
                <Flex className='flex-row'>
                  <div className='table-column' style={{ width: '120px' }}>
                    {leftId?.label}
                  </div>
                  <Flex className='table-column'></Flex>
                </Flex>
                <Flex className='flex-row'>
                  <div className='table-column' style={{ width: '120px' }}>
                    {rightId?.label}
                  </div>
                  <Flex className='table-column'></Flex>
                </Flex>
              </Row>
            }
          />
        </>
      )}
    </div>
  )
}

export default CompareIdentities
