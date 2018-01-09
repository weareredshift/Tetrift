import React, { Component } from 'react';
import PropTypes from 'prop-types';


class WinnerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  render () {
    return (
      <div>
        <h1>You Win</h1>
        <button onClick={ this.props.onRestart }>Restart</button>
      </div>
    );
  }
}

export default WinnerScreen;
