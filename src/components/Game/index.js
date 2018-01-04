import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

import { tetrominoShapeNames } from '../Tetromino/tetrominoShapes';
import Tetromino from '../Tetromino';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      piece: null,
      piecePos: {x: 0, y: 3}
    };

    this.board = null;

    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.onPieceUpdate = this.onPieceUpdate.bind(this);

    this.boardDimensions = { x: 10, y: 20 }
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
    this.board = this.generateGameBoard(this.boardDimensions);

  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  onPieceUpdate (piece) {
    // console.log(piece);
    this.setState({ piece: piece });
  }

  calculatePieceCoordinates (piece, origin = {x: -1, y: -3}) {
    let coordinates = {};
    // console.log(piece, origin);
    piece.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col) coordinates[[rowIdx + origin.x, colIdx + origin.y]] = 1;
      })
    });

    return coordinates;
  }

  // Tick logic subscribed from Loop component
  update = () => {
    if (this.state.currentTime % 30 === 0) this.pieceMoveDown();
    this.setState({
      currentTime: this.state.currentTime + 1
    });
  };

  pieceMoveDown() {
    this.setState({
      piecePos: { x: this.state.piecePos.x + 1, y: this.state.piecePos.y }
    })
  }

  generateGameBoard () {
    const { x, y } = this.boardDimensions;

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

  renderGameBoard (board, piece, piecePos) {
    const pieceCoordinates = piece ? this.calculatePieceCoordinates(piece, piecePos) : {};
    const { x, y } = this.boardDimensions;
    const height = window.innerHeight / (y + 3);
    const width = height * (x + 2)

    const squares = board.map((row, rowIdx) => {

      return row.map((square, index) => {
        const filled = square || pieceCoordinates[[rowIdx, index]] ? 'filled' : 'empty';
        return <div key={ index } style={ { height, width: height } } className={ `square ${filled}` } />
      })

    });

    return (
      <div style={ { width } } className="board cf">
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
      board = this.renderGameBoard(this.board, this.state.piece, this.state.piecePos);
    }

    return (
      <div className="game cf">
        <div className="sidebar">
          <button onClick={ this.handleStart }>Start</button>
          <button onClick={ this.handleStop }>Stop</button>
          <div className="timer">
            { this.state.currentTime }
          </div>
          <Tetromino
            shape={ tetrominoShapeNames[0] }
            pieceDidUpdate = { this.onPieceUpdate }
          />
        </div>

        <div className="main">
          { board }
        </div>
      </div>
    );
  }
}

Game.contextTypes = {
  loop: PropTypes.object
}


export default Game;
