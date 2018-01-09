import React, { Component } from 'react';
import './reset.css';
import './App.css';

import Loop from './components/Loop';
import Game from './components/Game';
import HighScoreList from './components/HighScore/highScoreList';

class App extends Component {
  render() {
    return (
      <div className="app">
        <HighScoreList />
        <Loop>
          <Game />
        </Loop>
      </div>
    );
  }
}

export default App;
