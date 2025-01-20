import React, { Component } from 'react'
import ProjectStore from 'common/stores/project-store'
import Token from './Token'
import ModalHR from './modals/ModalHR'
import Icon from './Icon'
import { getStore } from 'common/store'
import {
  createServersideEnvironmentKeys,
  deleteServersideEnvironmentKeys,
  getServersideEnvironmentKeys,
} from 'common/services/useServersideEnvironmentKey'

class CreateServerSideKeyModal extends Component {
  state = {}

  componentDidMount() {
    setTimeout(() => {
      document.getElementById('jsTokenName').focus()
    }, 500)
  }

  onSubmit = (e) => {
    Utils.preventDefault(e)
    if (this.state.name) {
      this.setState({
        isSaving: true,
      })
      this.props.onSubmit(this.state.name)
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className='modal-body'>
            <div className='mb-2'>
              This will create a Server-side Environment Key for the environment{' '}
              <strong>
                {ProjectStore.getEnvironment(this.props.environmentId).name}
              </strong>
              .
            </div>
            <InputGroup
              title='Key Name'
              placeholder='New Key'
              className='mb-2'
              id='jsTokenName'
              inputProps={{
                className: 'full-width modal-input',
              }}
              onChange={(e) =>
                this.setState({ name: Utils.safeParseEventValue(e) })
              }
            />
          </div>
          <ModalHR />
          <div className='modal-footer'>
            <Button onClick={closeModal} theme='secondary' className={'mr-2'}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!this.state.name || this.state.isSaving}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

class ServerSideSDKKeys extends Component {
  state = {
    isLoading: true,
  }

  static propTypes = {
    environmentId: propTypes.string.isRequired,
  }

  componentDidMount() {
    this.fetch(this.props.environmentId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.environmentId !== this.props.environmentId) {
      this.fetch(this.props.environmentId)
    }
  }

  createKey = () => {
    openModal(
      'Create Server-side Environment Keys',
      <CreateServerSideKeyModal
        environmentId={this.props.environmentId}
        onSubmit={(name) => {
          createServersideEnvironmentKeys(getStore(), {
            data: { name },
            environmentId: this.props.environmentId,
          })
            .then(() => this.fetch(this.props.environmentId))
            .finally(() => {
              closeModal()
            })
        }}
      />,
      'p-0',
    )
  }

  remove = (id, name) => {
    openConfirm({
      body: (
        <div>
          Are you sure you want to remove the SDK key <strong>{name}</strong>?
          This action cannot be undone.
        </div>
      ),
      destructive: true,
      onYes: () => {
        this.setState({ isSaving: true })
        deleteServersideEnvironmentKeys(getStore(), {
          environmentId: this.props.environmentId,
          id,
        })
          .then(() => this.fetch(this.props.environmentId))
          .finally(() => {
            this.setState({ isSaving: false })
          })
      },
      title: 'Delete Server-side Environment Keys',
      yesText: 'Confirm',
    })
  }

  fetch = (environmentId) => {
    this.setState({ isLoading: true })
    return getServersideEnvironmentKeys(
      getStore(),
      { environmentId },
      { forceRefetch: true },
    ).then((res) => {
      this.setState({ isLoading: false, keys: res.data })
    })
  }

  render() {
    return (
      <FormGroup className='my-4'>
        <div className='col-md-6'>
          <h5 className='mb-2'>Server-side Environment Keys</h5>
          <p className='fs-small lh-sm mb-0'>
            Flags can be evaluated locally within your own Server environments
            using our{' '}
            <Button
              theme='text'
              href='https://docs.flagsmith.com/clients/overview#server-side-sdks'
              target='__blank'
            >
              Server-side Environment Keys
            </Button>
            .
          </p>
          <p className='fs-small lh-sm mb-0'>
            Server-side SDKs should be initialised with a Server-side
            Environment Key.
          </p>
          <Button
            onClick={this.createKey}
            className='my-4'
            disabled={this.state.isSaving}
          >
            Create Server-side Environment Key
          </Button>
        </div>
        {this.state.isLoading && (
          <div className='text-center'>
            <Loader />
          </div>
        )}
        {this.state.keys && !!this.state.keys.length && (
          <PanelSearch
            id='org-members-list'
            title='Server-side Environment Keys'
            className='no-pad'
            items={this.state.keys}
            filterRow={(item, search) => {
              const strToSearch = `${item.name}`
              return (
                strToSearch.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            }}
            renderRow={({ id, key, name }) => (
              <Row className='list-item'>
                <Flex className='table-column px-3 font-weight-medium'>
                  {name}
                </Flex>
                <div className='table-column'>
                  <Token style={{ width: 280 }} token={key} />
                </div>
                <Button
                  onClick={() => {
                    Utils.copyToClipboard(key)
                  }}
                  className='ml-2 btn-with-icon'
                >
                  <Icon name='copy' width={20} fill='#656D7B' />
                </Button>
                <div className='table-column'>
                  <Button
                    onClick={() => this.remove(id, name)}
                    disabled={this.state.isSaving}
                    id='remove-feature'
                    className='btn btn-with-icon'
                  >
                    <Icon name='trash-2' width={20} fill='#656D7B' />
                  </Button>
                </div>
              </Row>
            )}
          />
        )}
      </FormGroup>
    )
  }
}
export default ServerSideSDKKeys
