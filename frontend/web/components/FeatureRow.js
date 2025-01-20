import React, { Component } from 'react'
import TagValues from './tags/TagValues'
import ConfirmToggleFeature from './modals/ConfirmToggleFeature'
import ConfirmRemoveFeature from './modals/ConfirmRemoveFeature'
import CreateFlagModal from './modals/CreateFlag'
import ProjectStore from 'common/stores/project-store'
import Constants from 'common/constants'
import { getProtectedTags } from 'common/utils/getProtectedTags'
import Icon from './Icon'
import FeatureValue from './FeatureValue'
import FeatureAction from './FeatureAction'
import { getViewMode } from 'common/useViewMode'
import classNames from 'classnames'
import Tag from './tags/Tag'
import Button from './base/forms/Button'
import SegmentOverridesIcon from './SegmentOverridesIcon'
import IdentityOverridesIcon from './IdentityOverridesIcon'
import StaleFlagWarning from './StaleFlagWarning'

export const width = [200, 70, 55, 70, 450]
class TheComponent extends Component {
  static contextTypes = {
    router: propTypes.object.isRequired,
  }

  state = {}

  confirmToggle = () => {
    const {
      environmentFlags,
      environmentId,
      projectFlag,
      projectId,
      toggleFlag,
    } = this.props
    const { id } = projectFlag
    openModal(
      'Toggle Feature',
      <ConfirmToggleFeature
        environmentId={this.props.environmentId}
        projectFlag={projectFlag}
        environmentFlag={environmentFlags[id]}
        cb={() => {
          toggleFlag(
            projectId,
            environmentId,
            projectFlag,
            environmentFlags[id],
          )
        }}
      />,
      'p-0',
    )
  }

  componentDidMount() {
    const { environmentFlags, projectFlag } = this.props
    const { feature, tab } = Utils.fromParam()
    const { id } = projectFlag
    if (`${id}` === feature) {
      this.editFeature(projectFlag, environmentFlags[id])
    }
  }

  copyFeature = (e) => {
    const { projectFlag } = this.props
    e?.stopPropagation()?.()
    e?.currentTarget?.blur?.()
    Utils.copyToClipboard(projectFlag.name)
  }
  confirmRemove = (projectFlag, cb) => {
    openModal2(
      'Remove Feature',
      <ConfirmRemoveFeature
        environmentId={this.props.environmentId}
        projectFlag={projectFlag}
        cb={cb}
      />,
      'p-0',
    )
  }

  editFeature = (projectFlag, environmentFlag, tab) => {
    if (this.props.disableControls) {
      return
    }
    API.trackEvent(Constants.events.VIEW_FEATURE)

    history.replaceState(
      {},
      null,
      `${document.location.pathname}?feature=${projectFlag.id}&tab=${
        tab || Utils.fromParam().tab || 'value'
      }`,
    )
    openModal(
      <Row>
        {this.props.permission ? 'Edit Feature' : 'Feature'}: {projectFlag.name}
        <Button
          onClick={() => {
            Utils.copyToClipboard(projectFlag.name)
          }}
          theme='icon'
          className='ms-2'
        >
          <Icon name='copy' />
        </Button>
      </Row>,
      <CreateFlagModal
        history={this.context.router.history}
        environmentId={this.props.environmentId}
        projectId={this.props.projectId}
        projectFlag={projectFlag}
        noPermissions={!this.props.permission}
        environmentFlag={environmentFlag}
        tab={tab}
        flagId={environmentFlag.id}
      />,
      'side-modal create-feature-modal',
      () => {
        history.replaceState({}, null, `${document.location.pathname}`)
      },
    )
  }

