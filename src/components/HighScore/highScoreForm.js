import React from 'react';
import ReactDOM from 'react-dom';
import { func, number } from 'prop-types';

import { saveHighScore } from '../../utils/api';
import './highScoreForm.css';

class HighScoreForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputOne: '_',
      inputTwo: '_',
      inputThree: '_'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.focusDiv();
  }

  focusDiv() {
    ReactDOM.findDOMNode(this.refs.inputOne).focus();
  }

  handleChange(event) {
    const KEYCODES = { left: 37, up: 38, right: 39, down: 40 };
    const input = event.target;
    const val = input.textContent;

    switch (event.keyCode) {
      case KEYCODES.right:
        input.nextSibling ? input.nextSibling.focus() : null;
        break;
      case KEYCODES.left:
        input.previousSibling ? input.previousSibling.focus() : null;
        break;
      case KEYCODES.up:
        input.textContent = this.advanceCharBy(val, -1);
        break;
      case KEYCODES.down:
        input.textContent = this.advanceCharBy(val, 1);
        break;
      default:
        if (event.keyCode >= 65 && event.keyCode <= 65 + 26) {
          input.textContent = String.fromCharCode(event.keyCode);
          input.nextSibling ? input.nextSibling.focus() : null;
        }
    }
    event.preventDefault();
  }

  advanceCharBy(char, distance) {
    let oldCode = char.charCodeAt(0);
    let newCode = 65 + (oldCode - 65 + 26 + distance) % 26;
    return String.fromCharCode(newCode);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { score, callback } = this.props;
    const name = Object.keys(this.state)
      .reduce((res, val) => res + this.state[val], '');

    saveHighScore('tetrift', name, score)
      .then(response => callback(response));
  }

  render() {
    return (
      <div>
        <div className={ 'cyclical_input' }>
          {Object.keys(this.state).map((key, index) => (
            <div tabIndex={ index } key={ index } ref={ key } onKeyDown={ this.handleChange }>{ this.state[key] }</div>
          ))}
        </div>
        <button onClick={ this.handleSubmit }>Submit</button>
      </div>
    );
  }
}

HighScoreForm.propTypes = {
  score: number,
  callback: func
};

export default HighScoreForm;
