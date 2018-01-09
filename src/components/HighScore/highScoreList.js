import React from 'react';
import { getHighScores } from '../../utils/api';

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
      <div>
        {scores.map((score, index) => (
          <div key={ index }>
            <p>{score.name}</p>
            <p>{score.score}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default HighScoreList;
