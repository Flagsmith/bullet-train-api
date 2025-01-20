import React, { FC, useCallback, useEffect, useState } from 'react'
import { RouterChildContext } from 'react-router'
import keyBy from 'lodash/keyBy'

import { getStore } from 'common/store'
import { getTags } from 'common/services/useTag'
import { getViewMode, setViewMode } from 'common/useViewMode'
import { removeUserOverride } from 'components/RemoveUserOverride'
import {
  FeatureState,
  IdentityFeatureState,
  ProjectFlag,
} from 'common/types/responses'
import API from 'project/api'
import AccountStore from 'common/stores/account-store'
import AppActions from 'common/dispatcher/app-actions'
import Button from 'components/base/forms/Button'
import CodeHelp from 'components/CodeHelp'
import ConfigProvider from 'common/providers/ConfigProvider'
import ConfirmToggleFeature from 'components/modals/ConfirmToggleFeature'
import Constants from 'common/constants'
import CreateFlagModal from 'components/modals/CreateFlag'
import CreateSegmentModal from 'components/modals/CreateSegment'
import CreateTraitModal from 'components/modals/CreateTrait'
import EditIdentity from 'components/EditIdentity'
import FeatureListStore from 'common/stores/feature-list-store'
import FeatureValue from 'components/FeatureValue'
import Format from 'common/utils/format'
import Icon from 'components/Icon'
import IdentifierString from 'components/IdentifierString'
import IdentityProvider from 'common/providers/IdentityProvider'
import IdentitySegmentsProvider from 'common/providers/IdentitySegmentsProvider'
import InfoMessage from 'components/InfoMessage'
import JSONReference from 'components/JSONReference'
import PageTitle from 'components/PageTitle'
import Panel from 'components/base/grid/Panel'
import PanelSearch from 'components/PanelSearch'
import Permission from 'common/providers/Permission'
import Project from 'common/project'
import Switch from 'components/Switch'
import TableFilterOptions from 'components/tables/TableFilterOptions'
import TableGroupsFilter from 'components/tables/TableGroupsFilter'
import TableOwnerFilter from 'components/tables/TableOwnerFilter'
import TableSearchFilter from 'components/tables/TableSearchFilter'
import TableSortFilter from 'components/tables/TableSortFilter'
import TableTagFilter from 'components/tables/TableTagFilter'
import TableValueFilter from 'components/tables/TableValueFilter'
import TagValues from 'components/tags/TagValues'
import TryIt from 'components/TryIt'
import Utils from 'common/utils/utils'
import _data from 'common/data/base/_data'
import classNames from 'classnames'
import moment from 'moment'
import { removeIdentity } from './UsersPage'

const width = [200, 48, 78]

