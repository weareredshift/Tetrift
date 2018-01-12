import React from 'react';
import { getHighScores } from '../../utils/api';
import { getOrdinalSuffix } from '../../utils/utils';
import { string } from 'prop-types';
import './Leaderboard.css';

class HighScoreList extends React.Component {
  constructor() {
    super();
    this.state = {
      scores: []
    };
  }

  componentWillMount() {
    getHighScores('tetrift')
      .then(scores => this.setState({ scores: scores }));
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.scores === this.state.scores) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { scores } = this.state;
    const { userTimestamp } = this.props;

    return (
      <div className="leaderboard">
        <h3 className="title">Leaderboard</h3>

        <ul>
          { scores.map((score, index) => (
            <li key={ index } className={ userTimestamp === score.date ? 'is-user' : '' }>
              <span className="placement">{ `${index + 1}${getOrdinalSuffix(index + 1)}` }</span>
              <span className="name">{score.name}</span>
              <span className="score">{score.score}</span>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}

HighScoreList.propTypes = {
  userTimestamp: string
};

export default HighScoreList;
