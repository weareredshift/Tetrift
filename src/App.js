import React, { Component } from 'react';
import './reset.css';
import './App.css';

import Loop from './components/Loop';
import Game from './components/Game';
import HighScoreList from './components/HighScore/highScoreList';
import HighScoreForm from './components/HighScore/highScoreForm';

class App extends Component {
  render() {
    return (
      <div className="app">
        <HighScoreList />
        <HighScoreForm score={ 123 } callback={ (response) => console.log(response) } />
        <Loop>
          <Game />
        </Loop>
      </div>
    );
  }
}

export default App;
