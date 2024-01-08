import React, { Component } from 'react'
import TagValues from './tags/TagValues'
import ConfirmToggleFeature from './modals/ConfirmToggleFeature'
import ConfirmRemoveFeature from './modals/ConfirmRemoveFeature'
import CreateFlagModal from './modals/CreateFlag'
import ProjectStore from 'common/stores/project-store'
import Constants from 'common/constants'
import { hasProtectedTag } from 'common/utils/hasProtectedTag'
import SegmentsIcon from './svg/SegmentsIcon'
import UsersIcon from './svg/UsersIcon' // we need this to make JSX compile
import Icon from './Icon'
import FeatureValue from './FeatureValue'
import FeatureAction from './FeatureAction'
import { getViewMode } from 'common/useViewMode'
import classNames from 'classnames'
import Tag from './tags/Tag'

export const width = [200, 70, 55, 70, 450]
class TheComponent extends Component {
  static contextTypes = {
    router: propTypes.object.isRequired,
  }

  state = {}

  confirmToggle = (projectFlag, environmentFlag, cb) => {
    openModal(
      'Toggle Feature',
      <ConfirmToggleFeature
        environmentId={this.props.environmentId}
        projectFlag={projectFlag}
        environmentFlag={environmentFlag}
        cb={cb}
      />,
      'p-0',
    )
  }

  componentDidMount() {
    const { environmentFlags, projectFlag } = this.props
    const { feature, tab } = Utils.fromParam()
    const { id } = projectFlag
    if (`${id}` === feature) {
      this.editFeature(projectFlag, environmentFlags[id], tab)
    }
  }

