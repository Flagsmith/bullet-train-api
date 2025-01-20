// import propTypes from 'prop-types';
import React, { Component } from 'react'
import EnvironmentSelect from './EnvironmentSelect'
import data from 'common/data/base/_data'
import ProjectStore from 'common/stores/project-store'
import FeatureRow from './FeatureRow'
import FeatureListStore from 'common/stores/feature-list-store'
import ConfigProvider from 'common/providers/ConfigProvider'
import Permission from 'common/providers/Permission'
import Tag from './tags/Tag'
import Icon from './Icon'
import Constants from 'common/constants'
import Button from './base/forms/Button'
import Tooltip from './Tooltip'

const featureNameWidth = 300

class CompareEnvironments extends Component {
  static displayName = 'CompareEnvironments'

  static propTypes = {}

  static contextTypes = {
    router: propTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      environmentLeft: props.environmentId,
      environmentRight: '',
      isLoading: true,
      projectFlagsLeft: null,
      projectFlagsRight: null,
      showArchived: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.environmentLeft !== prevState.environmentLeft ||
      this.state.environmentRight !== prevState.environmentRight
    ) {
      this.fetch()
    }
  }

  fetch = () => {
    this.setState({ isLoading: true })
    return Promise.all([
      data.get(
        `${Project.api}projects/${
          this.props.projectId
        }/features/?page_size=999&environment=${ProjectStore.getEnvironmentIdFromKey(
          this.state.environmentLeft,
        )}`,
      ),
      data.get(
        `${Project.api}projects/${
          this.props.projectId
        }/features/?page_size=999&environment=${ProjectStore.getEnvironmentIdFromKey(
          this.state.environmentRight,
        )}`,
      ),
      data.get(
        `${Project.api}environments/${this.state.environmentLeft}/featurestates/?page_size=999`,
      ),
      data.get(
        `${Project.api}environments/${this.state.environmentRight}/featurestates/?page_size=999`,
      ),
    ]).then(
      ([
        environmentLeftProjectFlags,
        environmentRightProjectFlags,
        environmentLeftFlags,
        environmentRightFlags,
      ]) => {
        const changes = []
        const same = []
        _.each(
          _.sortBy(environmentLeftProjectFlags.results, (p) => p.name),
          (projectFlagLeft) => {
            const projectFlagRight = environmentRightProjectFlags.results?.find(
              (projectFlagRight) => projectFlagRight.id === projectFlagLeft.id,
            )
            const leftSide = environmentLeftFlags.results.find(
              (v) => v.feature === projectFlagLeft.id,
            )
            const rightSide = environmentRightFlags.results.find(
              (v) => v.feature === projectFlagLeft.id,
            )
            const change = {
              leftEnabled: leftSide.enabled,
              leftEnvironmentFlag: leftSide,
              leftValue: leftSide.feature_state_value,
              projectFlagLeft,
              projectFlagRight,
              rightEnabled: rightSide.enabled,
              rightEnvironmentFlag: rightSide,
              rightValue: rightSide.feature_state_value,
            }
            change.enabledChanged = change.rightEnabled !== change.leftEnabled
            change.valueChanged = change.rightValue !== change.leftValue
            if (
              change.enabledChanged ||
              change.valueChanged ||
              projectFlagLeft.num_identity_overrides ||
              projectFlagLeft.num_segment_overrides ||
              projectFlagRight.num_identity_overrides ||
              projectFlagRight.num_segment_overrides
            ) {
              changes.push(change)
            } else {
              same.push(change)
            }
          },
        )
        this.setState({
          changes,
          environmentLeftFlags: _.keyBy(
            environmentLeftFlags.results,
            'feature',
          ),
          environmentRightFlags: _.keyBy(
            environmentRightFlags.results,
            'feature',
          ),
          isLoading: false,
          projectFlagsLeft: environmentLeftProjectFlags.results,
          projectFlagsRight: environmentLeftProjectFlags.results,
          same,
        })
      },
    )
  }

  onSave = () => this.fetch()

  filter = (items) => {
    if (!items) return items

    return items.filter((v) => {
      if (this.state.showArchived) {
        return true
      }
      return !v.projectFlagLeft.is_archived
    })
  }

  render() {
    return (
      <div>
        <div className='col-md-8'>
          <h5 className='mb-1'>Compare Environments</h5>
          <p className='fs-small mb-4 lh-sm'>
            Compare feature flag changes across environments.
          </p>
        </div>
        <Row>
          <Row>
            <div style={{ width: featureNameWidth }}>
              <EnvironmentSelect
                ignoreAPIKey={
                  this.state.environmentRight
                    ? [this.state.environmentRight]
                    : undefined
                }
                projectId={this.props.projectId}
                onChange={(environmentLeft) =>
                  this.setState({ environmentLeft })
                }
                value={this.state.environmentLeft}
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

            <div style={{ width: featureNameWidth }}>
              <EnvironmentSelect
                projectId={this.props.projectId}
                ignore={
                  this.state.environmentLeft
                    ? [this.state.environmentLeft]
                    : undefined
                }
                onChange={(environmentRight) =>
                  this.setState({ environmentRight })
                }
                value={this.state.environmentRight}
              />
            </div>
          </Row>
        </Row>

        {this.state.environmentLeft && this.state.environmentRight ? (
          <FeatureListProvider onSave={this.onSave} onError={this.onError}>
            {({}, { removeFlag, toggleFlag }) => {
              const renderRow = (p, i, fadeEnabled, fadeValue) => {
                const environmentLeft = ProjectStore.getEnvironment(
                  this.state.environmentLeft,
                )
                const environmentRight = ProjectStore.getEnvironment(
                  this.state.environmentRight,
                )
                return (
                  <Row className='list-item'>
                    <div
                      className='table-column px-3'
                      style={{ width: featureNameWidth }}
                    >
                      <Tooltip
                        title={
                          <Row className={'no-wrap'}>
                            <div
                              style={{ wordWrap: 'break-word' }}
                              className='font-weight-medium'
                            >
                              {p.projectFlagLeft.name}
                            </div>
                            <Button
                              onClick={() => {
                                Utils.copyToClipboard(p.projectFlagLeft.name)
                              }}
                              theme='icon'
                              className='ms-2 me-2'
                            >
                              <Icon name='copy' />
                            </Button>
                          </Row>
                        }
                      >
                        {p.projectFlagLeft.description}
                      </Tooltip>
                    </div>
                    <Permission
                      level='environment'
                      tags={p.projectFlagLeft.tags}
                      permission={Utils.getManageFeaturePermission(
                        Utils.changeRequestsEnabled(
                          environmentLeft.minimum_change_request_approvals,
                        ),
                      )}
                      id={environmentLeft.api_key}
                    >
                      {({ permission }) => (
                        <FeatureRow
                          condensed
                          isCompareEnv
                          fadeEnabled={fadeEnabled}
                          fadeValue={fadeValue}
                          environmentFlags={this.state.environmentLeftFlags}
                          projectFlags={this.state.projectFlagsLeft}
                          permission={permission}
                          environmentId={this.state.environmentLeft}
                          projectId={this.props.projectId}
                          index={i}
                          canDelete={permission}
                          toggleFlag={toggleFlag}
                          removeFlag={removeFlag}
                          projectFlag={p.projectFlagLeft}
                        />
                      )}
                    </Permission>
                    <Permission
                      level='environment'
                      tags={p.projectFlagLeft.tags}
                      permission={Utils.getManageFeaturePermission(
                        Utils.changeRequestsEnabled(
                          environmentRight.minimum_change_request_approvals,
                        ),
                      )}
                      id={environmentRight.api_key}
                    >
                      {({ permission }) => (
                        <FeatureRow
                          condensed
                          isCompareEnv
                          fadeEnabled={fadeEnabled}
                          fadeValue={fadeValue}
                          environmentFlags={this.state.environmentRightFlags}
                          projectFlags={this.state.projectFlagsRight}
                          permission={permission}
                          environmentId={this.state.environmentRight}
                          projectId={this.props.projectId}
                          index={i}
                          canDelete={permission}
                          toggleFlag={toggleFlag}
                          removeFlag={removeFlag}
                          projectFlag={p.projectFlagRight}
                        />
                      )}
                    </Permission>
                  </Row>
                )
              }
              return (
                <div>
                  {this.state.isLoading && (
                    <div className='text-center'>
                      <Loader />
                    </div>
                  )}
                  {!this.state.isLoading &&
                    (!this.state.changes || !this.state.changes.length) && (
                      <div className='text-center mt-2'>
                        These environments have no flag differences
                      </div>
                    )}
                  {!this.state.isLoading &&
                    this.state.changes &&
                    !!this.state.changes.length && (
                      <div className='mt-4' style={{ minWidth: 800 }}>
                        <PanelSearch
                          title={'Changed Flags'}
                          searchPanel={
                            <Row className='mb-2'>
                              <Tag
                                selected={this.state.showArchived}
                                onClick={() => {
                                  FeatureListStore.isLoading = true
                                  this.setState({
                                    showArchived: !this.state.showArchived,
                                  })
                                }}
                                className='px-2 py-2 ml-2 mr-2'
                                tag={Constants.archivedTag}
                              />
                            </Row>
                          }
                          header={
                            <Row className='table-header'>
                              <div
                                className='table-column px-3'
                                style={{ width: featureNameWidth }}
                              >
                                Name
                              </div>
                              <Flex className='flex-row'>
                                <div
                                  className='table-column'
                                  style={{ width: '80px' }}
                                >
                                  {
                                    ProjectStore.getEnvironment(
                                      this.state.environmentLeft,
                                    ).name
                                  }
                                </div>
                                <Flex className='table-column'></Flex>
                              </Flex>
                              <Flex className='flex-row'>
                                <div
                                  className='table-column'
                                  style={{ width: '80px' }}
                                >
                                  {
                                    ProjectStore.getEnvironment(
                                      this.state.environmentRight,
                                    ).name
                                  }
                                </div>
                                <Flex className='table-column'></Flex>
                              </Flex>
                            </Row>
                          }
                          className='no-pad mt-2'
                          items={this.filter(this.state.changes)}
                          renderRow={(p, i) =>
                            renderRow(p, i, !p.enabledChanged, !p.valueChanged)
                          }
                        />
                      </div>
                    )}
                  {!this.state.isLoading &&
                    this.state.same &&
                    !!this.state.same.length && (
                      <div style={{ minWidth: 800 }}>
                        <div className='mt-4'>
                          <PanelSearch
                            title={'Unchanged Flags'}
                            header={
                              <Row className='table-header'>
                                <div
                                  className='table-column px-3'
                                  style={{ width: featureNameWidth }}
                                >
                                  Name
                                </div>
                                <Flex className='flex-row'>
                                  <div
                                    className='table-column'
                                    style={{ width: '80px' }}
                                  >
                                    {
                                      ProjectStore.getEnvironment(
                                        this.state.environmentLeft,
                                      ).name
                                    }
                                  </div>
                                  <Flex className='table-column'>Value</Flex>
                                </Flex>
                                <Flex className='flex-row'>
                                  <div
                                    className='table-column'
                                    style={{ width: '80px' }}
                                  >
                                    {
                                      ProjectStore.getEnvironment(
                                        this.state.environmentRight,
                                      ).name
                                    }
                                  </div>
                                  <Flex className='table-column'>Value</Flex>
                                </Flex>
                              </Row>
                            }
                            className='no-pad mt-2'
                            items={this.filter(this.state.same)}
                            renderRow={(p, i) =>
                              renderRow(
                                p,
                                i,
                                !p.enabledChanged,
                                !p.valueChanged,
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                </div>
              )
            }}
          </FeatureListProvider>
        ) : (
          ''
        )}
      </div>
    )
  }
}

module.exports = ConfigProvider(CompareEnvironments)
