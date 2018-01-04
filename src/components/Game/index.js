import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

import { tetrominoShapeNames } from '../Tetromino/tetrominoShapes';
import Tetromino from '../Tetromino';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0
    };

    this.board = null;

    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.onPieceUpdate = this.onPieceUpdate.bind(this);
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
    this.board = this.generateGameBoard();

  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  onPieceUpdate (piece) {
    console.log(piece);
  }

  calculatePieceCoordinates (piece, origin = { x: 0, y: 0 }) {

  }




  // Tick logic subscribed from Loop component
  update = () => {
    this.setState({
      currentTime: this.state.currentTime + 1
    });
  };

  generateGameBoard (x=10, y=20) {
    const wrapper = new Array(y + 1).fill([]);
    const board = wrapper.map((val, index) => {
      const row = new Array(x + 2).fill(0);
      row[0] = 1;
      row[row.length-1] = 1;

      if(index === wrapper.length - 1) {
        row.fill(1);
      }
      return row;
    });

    return board;
  }

  fillGameBoard (board, activePiece, activePiecePosition) {

  }

  renderGameBoard (board) {
    const squares = board.map((row) => {
      return row.map((square, index) => {
        const filled = square ? 'filled' : 'empty';
        return <div key={ index } className={ `square ${filled}` } />
      })

    });

    return (
      <div className="board">
        { squares }
      </div>
    );

  }

  handleStart () {
    console.log(this.context.loop.loopID)

    this.context.loop.start()
  }

  handleStop () {
    console.log(this.context.loop.loopID)
    window.cancelAnimationFrame(this.context.loop.loopID)
  }

  render() {
    let board = null;

    if (this.board) {
      board = this.renderGameBoard(this.board);
    }

    return (
      <div className="game">
        <button onClick={ this.handleStart }>Start</button>
        <button onClick={ this.handleStop }>Stop</button>
        <div className="timer">
          { this.state.currentTime }
        </div>
        <Tetromino
          shape={ tetrominoShapeNames[0] }
          pieceDidUpdate = { this.onPieceUpdate }
        />
        { board }
      </div>
    );
  }
}

Game.contextTypes = {
  loop: PropTypes.object
}


export default Game;
