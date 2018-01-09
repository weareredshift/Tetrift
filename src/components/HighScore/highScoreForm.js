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
    const { score, callback } = this.props;
    saveHighScore('tetrift', name, score)
      .then(response => callback(response));
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <input type="text" value={ this.state.name } onChange={ this.handleChange } />
        <button type="submit">
          Submit
        </button>
      </form>
    );
  }
}

HighScoreForm.propTypes = {
  score: number,
  callback: func
};

export default HighScoreForm;