  confirmRemove = (projectFlag, cb) => {
    openModal(
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
      `${document.location.pathname}?feature=${projectFlag.id}`,
    )
    openModal(
      `${this.props.permission ? 'Edit Feature' : 'Feature'}: ${
        projectFlag.name
      }`,
      <CreateFlagModal
        isEdit
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
      projectFlags,
      projectId,
      removeFlag,
      toggleFlag,
    } = this.props
    const { created_date, description, id, name } = this.props.projectFlag
    const readOnly =
      this.props.readOnly || Utils.getFlagsmithHasFeature('read_only_mode')
    const isProtected = hasProtectedTag(projectFlag, projectId)
    const environment = ProjectStore.getEnvironment(environmentId)
    const changeRequestsEnabled = Utils.changeRequestsEnabled(
      environment && environment.minimum_change_request_approvals,
    )
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
          className={
            (classNames('flex-row'),
            { 'fs-small': isCompact },
            this.props.className)
          }
        >
          <div
            className={`table-column ${this.props.fadeEnabled && 'faded'}`}
            style={{ width: '120px' }}
          >
            <Switch
              disabled={!permission || readOnly}
              data-test={`feature-switch-${this.props.index}${
                environmentFlags[id] && environmentFlags[id].enabled
                  ? '-on'
                  : '-off'
              }`}
              checked={environmentFlags[id] && environmentFlags[id].enabled}
              onChange={() => {
                if (disableControls) return
                if (changeRequestsEnabled) {
                  this.editFeature(projectFlag, environmentFlags[id])
                  return
                }
                this.confirmToggle(
                  projectFlag,
                  environmentFlags[id],
                  (environments) => {
                    toggleFlag(
                      _.findIndex(projectFlags, { id }),
                      environments,
                      null,
                      this.props.environmentFlags,
                      this.props.projectFlags,
                    )
                  },
                )
              }}
            />
          </div>
          <Flex
            className={`table-column clickable ${
              this.props.fadeValue && 'faded'
            }`}
          >
            <FeatureValue
              onClick={() =>
                permission &&
                !readOnly &&
                this.editFeature(projectFlag, environmentFlags[id])
              }
              value={
                environmentFlags[id] && environmentFlags[id].feature_state_value
              }
              data-test={`feature-value-${this.props.index}`}
            />
          </Flex>
        </Flex>
      )
    }
    return (
      <Row
        className={classNames(
          `list-item ${readOnly ? '' : 'clickable'} ${
            isCompact
              ? 'py-0 list-item-xs fs-small'
              : this.props.widget
              ? 'py-1'
              : 'py-2'
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
              <Row
                className='font-weight-medium'
                style={{
                  alignItems: 'start',
                  lineHeight: 1,
                  rowGap: 4,
                  wordBreak: 'break-all',
                }}
              >
                <span className='me-2'>
                  {created_date ? (
                    <Tooltip
                      place='right'
                      title={
                        <span>
                          {name}
                          <span className={'ms-1'}></span>
                          <Icon name='info-outlined' />
                        </span>
                      }
                    >
                      {isCompact && description
                        ? `${description}<br/>Created ${moment(
                            created_date,
                          ).format('Do MMM YYYY HH:mma')}`
                        : `Created ${moment(created_date).format(
                            'Do MMM YYYY HH:mma',
                          )}`}
                    </Tooltip>
                  ) : (
                    name
                  )}
                </span>

                {!!projectFlag.num_segment_overrides && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      this.editFeature(projectFlag, environmentFlags[id], 1)
                    }}
                  >
                    <Tooltip
                      title={
                        <span
                          className='chip me-2 chip--xs bg-primary text-white'
                          style={{ border: 'none' }}
                        >
                          <SegmentsIcon className='chip-svg-icon' />
                          <span>{projectFlag.num_segment_overrides}</span>
                        </span>
                      }
                      place='top'
                    >
                      {`${projectFlag.num_segment_overrides} Segment Override${
                        projectFlag.num_segment_overrides !== 1 ? 's' : ''
                      }`}
                    </Tooltip>
                  </div>
                )}
                {!!projectFlag.num_identity_overrides && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      this.editFeature(projectFlag, environmentFlags[id], 2)
                    }}
                  >
                    <Tooltip
                      title={
                        <span
                          className='chip me-2 chip--xs bg-primary text-white'
                          style={{ border: 'none' }}
                        >
                          <UsersIcon className='chip-svg-icon' />
                          <span>{projectFlag.num_identity_overrides}</span>
                        </span>
                      }
                      place='top'
                    >
                      {`${
                        projectFlag.num_identity_overrides
                      } Identity Override${
                        projectFlag.num_identity_overrides !== 1 ? 's' : ''
                      }`}
                    </Tooltip>
                  </div>
                )}
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
                {projectFlag.is_archived && (
                  <Tag className='chip--xs' tag={Constants.archivedTag} />
                )}
                <TagValues
                  inline
                  projectId={`${projectId}`}
                  value={projectFlag.tags}
                />
              </Row>
              {description && !isCompact && (
                <div
                  className='list-item-subtitle mt-1'
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
            onChange={() => {
              if (
                Utils.changeRequestsEnabled(
                  environment.minimum_change_request_approvals,
                )
              ) {
                this.editFeature(projectFlag, environmentFlags[id])
                return
              }
              this.confirmToggle(
                projectFlag,
                environmentFlags[id],
                (environments) => {
                  toggleFlag(_.findIndex(projectFlags, { id }), environments)
                },
              )
            }}
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
            isProtected={isProtected}
            isCompact={isCompact}
            hideAudit={
              AccountStore.getOrganisationRole() !== 'ADMIN' ||
              this.props.hideAudit
            }
            hideRemove={this.props.hideRemove}
            onShowHistory={() => {
              if (disableControls) return
              this.context.router.history.push(
                `/project/${projectId}/environment/${environmentId}/audit-log?env=${environment.id}&search=${projectFlag.name}`,
              )
            }}
            onRemove={() => {
              if (disableControls) return
              this.confirmRemove(projectFlag, () => {
                removeFlag(projectId, projectFlag)
              })
            }}
            onCopyName={() => {
              navigator.clipboard.writeText(name)
              toast('Copied to clipboard')
            }}
          />
        </div>
      </Row>
    )
  }
}

export default TheComponent
