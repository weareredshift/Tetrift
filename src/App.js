import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Tetromino from './components/Tetromino';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tetromino />
      </div>
    );
  }
}

export default App;
