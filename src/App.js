import React, { Component } from 'react';
import './App.css';

import { tetrominoShapeNames } from './components/Tetromino/tetrominoShapes';
import Tetromino from './components/Tetromino';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tetromino shape={ tetrominoShapeNames[0] }/>
      </div>
    );
  }
}

export default App;
