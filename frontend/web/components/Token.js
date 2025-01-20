import React, { Component } from 'react'

class Token extends Component {
  constructor(props) {
    super()
    this.state = {
      showToken: !!props.show,
    }
  }

  render() {
    if (!this.props.token) return null
    return (
      <Row className='flex-nowrap'>
        <Input
          inputProps={{
            readOnly: true,
          }}
          value={this.props.token}
          style={this.props.style}
          className={`${
            this.state.showToken ? 'font-weight-bold' : ''
          } full-width`}
          type='password'
        />
        {this.props.show && (
          <Button
            theme='outline'
            className='ml-2'
            onClick={() => {
              Utils.copyToClipboard(this.props.token)
            }}
          >
            Copy
          </Button>
        )}
      </Row>
    )
  }
}

export default Token
