import React, { Component } from 'react';
import { func } from 'prop-types';

class LoserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <div>
        <h1>You Lose</h1>
        <button onClick={ this.props.onRestart }>Restart</button>
      </div>
    );
  }
}

LoserScreen.propTypes = {
  onRestart: func
};

export default LoserScreen;
