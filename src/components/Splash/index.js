import React, { Component } from 'react';
import { func, object } from 'prop-types';
import './Splash.css';

export class Splash extends Component {
  render () {
    const { onGameStart, setOption, activeOptions } = this.props;
    const styles = ['redshift', 'classic', 'modern'];
    const difficulties = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const soundOptions = ['yes', 'no'];

    return (
      <div className="splash">
        <div>
          <h1 className="title">Tetrift</h1>

          <h3 className="header">Select style</h3>
          <ul className="options">
            { styles.map((style, index) => (
              <li
                className={ activeOptions.style === style ? 'selected' : '' }
                key={ index }
                onClick={ () => setOption instanceof Function && setOption({ style }) }
              >
                { style }
              </li>
            )) }
          </ul>

          <h3 className="header">Select level</h3>
          <ul className="options">
            { difficulties.map((difficulty, index) => (
              <li
                className={ activeOptions.difficulty === difficulty - 1 ? 'selected' : '' }
                key={ index }
                onClick={ () => setOption instanceof Function && setOption({ difficulty: difficulty - 1 }) }
              >
                { difficulty }
              </li>
            )) }
          </ul>

          <h3 className="header">Sound</h3>
          <ul className="options">
            { soundOptions.map((value, index) => (
              <li
                className={ activeOptions.sound === value ? 'selected' : '' }
                key={ index }
                onClick={ () => setOption instanceof Function && setOption({ sound: value }) }
              >
                { value }
              </li>
            )) }
          </ul>
        </div>
        <span
          className="btn"
          onClick={ () => onGameStart instanceof Function && onGameStart() }
        >Start game</span>

        <footer className="footer">
          Crafted by <a href="http://www.redshiftdigital.com/" target="_blank">Redshift Digital, inc.</a>
        </footer>
      </div>
    );
  }
}

Splash.propTypes = {
  onGameStart: func,
  activeOptions: object,
  setOption: func
};

export default Splash;
