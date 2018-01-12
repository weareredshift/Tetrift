import React from 'react';
import { func, number } from 'prop-types';

import { saveHighScore } from '../../utils/api';

class HighScoreForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name } = this.state;

    if (name.length > 0) {
      const { score, callback } = this.props;
      saveHighScore('tetrift', name, score)
        .then(response => callback(response));
    }
  }

  render() {
    const { callback } = this.props;
    return (
      <form onSubmit={ this.handleSubmit }>
        <input placeholder="Enter your name" type="text" value={ this.state.name } onChange={ this.handleChange } />
        <button className="btn" type="submit">
          Submit score
        </button>

        <span className="btn btn--secondary" onClick={ () => callback(undefined) }>Skip to leaderboard</span>
      </form>
    );
  }
}

HighScoreForm.propTypes = {
  score: number,
  callback: func
};

export default HighScoreForm;
