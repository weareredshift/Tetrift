import React, { Component } from 'react';
import { func, number } from 'prop-types';
import HighScoreList from '../HighScore/highScoreList';
import HighScoreForm from '../HighScore/highScoreForm';
import './Loser.css';

class LoserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scoreSubmitted: false,
      error: null,
      userTimestamp: null
    };
  }

  render () {
    const { score, onRestart, onMainMenu } = this.props;
    const { scoreSubmitted, userTimestamp } = this.state;

    return (
      <div className="loser">
        <h2 className="title">Nice work, buddy</h2>
        <p style={ { marginBottom: '4rem' } }>Your score was <em>{ score }</em></p>

        { scoreSubmitted
          ? <div>
            <HighScoreList userTimestamp={ userTimestamp } />
            <span className="btn" onClick={ onRestart } style={ { margin: '0 20px' } }>Play again</span>
            <span className="btn" onClick={ onMainMenu } style={ { margin: '0 20px' } }>Main menu</span>
          </div>
          : <HighScoreForm
            score={ score }
            callback={ (response) => this.setState({ scoreSubmitted: true, userTimestamp: response && response[0].date }) }
          />
        }
      </div>
    );
  }
}

LoserScreen.propTypes = {
  onMainMenu: func,
  onRestart: func,
  score: number
};

export default LoserScreen;
