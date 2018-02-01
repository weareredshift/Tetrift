import React, { Component } from 'react';
import '../styles/core.css';
import './App.css';

import Loop from '../components/Loop';
import Game from '../components/Game';
import Splash from '../components/Splash';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      startGame: false,
      options: {
        style: 'redshift',
        difficulty: 0,
        sound: 'yes'
      }
    };
  }

  setOption (newOption) {
    const { options } = this.state;
    this.setState({ options: Object.assign(options, newOption) });
  }

  render () {
    const { startGame, options } = this.state;

    return (
      <div className="app">
        { startGame
          ? <Loop>
            <Game
              options={ options }
              goToMainMenu={ () => this.setState({ startGame: false }) }
            />
          </Loop>
          : <Splash
            activeOptions={ options }
            setOption={ (option) => this.setOption(option) }
            onGameStart={ () => this.setState({ startGame: true }) }
          />
        }
      </div>
    );
  }
}

export default App;