const valuesEqual = (actualValue: any, flagValue: any) => {
  const nullFalseyA =
    actualValue == null ||
    actualValue === '' ||
    typeof actualValue === 'undefined'
  const nullFalseyB =
    flagValue == null || flagValue === '' || typeof flagValue === 'undefined'
  return nullFalseyA && nullFalseyB ? true : actualValue === flagValue
}
type UserPageType = {
  router: RouterChildContext['router']
  match: {
    params: {
      environmentId: string
      projectId: string
      id: string
      identity: string
    }
  }
}
const UserPage: FC<UserPageType> = (props) => {
  const params = Utils.fromParam()
  const { router } = props
  const { environmentId, id, identity, projectId } = props.match.params

  // Separate state hooks
  const [groupOwners, setGroupOwners] = useState(
    typeof params.group_owners === 'string'
      ? params.group_owners.split(',').map((v: string) => parseInt(v))
      : [],
  )
  const [isEnabled, setIsEnabled] = useState(
    params.is_enabled === 'true'
      ? true
      : params.is_enabled === 'false'
      ? false
      : null,
  )
  const [owners, setOwners] = useState(
    typeof params.owners === 'string'
      ? params.owners.split(',').map((v: string) => parseInt(v))
      : [],
  )
  const [preselect, setPreselect] = useState(Utils.fromParam().flag)
  const [search, setSearch] = useState(params.search || null)
  const [showArchived, setShowArchived] = useState(
    params.is_archived === 'true',
  )
  const [sort, setSort] = useState({
    label: Format.camelCase(params.sortBy || 'Name'),
    sortBy: params.sortBy || 'name',
    sortOrder: params.sortOrder || 'asc',
  })
  const [tagStrategy, setTagStrategy] = useState(
    params.tag_strategy || 'INTERSECTION',
  )
  const [tags, setTags] = useState(
    typeof params.tags === 'string'
      ? params.tags.split(',').map((v: string) => parseInt(v))
      : [],
  )
  const [valueSearch, setValueSearch] = useState(params.value_search || '')
  const [actualFlags, setActualFlags] =
    useState<Record<string, IdentityFeatureState>>()

  const getFilter = useCallback(
    () => ({
      group_owners: groupOwners.length ? groupOwners : undefined,
      is_archived: showArchived,
      is_enabled: isEnabled === null ? undefined : isEnabled,
      owners: owners.length ? owners : undefined,
      tag_strategy: tagStrategy,
      tags: tags.length ? tags.join(',') : undefined,
      value_search: valueSearch ? valueSearch : undefined,
    }),
    [
      groupOwners,
      showArchived,
      isEnabled,
      owners,
      tagStrategy,
      tags,
      valueSearch,
    ],
  )
  useEffect(() => {
    AppActions.searchFeatures(
      projectId,
      environmentId,
      true,
      search,
      sort,
      getFilter(),
    )
  }, [search, sort, getFilter, environmentId, projectId])

  useEffect(() => {
    AppActions.getIdentity(environmentId, id)
    AppActions.getIdentitySegments(projectId, id)
    getTags(getStore(), { projectId: `${projectId}` })
    getActualFlags()
    API.trackPage(Constants.pages.USER)
    // eslint-disable-next-line
  }, [])

  const getActualFlags = () => {
    const url = `${
      Project.api
    }environments/${environmentId}/${Utils.getIdentitiesEndpoint()}/${id}/${Utils.getFeatureStatesEndpoint()}/all/`
    _data.get(url).then((res: IdentityFeatureState[]) => {
      setActualFlags(keyBy(res, (v: IdentityFeatureState) => v.feature.name))
    })
  }

  const onSave = () => {
    getActualFlags()
  }

  const editSegment = (segment: any) => {
    API.trackEvent(Constants.events.VIEW_SEGMENT)
    openModal(
      `Segment - ${segment.name}`,
      <CreateSegmentModal
        segment={segment.id}
        readOnly
        environmentId={environmentId}
        projectId={projectId}
      />,
      'side-modal create-segment-modal',
    )
  }

  const confirmToggle = (projectFlag: any, environmentFlag: any, cb: any) => {
    openModal(
      'Toggle Feature',
      <ConfirmToggleFeature
        identity={id}
        identityName={decodeURIComponent(identity)}
        environmentId={environmentId}
        projectFlag={projectFlag}
        environmentFlag={environmentFlag}
        cb={cb}
      />,
      'p-0',
    )
  }
  const editFeature = (
    projectFlag: ProjectFlag,
    environmentFlag: FeatureState,
    identityFlag: IdentityFeatureState,
    multivariate_feature_state_values: IdentityFeatureState['multivariate_feature_state_values'],
  ) => {
    history.replaceState(
      {},
      '',
      `${document.location.pathname}?flag=${projectFlag.name}`,
    )
    API.trackEvent(Constants.events.VIEW_USER_FEATURE)
    openModal(
      <span>
        <Row>
          Edit User Feature:{' '}
          <span className='standard-case'>{projectFlag.name}</span>
          <Button
            onClick={() => {
              Utils.copyToClipboard(projectFlag.name)
            }}
            theme='icon'
            className='ms-2'
          >
            <Icon name='copy' />
          </Button>
        </Row>
      </span>,
      <CreateFlagModal
        history={router.history}
        identity={id}
        identityName={decodeURIComponent(identity)}
        environmentId={environmentId}
        projectId={projectId}
        projectFlag={projectFlag}
        identityFlag={{
          ...identityFlag,
          multivariate_feature_state_values,
        }}
        environmentFlag={environmentFlag}
      />,
      'side-modal create-feature-modal overflow-y-auto',
      () => {
        history.replaceState({}, '', `${document.location.pathname}`)
      },
    )
  }

  const createTrait = () => {
    API.trackEvent(Constants.events.VIEW_USER_FEATURE)
    openModal(
      'Create User Trait',
      <CreateTraitModal
        isEdit={false}
        onSave={onTraitSaved}
        identity={id}
        identityName={decodeURIComponent(identity)}
        environmentId={environmentId}
        projectId={projectId}
      />,
      'p-0',
    )
  }

  const filter = () => {
    const currentParams = Utils.fromParam()
    if (!currentParams.flag) {
      props.router.history.replace(
        `${document.location.pathname}?${Utils.toParam(getFilter())}`,
      )
    }
    AppActions.searchFeatures(
      projectId,
      environmentId,
      true,
      search,
      sort,
      getFilter(),
    )
  }
  const onTraitSaved = () => {
    AppActions.getIdentitySegments(projectId, id)
  }

  const editTrait = (trait: {
    id: string
    trait_key: string
    trait_value: string
  }) => {
    openModal(
      'Edit User Trait',
      <CreateTraitModal
        isEdit
        {...trait}
        onSave={onTraitSaved}
        identity={id}
        identityName={decodeURIComponent(identity)}
        environmentId={environmentId}
        projectId={projectId}
      />,
      'p-0',
    )
  }

  const removeTrait = (traitId: string, trait_key: string) => {
    openConfirm({
      body: (
        <div>
          {'Are you sure you want to delete trait '}
          <strong>{trait_key}</strong>
          {
            ' from this user? Traits can be re-added here or via one of our SDKs.'
          }
        </div>
      ),
      destructive: true,
      onYes: () =>
        AppActions.deleteIdentityTrait(environmentId, id, traitId || trait_key),
      title: 'Delete Trait',
      yesText: 'Confirm',
    })
  }

  const preventAddTrait = !AccountStore.getOrganisation().persist_trait_data
  const isEdge = Utils.getIsEdge()
  const showAliases = isEdge && Utils.getFlagsmithHasFeature('identity_aliases')

  return (
    <div className='app-container container'>
      <Permission
        level='environment'
        permission={Utils.getManageUserPermission()}
        id={environmentId}
      >
        {({ permission: manageUserPermission }) => (
          <div>
            <IdentityProvider onSave={onSave}>
              {(
                {
                  environmentFlags,
                  identity,
                  identityFlags,
                  isLoading,
                  projectFlags,
                  traits,
                }: any,
                { toggleFlag }: any,
              ) =>
                isLoading &&
                !tags.length &&
                !showArchived &&
                typeof search !== 'string' &&
                (!identityFlags || !actualFlags || !projectFlags) ? (
                  <div className='text-center'>
                    <Loader />
                  </div>
                ) : (
                  <>
                    <PageTitle
                      title={
                        <div className='d-flex align-items-center justify-content-between'>
                          <div>
                            <IdentifierString
                              value={
                                (identity && identity.identity.identifier) || id
                              }
                            />
                            {showAliases && (
                              <h6>
                                <Tooltip
                                  title={
                                    <span className='user-select-none'>
                                      Alias:{' '}
                                    </span>
                                  }
                                >
                                  Aliases allow you to add searchable names to
                                  an identity
                                </Tooltip>
                                <EditIdentity
                                  data={identity?.identity}
                                  environmentId={environmentId}
                                />
                              </h6>
                            )}
                          </div>
                          <Button
                            id='remove-feature'
                            className='btn btn-with-icon'
                            type='button'
                            onClick={() => {
                              removeIdentity(
                                id,
                                (identity && identity.identity.identifier) ||
                                  id,
                                environmentId,
                                () => {
                                  router.history.replace(
                                    `/project/${projectId}/environment/${environmentId}/users`,
                                  )
                                },
                              )
                            }}
                          >
                            <Icon name='trash-2' width={20} fill='#656D7B' />
                          </Button>
                        </div>
                      }
                    >
                      View and manage feature states and traits for this user.
                      <br />
                    </PageTitle>
                    <div className='row'>
                      <div className='col-md-12'>
                        <FormGroup>
                          <FormGroup>
                            <PanelSearch
                              id='user-features-list'
                              className='no-pad overflow-visible'
                              itemHeight={70}
                              title={
                                <div>
                                  Features
                                  <div className='fw-normal mt-2 fs-medium'>
                                    <InfoMessage
                                      collapseId={'identity-priority'}
                                    >
                                      Overriding features here will take
                                      priority over any segment override. Any
                                      features that are not overridden for this
                                      user will fallback to any segment
                                      overrides or the environment defaults.
                                    </InfoMessage>
                                  </div>
                                </div>
                              }
                              renderFooter={() => (
                                <>
                                  <JSONReference
                                    showNamesButton
                                    className='mt-4 mx-2'
                                    title={'Features'}
                                    json={
                                      projectFlags &&
                                      Object.values(projectFlags)
                                    }
                                  />
                                  <JSONReference
                                    className='mx-2'
                                    title={'Environment Feature States'}
                                    json={
                                      environmentFlags &&
                                      Object.values(environmentFlags)
                                    }
                                  />
                                  <JSONReference
                                    className='mx-2'
                                    title={'Identity Feature States'}
                                    json={
                                      identityFlags &&
                                      Object.values(identityFlags)
                                    }
                                  />
                                </>
                              )}
                              header={
                                <Row className='table-header'>
                                  <div className='table-column flex-row flex-fill'>
                                    <TableSearchFilter
                                      onChange={(e) => {
                                        FeatureListStore.isLoading = true
                                        setSearch(Utils.safeParseEventValue(e))
                                      }}
                                      value={search}
                                    />
                                    <Row className='flex-fill justify-content-end'>
                                      <TableTagFilter
                                        projectId={projectId}
                                        className='me-4'
                                        value={tags}
                                        tagStrategy={tagStrategy}
                                        onChangeStrategy={(strategy) => {
                                          setTagStrategy(strategy)
                                        }}
                                        isLoading={FeatureListStore.isLoading}
                                        onToggleArchived={(value) => {
                                          if (value !== showArchived) {
                                            FeatureListStore.isLoading = true
                                            setShowArchived(!showArchived)
                                          }
                                        }}
                                        showArchived={showArchived}
                                        onChange={(newTags) => {
                                          FeatureListStore.isLoading = true
                                          setTags(
                                            newTags.includes('') &&
                                              newTags.length > 1
                                              ? ['']
                                              : newTags,
                                          )
                                        }}
                                      />
                                      <TableValueFilter
                                        className='me-4'
                                        value={{
                                          enabled: isEnabled,
                                          valueSearch,
                                        }}
                                        onChange={({
                                          enabled,
                                          valueSearch,
                                        }) => {
                                          setIsEnabled(enabled)
                                          setValueSearch(valueSearch)
                                        }}
                                      />
                                      <TableOwnerFilter
                                        className={'me-4'}
                                        value={owners}
                                        onChange={(newOwners) => {
                                          FeatureListStore.isLoading = true
                                          setOwners(newOwners)
                                        }}
                                      />
                                      <TableGroupsFilter
                                        className={'me-4'}
                                        projectId={projectId}
                                        orgId={
                                          AccountStore.getOrganisation()?.id
                                        }
                                        value={groupOwners}
                                        onChange={(newGroupOwners) => {
                                          FeatureListStore.isLoading = true
                                          setGroupOwners(newGroupOwners)
                                        }}
                                      />
                                      <TableFilterOptions
                                        title={'View'}
                                        className={'me-4'}
                                        value={getViewMode()}
                                        onChange={setViewMode as any}
                                        options={[
                                          {
                                            label: 'Default',
                                            value: 'default',
                                          },
                                          {
                                            label: 'Compact',
                                            value: 'compact',
                                          },
                                        ]}
                                      />
                                      <TableSortFilter
                                        value={sort}
                                        isLoading={FeatureListStore.isLoading}
                                        options={[
                                          {
                                            label: 'Name',
                                            value: 'name',
                                          },
                                          {
                                            label: 'Created Date',
                                            value: 'created_date',
                                          },
                                        ]}
                                        onChange={(newSort) => {
                                          FeatureListStore.isLoading = true
                                          setSort(newSort)
                                        }}
                                      />
                                    </Row>
                                  </div>
                                </Row>
                              }
                              isLoading={FeatureListStore.isLoading}
                              items={projectFlags}
                              renderRow={(
                                { description, id: featureId, name, tags }: any,
                                i: number,
                              ) => {
                                return (
                                  <Permission
                                    level='environment'
                                    permission={Utils.getManageFeaturePermission(
                                      false,
                                    )}
                                    id={environmentId}
                                    tags={tags}
                                  >
                                    {({ permission }) => {
                                      const identityFlag =
                                        identityFlags[featureId] || {}
                                      const environmentFlag =
                                        (environmentFlags &&
                                          environmentFlags[featureId]) ||
                                        {}
                                      const hasUserOverride =
                                        identityFlag.identity ||
                                        identityFlag.identity_uuid
                                      const flagEnabled = hasUserOverride
                                        ? identityFlag.enabled
                                        : environmentFlag.enabled
                                      const flagValue = hasUserOverride
                                        ? identityFlag.feature_state_value
                                        : environmentFlag.feature_state_value
                                      const actualEnabled =
                                        actualFlags &&
                                        actualFlags[name]?.enabled
                                      const actualValue =
                                        actualFlags &&
                                        actualFlags[name]?.feature_state_value
                                      const flagEnabledDifferent =
                                        hasUserOverride
                                          ? false
                                          : actualEnabled !== flagEnabled
                                      const flagValueDifferent = hasUserOverride
                                        ? false
                                        : !valuesEqual(actualValue, flagValue)
                                      const projectFlag = projectFlags?.find(
                                        (p: any) =>
                                          p.id === environmentFlag.feature,
                                      )
                                      const isMultiVariateOverride =
                                        flagValueDifferent &&
                                        projectFlag?.multivariate_options?.find(
                                          (v: any) =>
                                            Utils.featureStateToValue(v) ===
                                            actualValue,
                                        )
                                      const flagDifferent =
                                        flagEnabledDifferent ||
                                        flagValueDifferent

                                      const onClick = () => {
                                        if (permission) {
                                          editFeature(
                                            projectFlag,
                                            environmentFlags[featureId],
                                            identityFlags[featureId] ||
                                              actualFlags![name],
                                            identityFlags[featureId]
                                              ?.multivariate_feature_state_values,
                                          )
                                        }
                                      }

                                      const isCompact =
                                        getViewMode() === 'compact'
                                      if (name === preselect && actualFlags) {
                                        setPreselect(null)
                                        onClick()
                                      }

                                      return (
                                        <div
                                          className={classNames(
                                            `flex-row space list-item clickable py-2 ${
                                              flagDifferent && 'flag-different'
                                            }`,
                                            {
                                              'list-item-xs':
                                                isCompact &&
                                                !flagEnabledDifferent &&
                                                !flagValueDifferent,
                                            },
                                          )}
                                          key={featureId}
                                          data-test={`user-feature-${i}`}
                                          onClick={onClick}
                                        >
                                          <Flex className='table-column'>
                                            <Row>
                                              <Flex>
                                                <Row
                                                  className='font-weight-medium'
                                                  style={{
                                                    alignItems: 'start',
                                                    lineHeight: 1,
                                                    rowGap: 4,
                                                    wordBreak: 'break-all',
                                                  }}
                                                >
                                                  <Row>
                                                    <span>
                                                      {description ? (
                                                        <Tooltip
                                                          title={
                                                            <span>{name}</span>
                                                          }
                                                        >
                                                          {description}
                                                        </Tooltip>
                                                      ) : (
                                                        name
                                                      )}
                                                    </span>
                                                    <Button
                                                      onClick={(e) => {
                                                        e?.stopPropagation()
                                                        e?.currentTarget?.blur()
                                                        Utils.copyToClipboard(
                                                          projectFlag.name,
                                                        )
                                                      }}
                                                      theme='icon'
                                                      className='ms-2 me-2'
                                                    >
                                                      <Icon name='copy' />
                                                    </Button>
                                                  </Row>
                                                  <TagValues
                                                    projectId={`${projectId}`}
                                                    value={projectFlag.tags}
                                                  />
                                                </Row>
                                                {hasUserOverride ? (
                                                  <div className='list-item-subtitle mt-1'>
                                                    Overriding defaults
                                                  </div>
                                                ) : flagEnabledDifferent ? (
                                                  <div
                                                    data-test={`feature-override-${i}`}
                                                    className='list-item-subtitle mt-1'
                                                  >
                                                    <Row>
                                                      <Flex>
                                                        {isMultiVariateOverride ? (
                                                          <span>
                                                            This flag is being
                                                            overridden by a
                                                            variation defined on
                                                            your feature, the
                                                            control value is{' '}
                                                            <strong>
                                                              {flagEnabled
                                                                ? 'on'
                                                                : 'off'}
                                                            </strong>{' '}
                                                            for this user
                                                          </span>
                                                        ) : (
                                                          <span>
                                                            This flag is being
                                                            overridden by
                                                            segments and would
                                                            normally be{' '}
                                                            <strong>
                                                              {flagEnabled
                                                                ? 'on'
                                                                : 'off'}
                                                            </strong>{' '}
                                                            for this user
                                                          </span>
                                                        )}
                                                      </Flex>
                                                    </Row>
                                                  </div>
                                                ) : flagValueDifferent ? (
                                                  isMultiVariateOverride ? (
                                                    <div
                                                      data-test={`feature-override-${i}`}
                                                      className='list-item-subtitle mt-1'
                                                    >
                                                      <span className='flex-row'>
                                                        This feature is being
                                                        overridden by a %
                                                        variation in the
                                                        environment, the control
                                                        value of this feature is{' '}
                                                        <FeatureValue
                                                          className='ml-1 chip--xs'
                                                          includeEmpty
                                                          data-test={`user-feature-original-value-${i}`}
                                                          value={`${flagValue}`}
                                                        />
                                                      </span>
                                                    </div>
                                                  ) : (
                                                    <div
                                                      data-test={`feature-override-${i}`}
                                                      className='list-item-subtitle mt-1'
                                                    >
                                                      <span className='flex-row'>
                                                        This feature is being
                                                        overridden by segments
                                                        and would normally be{' '}
                                                        <FeatureValue
                                                          className='ml-1 chip--xs'
                                                          includeEmpty
                                                          data-test={`user-feature-original-value-${i}`}
                                                          value={`${flagValue}`}
                                                        />{' '}
                                                        for this user
                                                      </span>
                                                    </div>
                                                  )
                                                ) : (
                                                  getViewMode() ===
                                                    'default' && (
                                                    <div className='list-item-subtitle mt-1'>
                                                      Using environment defaults
                                                    </div>
                                                  )
                                                )}
                                              </Flex>
                                            </Row>
                                          </Flex>
                                          <div
                                            className='table-column'
                                            style={{ width: width[0] }}
                                          >
                                            <FeatureValue
                                              data-test={`user-feature-value-${i}`}
                                              value={actualValue!}
                                            />
                                          </div>
                                          <div
                                            className='table-column'
                                            style={{ width: width[1] }}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {Utils.renderWithPermission(
                                              permission,
                                              Constants.environmentPermissions(
                                                Utils.getManageFeaturePermissionDescription(
                                                  false,
                                                  true,
                                                ),
                                              ),
                                              <Switch
                                                disabled={!permission}
                                                data-test={`user-feature-switch-${i}${
                                                  actualEnabled ? '-on' : '-off'
                                                }`}
                                                checked={actualEnabled}
                                                onChange={() =>
                                                  confirmToggle(
                                                    projectFlag,
                                                    actualFlags![name],
                                                    () =>
                                                      toggleFlag({
                                                        environmentFlag:
                                                          actualFlags![name],
                                                        environmentId,
                                                        identity: id,
                                                        identityFlag,
                                                        projectFlag: {
                                                          id: featureId,
                                                        },
                                                      }),
                                                  )
                                                }
                                              />,
                                            )}
                                          </div>
                                          <div
                                            className='table-column p-0'
                                            style={{ width: width[2] }}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {hasUserOverride && (
                                              <>
                                                {Utils.renderWithPermission(
                                                  permission,
                                                  Constants.environmentPermissions(
                                                    Utils.getManageFeaturePermissionDescription(
                                                      false,
                                                      true,
                                                    ),
                                                  ),
                                                  <Button
                                                    theme='text'
                                                    size='xSmall'
                                                    disabled={!permission}
                                                    onClick={() => {
                                                      removeUserOverride({
                                                        environmentId,
                                                        identifier:
                                                          identity.identity
                                                            .identifier,
                                                        identity: id,
                                                        identityFlag,
                                                        projectFlag,
                                                      })
                                                    }}
                                                  >
                                                    <Icon
                                                      name='refresh'
                                                      fill='#6837FC'
                                                      width={16}
                                                    />{' '}
                                                    Reset
                                                  </Button>,
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    }}
                                  </Permission>
                                )
                              }}
                              renderSearchWithNoResults
                              paging={FeatureListStore.paging}
                              search={search}
                              nextPage={() =>
                                AppActions.getFeatures(
                                  projectId,
                                  environmentId,
                                  true,
                                  search,
                                  sort,
                                  FeatureListStore.paging.next,
                                  getFilter(),
                                )
                              }
                              prevPage={() =>
                                AppActions.getFeatures(
                                  projectId,
                                  environmentId,
                                  true,
                                  search,
                                  sort,
                                  FeatureListStore.paging.previous,
                                  getFilter(),
                                )
                              }
                              goToPage={(pageNumber: number) =>
                                AppActions.getFeatures(
                                  projectId,
                                  environmentId,
                                  true,
                                  search,
                                  sort,
                                  pageNumber,
                                  getFilter(),
                                )
                              }
                            />
                          </FormGroup>
                          {!preventAddTrait && (
                            <FormGroup>
                              <PanelSearch
                                id='user-traits-list'
                                className='no-pad'
                                itemHeight={65}
                                title='Traits'
                                items={traits}
                                actionButton={
                                  <div className='ml-2'>
                                    {Utils.renderWithPermission(
                                      manageUserPermission,
                                      Constants.environmentPermissions(
                                        Utils.getManageUserPermissionDescription(),
                                      ),
                                      <Button
                                        disabled={!manageUserPermission}
                                        id='add-trait'
                                        data-test='add-trait'
                                        onClick={createTrait}
                                        size='small'
                                      >
                                        Add new trait
                                      </Button>,
                                    )}
                                  </div>
                                }
                                header={
                                  <Row className='table-header'>
                                    <Flex className='table-column px-3'>
                                      Trait
                                    </Flex>
                                    <Flex className='table-column'>Value</Flex>
                                    <div
                                      className='table-column'
                                      style={{ width: '80px' }}
                                    >
                                      Remove
                                    </div>
                                  </Row>
                                }
                                renderRow={(
                                  { id, trait_key, trait_value }: any,
                                  i: number,
                                ) => (
                                  <Row
                                    className='list-item clickable'
                                    key={trait_key}
                                    space
                                    data-test={`user-trait-${i}`}
                                    onClick={() =>
                                      editTrait({
                                        id,
                                        trait_key,
                                        trait_value,
                                      })
                                    }
                                  >
                                    <Flex className='table-column px-3'>
                                      <div
                                        className={`js-trait-key-${i} font-weight-medium`}
                                      >
                                        {trait_key}
                                      </div>
                                    </Flex>
                                    <Flex className='table-column'>
                                      <FeatureValue
                                        includeEmpty
                                        data-test={`user-trait-value-${i}`}
                                        value={trait_value}
                                      />
                                    </Flex>
                                    <div
                                      className='table-column text-center'
                                      style={{ width: '80px' }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {Utils.renderWithPermission(
                                        manageUserPermission,
                                        Constants.environmentPermissions(
                                          Utils.getManageUserPermissionDescription(),
                                        ),
                                        <Button
                                          id='remove-feature'
                                          className='btn btn-with-icon'
                                          type='button'
                                          disabled={!manageUserPermission}
                                          onClick={() =>
                                            removeTrait(id, trait_key)
                                          }
                                          data-test={`delete-user-trait-${i}`}
                                        >
                                          <Icon
                                            name='trash-2'
                                            width={20}
                                            fill='#656D7B'
                                          />
                                        </Button>,
                                      )}
                                    </div>
                                  </Row>
                                )}
                                renderNoResults={
                                  <Panel
                                    title='Traits'
                                    className='no-pad'
                                    action={
                                      <div>
                                        {Utils.renderWithPermission(
                                          manageUserPermission,
                                          Constants.environmentPermissions(
                                            Utils.getManageUserPermissionDescription(),
                                          ),
                                          <Button
                                            disabled={!manageUserPermission}
                                            className='mb-2'
                                            id='add-trait'
                                            data-test='add-trait'
                                            onClick={createTrait}
                                            size='small'
                                          >
                                            Add new trait
                                          </Button>,
                                        )}
                                      </div>
                                    }
                                  >
                                    <div className='search-list'>
                                      <Row className='list-item text-muted px-3'>
                                        This user has no traits.
                                      </Row>
                                    </div>
                                  </Panel>
                                }
                                filterRow={(
                                  { trait_key }: any,
                                  searchString: string,
                                ) =>
                                  trait_key
                                    .toLowerCase()
                                    .indexOf(searchString.toLowerCase()) > -1
                                }
                              />
                            </FormGroup>
                          )}
                          <IdentitySegmentsProvider id={id}>
                            {({ segments }: any) =>
                              !segments ? (
                                <div className='text-center'>
                                  <Loader />
                                </div>
                              ) : (
                                <FormGroup>
                                  <PanelSearch
                                    id='user-segments-list'
                                    className='no-pad'
                                    title='Segments'
                                    itemHeight={70}
                                    header={
                                      <Row className='table-header'>
                                        <Flex
                                          className='table-column px-3'
                                          style={{ maxWidth: '230px' }}
                                        >
                                          Name
                                        </Flex>
                                        <Flex className='table-column'>
                                          Description
                                        </Flex>
                                      </Row>
                                    }
                                    items={segments || []}
                                    renderRow={(
                                      { created_date, description, name }: any,
                                      i: number,
                                    ) => (
                                      <Row
                                        className='list-item clickable'
                                        space
                                        key={i}
                                        onClick={() => editSegment(segments[i])}
                                      >
                                        <Flex
                                          className='table-column px-3'
                                          style={{ maxWidth: '230px' }}
                                        >
                                          <div
                                            onClick={() =>
                                              editSegment(segments[i])
                                            }
                                          >
                                            <span
                                              data-test={`segment-${i}-name`}
                                              className='font-weight-medium'
                                            >
                                              {name}
                                            </span>
                                          </div>
                                          <div className='list-item-subtitle mt-1'>
                                            Created{' '}
                                            {moment(created_date).format(
                                              'DD/MMM/YYYY',
                                            )}
                                          </div>
                                        </Flex>
                                        <Flex className='table-column list-item-subtitle'>
                                          {description && (
                                            <div>{description}</div>
                                          )}
                                        </Flex>
                                      </Row>
                                    )}
                                    renderNoResults={
                                      <Panel
                                        title='Segments'
                                        className='no-pad'
                                      >
                                        <div className='search-list'>
                                          <Row className='list-item text-muted px-3'>
                                            This user is not a member of any
                                            segments.
                                          </Row>
                                        </div>
                                      </Panel>
                                    }
                                    filterRow={(
                                      { name }: any,
                                      searchString: string,
                                    ) =>
                                      name
                                        .toLowerCase()
                                        .indexOf(searchString.toLowerCase()) >
                                      -1
                                    }
                                  />
                                </FormGroup>
                              )
                            }
                          </IdentitySegmentsProvider>
                        </FormGroup>
                      </div>
                      <div className='col-md-12 mt-2'>
                        <FormGroup>
                          <CodeHelp
                            title='Managing user traits and segments'
                            snippets={Constants.codeHelp.USER_TRAITS(
                              environmentId,
                              identity?.identifier,
                            )}
                          />
                        </FormGroup>
                        <FormGroup>
                          <TryIt
                            title='Check to see what features and traits are coming back for this user'
                            environmentId={environmentId}
                            userId={
                              (identity && identity.identity.identifier) || id
                            }
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </>
                )
              }
            </IdentityProvider>
          </div>
        )}
      </Permission>
    </div>
  )
}

export default ConfigProvider(UserPage)
