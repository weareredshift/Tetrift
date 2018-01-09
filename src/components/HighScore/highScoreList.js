import React from 'react';
import { getHighScores } from '../../utils/api';
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

  render() {
    const { scores } = this.state;
    return (
      <ul className="leaderboard">
        {scores.map((score, index) => (
          <li key={ index }>
            <p>{index + 1}</p>
            <p>{score.name}</p>
            <p>{score.score}</p>
          </li>
        ))}
      </ul>
    );
  }
}

export default HighScoreList;
