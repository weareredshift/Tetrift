import React, { Component } from 'react';
import { func } from 'prop-types';
import './Loser.css';
import HighScoreList from '../HighScore/highScoreList';
import HighScoreForm from '../HighScore/highScoreForm';

class LoserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render () {
    const { score } = this.props;

    return (
      <div className="loser">
        <HighScoreList />
        <HighScoreForm score={ score } callback={ (response) => console.log(response) } />
        <h1>You Lose</h1>
        <span className="btn" onClick={ this.props.onRestart }>Restart</span>
      </div>
    );
  }
}

LoserScreen.propTypes = {
  onRestart: func
};

export default LoserScreen;
