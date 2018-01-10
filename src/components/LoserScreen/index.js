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
    const { score } = this.props;
    const { scoreSubmitted, userTimestamp } = this.state;

    return (
      <div className="loser">
        <h2 className="title">You Lose!</h2>
        <p style={ { marginBottom: '6rem' } }>Your score was <em>{ score }</em></p>

        { scoreSubmitted
          ? <div>
            <HighScoreList userTimestamp={ userTimestamp } />
            <span className="btn" onClick={ this.props.onRestart } style={ { margin: '0 20px' } }>Play again</span>
            <span className="btn" style={ { margin: '0 20px' } }>Main menu</span>
          </div>
          : <HighScoreForm
            score={ score }
            callback={ (response) => this.setState({ scoreSubmitted: true, userTimestamp: response[0].date }) }
          />
        }
      </div>
    );
  }
}

LoserScreen.propTypes = {
  onRestart: func,
  score: number
};

export default LoserScreen;
