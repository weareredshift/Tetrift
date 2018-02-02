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
    const topTen = scores.slice(0, 10);
    const notTopTen = topTen.filter(score => score.date === userTimestamp).length <= 0;

    const user = {};
    if (notTopTen) {
      user.data = scores.find(score => score.date === userTimestamp);
      user.placement = scores.findIndex(score => score.date === userTimestamp) + 1;
    }

    return (
      <div className="leaderboard">
        <h3 className="title">Leaderboard top ten</h3>

        <ul className="leaderbord__list">
          { topTen.map((score, index) => (
            <li key={ index } className={ userTimestamp === score.date ? 'is-user' : '' }>
              <span className="placement">{ `${index + 1}${getOrdinalSuffix(index + 1)}` }</span>
              <span className="name">{score.name}</span>
              <span className="score">{score.score}</span>
            </li>
          )) }

          { notTopTen && user.data &&
            <li className="is-user not-top-ten">
              <span className="placement">{ `${user.placement}${getOrdinalSuffix(user.placement)}` }</span>
              <span className="name">{user.data.name}</span>
              <span className="score">{user.data.score}</span>
            </li>
          }
        </ul>
      </div>
    );
  }
}

HighScoreList.propTypes = {
  userTimestamp: string
};

export default HighScoreList;