  render() {
    const {
      disableControls,
      environmentFlags,
      environmentId,
      permission,
      projectFlag,
      projectId,
      removeFlag,
    } = this.props
    const { created_date, description, id, name } = this.props.projectFlag
    const readOnly =
      this.props.readOnly || Utils.getFlagsmithHasFeature('read_only_mode')
    const protectedTags = getProtectedTags(projectFlag, projectId)
    const environment = ProjectStore.getEnvironment(environmentId)
    const changeRequestsEnabled = Utils.changeRequestsEnabled(
      environment && environment.minimum_change_request_approvals,
    )
    const showPlusIndicator =
      projectFlag?.is_num_identity_overrides_complete === false

    const onChange = () => {
      if (disableControls) {
        return
      }
      if (
        projectFlag?.multivariate_options?.length ||
        Utils.changeRequestsEnabled(
          environment.minimum_change_request_approvals,
        )
      ) {
        this.editFeature(projectFlag, environmentFlags[id])
        return
      }
      this.confirmToggle()
    }
    const isCompact = getViewMode() === 'compact'
    if (this.props.condensed) {
      return (
        <Flex
          onClick={() => {
            if (disableControls) return
            !readOnly && this.editFeature(projectFlag, environmentFlags[id])
          }}
          style={{
            ...(this.props.style || {}),
          }}
          className={classNames(
            'flex-row',
            { 'fs-small': isCompact },
            this.props.className,
          )}
        >
          <div
            className={`table-column ${this.props.fadeEnabled && 'faded'}`}
            style={{ width: '80px' }}
          >
            <Row>
              <Switch
                disabled={!permission || readOnly}
                data-test={`feature-switch-${this.props.index}${
                  environmentFlags[id] && environmentFlags[id].enabled
                    ? '-on'
                    : '-off'
                }`}
                checked={environmentFlags[id] && environmentFlags[id].enabled}
                onChange={onChange}
              />
            </Row>
          </div>
          <Flex className={'table-column clickable'}>
            <Row>
              <div
                onClick={() =>
                  permission &&
                  !readOnly &&
                  this.editFeature(projectFlag, environmentFlags[id])
                }
                className={`flex-fill ${this.props.fadeValue ? 'faded' : ''}`}
              >
                <FeatureValue
                  value={
                    environmentFlags[id] &&
                    environmentFlags[id].feature_state_value
                  }
                  data-test={`feature-value-${this.props.index}`}
                />
              </div>

              <SegmentOverridesIcon
                onClick={(e) => {
                  e.stopPropagation()
                  this.editFeature(
                    projectFlag,
                    environmentFlags[id],
                    'segment-overrides',
                  )
                }}
                count={projectFlag.num_segment_overrides}
              />
              <IdentityOverridesIcon
                onClick={(e) => {
                  e.stopPropagation()
                  this.editFeature(
                    projectFlag,
                    environmentFlags[id],
                    'identity-overrides',
                  )
                }}
                count={projectFlag.num_identity_overrides}
                showPlusIndicator={showPlusIndicator}
              />
            </Row>
          </Flex>
        </Flex>
      )
    }
    return (
      <Row
        className={classNames(
          `list-item ${readOnly ? '' : 'clickable'} ${
            isCompact ? 'py-0 list-item-xs fs-small' : 'py-1'
          }`,
          this.props.className,
        )}
        key={id}
        space
        data-test={`feature-item-${this.props.index}`}
        onClick={() =>
          !readOnly && this.editFeature(projectFlag, environmentFlags[id])
        }
      >
        <Flex className='table-column'>
          <Row>
            <Flex>
              <Row>
                <Row
                  className='font-weight-medium'
                  style={{
                    lineHeight: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  <span>
                    {created_date ? (
                      <Tooltip place='right' title={<span>{name}</span>}>
                        {isCompact && description ? `${description}` : null}
                      </Tooltip>
                    ) : (
                      name
                    )}
                  </span>
                  <Button
                    onClick={this.copyFeature}
                    theme='icon'
                    className='ms-2 me-2'
                  >
                    <Icon name='copy' />
                  </Button>
                </Row>
                <SegmentOverridesIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    this.editFeature(projectFlag, environmentFlags[id], 1)
                  }}
                  count={projectFlag.num_segment_overrides}
                />
                <IdentityOverridesIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    this.editFeature(projectFlag, environmentFlags[id], 1)
                  }}
                  count={projectFlag.num_identity_overrides}
                  showPlusIndicator={showPlusIndicator}
                />
                {projectFlag.is_server_key_only && (
                  <Tooltip
                    title={
                      <span
                        className='chip me-2 chip--xs bg-primary text-white'
                        style={{ border: 'none' }}
                      >
                        <span>{'Server-side only'}</span>
                      </span>
                    }
                    place='top'
                  >
                    {
                      'Prevent this feature from being accessed with client-side SDKs.'
                    }
                  </Tooltip>
                )}
                <TagValues projectId={`${projectId}`} value={projectFlag.tags}>
                  {projectFlag.is_archived && (
                    <Tag className='chip--xs' tag={Constants.archivedTag} />
                  )}
                </TagValues>
                {!!isCompact && <StaleFlagWarning projectFlag={projectFlag} />}
              </Row>
              {!isCompact && <StaleFlagWarning projectFlag={projectFlag} />}
              {description && !isCompact && (
                <div
                  className='list-item-subtitle'
                  style={{ lineHeight: '20px', width: width[4] }}
                >
                  {description}
                </div>
              )}
            </Flex>
          </Row>
        </Flex>
        <div className='table-column' style={{ width: width[0] }}>
          <FeatureValue
            onClick={() =>
              !readOnly && this.editFeature(projectFlag, environmentFlags[id])
            }
            value={
              environmentFlags[id] && environmentFlags[id].feature_state_value
            }
            data-test={`feature-value-${this.props.index}`}
          />
        </div>
        <div
          className='table-column'
          style={{ width: width[1] }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Switch
            disabled={!permission || readOnly}
            data-test={`feature-switch-${this.props.index}${
              environmentFlags[id] && environmentFlags[id].enabled
                ? '-on'
                : '-off'
            }`}
            checked={environmentFlags[id] && environmentFlags[id].enabled}
            onChange={onChange}
          />
        </div>

        <div
          className='table-column'
          style={{ width: isCompact ? width[2] : width[3] }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <FeatureAction
            projectId={projectId}
            featureIndex={this.props.index}
            readOnly={readOnly}
            protectedTags={protectedTags}
            tags={projectFlag.tags}
            isCompact={isCompact}
            hideAudit={
              AccountStore.getOrganisationRole() !== 'ADMIN' ||
              this.props.hideAudit
            }
            hideRemove={this.props.hideRemove}
            hideHistory={!environment?.use_v2_feature_versioning}
            onShowHistory={() => {
              if (disableControls) return
              this.editFeature(projectFlag, environmentFlags[id], 'history')
            }}
            onShowAudit={() => {
              if (disableControls) return
              this.context.router.history.push(
                `/project/${projectId}/audit-log?env=${environment.id}&search=${projectFlag.name}`,
              )
            }}
            onRemove={() => {
              if (disableControls) return
              this.confirmRemove(projectFlag, () => {
                removeFlag(projectId, projectFlag)
              })
            }}
            onCopyName={this.copyFeature}
          />
        </div>
      </Row>
    )
  }
}

export default TheComponent
