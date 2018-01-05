import React, { Component } from 'react';
import './reset.css';
import './App.css';

import Loop from './components/Loop';
import Game from './components/Game';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Loop>
          <Game />
        </Loop>
      </div>
    );
  }
}

export default App;
