import React, { Component } from 'react';
import { object, func } from 'prop-types';
import WinnerScreen from '../WinnerScreen';
import LoserScreen from '../LoserScreen';

import {
  generateGameBoard,
  checkRowForCompletion,
  removeBoardRow,
  generatePiece,
  generateRandomPiece,
  generateBoardRow,
  caclulateTurnScore
} from './gameUtils';

import './Game.css';
import {
  line,
  square,
  lShape,
  jShape,
  tShape,
  zShape,
  sShape,
  tetrominoShapeNames,
  pieceColors
} from '../Tetromino/tetrominoShapes';

import Tetromino from '../Tetromino';

class Game extends Component {
  constructor(props) {
    super(props);

    this.pieces = {
      line,
      square,
      lShape,
      jShape,
      tShape,
      zShape,
      sShape
    };

    const initialPieceState = generateRandomPiece(this.pieces);
    this.pieceQueue = new Array(5).fill(null).map(() => generateRandomPiece(this.pieces));

    const { currentPosition, rotation, piece } = initialPieceState;

    this.currentShape = generatePiece(this.pieces[piece][rotation]);
    this.boardDimensions = { x: 10, y: 20 };
    this.board = generateGameBoard(this.boardDimensions);

    this.levelThemes = [
      'sherbert',
      'motherland',
      'coldfront',
      'desert',
      'princess',
      'chocolate',
      'dinosaur',
      'meat',
      'rocketship',
      'volcano'
    ];

    this.completedLines = 0;
    this.level = props.options.difficulty;
    this.gameSpeed = this.calculateLevelSpeed(this.level);
    this.flash = false;

    this.initialState = {
      currentTime: 0,
      currentScore: 0,
      piecePos: { x: 4, y: 0 },
      piece,
      currentPosition,
      paused: false,
      rotation,
      showWinScreen: false,
      showLoseScreen: false
    };

    this.state = this.initialState;

    // Bind functions
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleRotation = this.handleRotation.bind(this);
    this.updatePieceState = this.updatePieceState.bind(this);
    this.addNewPiece = this.addNewPiece.bind(this);
    this.getNextPiece = this.getNextPiece.bind(this);
    this.togglePause = this.togglePause.bind(this);
  }

  componentDidMount() {
    this.keydownFunc = this.handleKeyDown.bind(this);
    this.context.loop.subscribe(this.update);
    this.board = generateGameBoard(this.boardDimensions);
    document.addEventListener('keydown', this.keydownFunc);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
    document.removeEventListener('keydown', this.keydownFunc);
  }

  /*****************************
  * Game Loop Functions
  *****************************/

  handleStart () {
    this.context.loop.start();
  }

  handleStop () {
    window.cancelAnimationFrame(this.context.loop.loopID);
    this.context.loop.loopID = null;
  }

  togglePause () {
    this.setState({
      paused: !this.state.paused
    }, () => {
      const updatePause = this.state.paused ? this.handleStop : this.handleStart;
      updatePause();
    });
  }

  gameLost() {
    return this.board[0].reduce((a, b) => a + b) > 2;
  }

  endGame () {
    this.handleStop();
    if (this.state.currentScore >= 100000) {
      this.setState({
        showWinScreen: true
      });
    } else {
      this.setState({
        showLoseScreen: true
      });
    }
  }

  restartGame() {
    const initialPieceState = generateRandomPiece(this.pieces);
    this.pieceQueue = new Array(5).fill(null).map(() => generateRandomPiece(this.pieces));

    const { rotation, piece } = initialPieceState;

    this.currentShape = generatePiece(this.pieces[piece][rotation]);
    this.board = generateGameBoard(this.boardDimensions);

    this.score = 0;
    this.completedLines = 0;
    this.level = 0;
    this.gameSpeed = 50;

    const state = Object.assign({}, this.initialState, initialPieceState);
    this.setState(state, this.handleStart);
  }

  // Tick logic subscribed from Loop component
  // tStamp is the hi-res timestamp from window.requestAnimationFrame
  update = () => {
    if (this.state.currentTime % this.gameSpeed === 0) this.fallDown();
    this.setState({
      currentTime: this.state.currentTime + 1
    });
  };

  /**
   * Calculates the current level from compelted lines
   * @param  {Number} linesCleared Number of cleared lines
   * @return {Number}              Level number
   */
  calculateLevel (linesCleared) {
    let level = 0;

    if (linesCleared <= 90) {
      level = Math.floor(linesCleared / 10);
    } else {
      level = Math.floor((linesCleared - 90) / 20) + 9;
    }
    return level;
  }

  /**
   * Caclulates the level speed from level number
   * @param  {Number} levelNumber Level number
   * @return {Number}             Game speed
   */
  calculateLevelSpeed(levelNumber) {
    const levelSpeed = 50 - (levelNumber * 5);
    return levelSpeed >= 1 ? levelSpeed : 1;
  }

  /**
   * Updates to next level
   * @param  {Nubmer} level Level number
   */
  triggerLevelChange (level) {
    this.level = level;
    this.gameSpeed = this.calculateLevelSpeed(level);

    clearTimeout(this.flashTimeout);

    this.flash = true;
    this.flashTimeout = setTimeout(() => {
      this.flash = false;
    }, 1000);
  }

  move(dir) {
    const newPos = { x: this.state.piecePos.x + dir.x, y: this.state.piecePos.y + dir.y };
    if (this.noCollision(newPos)) {
      this.setState({
        piecePos: newPos
      });
      return true;
    }
    return false;
  }

  fallDown() {
    if (!this.move({ x: 0, y: 1 })) {
      this.killPiece();
    }
  }

  noCollision(newPos, shape) {
    let currentShape = shape ? shape : this.currentShape;
    let pieceCoordinates = this.calculatePieceCoordinates(currentShape, newPos, true);
    const collisions = pieceCoordinates.filter((piece) => this.board[piece.y][piece.x] !== 0).length;

    return collisions === 0;
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case 37:
        this.move({ x: -1, y: 0 });
        break;
      case 38:
        this.handleRotation.call(this, 'left');
        break;
      case 39:
        this.move({ x: 1, y: 0 });
        break;
      case 40:
        this.fallDown();
        break;
      default:
        break;
    }
  }

  calculatePieceCoordinates (piece, origin = { x: -1, y: -3 }, array = false) {
    const coordinates = array ? [] : {};

    piece.forEach((row, yIndex) => {
      row.forEach((square, xIndex) => {
        if (square === 1) {
          if (array)
            coordinates.push({ x: xIndex + origin.x, y: yIndex + origin.y });
          else
            coordinates[[xIndex + origin.x, yIndex + origin.y]] = 1;
        }
      });
    });

    return coordinates;
  }

  assessNextTurn() {
    if (this.gameLost()) {
      this.endGame();
    } else {
      this.addNewPiece();
    }
  }

  /**
   * Freezes a piece at the bottom or when bottom collision occurs
   */
  killPiece() {
    let pieceCoordinates = this.calculatePieceCoordinates(this.currentShape, this.state.piecePos, true);

    pieceCoordinates.forEach((piece) => {
      this.board[piece.y][piece.x] = tetrominoShapeNames.indexOf(this.state.piece) + 2;
    });

    let lineCount = 0;
    let rowsToRemove = [];

    // Check for completed lines
    this.board.forEach((row, index) => {
      if (checkRowForCompletion(row) && index < this.board.length - 1) {
        this.completedLines ++;
        lineCount ++;
        rowsToRemove.push(index);
      }
    });

    // Update score if line complete
    if (lineCount) {
      this.removeRowsWithAnimation(rowsToRemove);
      const currentScore = this.state.currentScore + caclulateTurnScore(this.level, lineCount);
      this.setState({
        currentScore
      });
    }

    const level = this.calculateLevel(this.completedLines);

    if (this.level !== level && level > this.level) {
      this.triggerLevelChange(level);
    }

    this.assessNextTurn();
  }

  removeRowsWithAnimation (rowIndexes = []) {
    rowIndexes.forEach((rowIndex) => {
      const row = generateBoardRow(this.boardDimensions.x + 2, -1);
      this.board[rowIndex] = row;

      setTimeout(() => {
        this.board = removeBoardRow(this.board, rowIndex);
      }, 75);
    });
  }

  /**
   * Generates a renderable board
   * @param  {Array} board    Associative array representing the game board
   * @param  {Array} piece    Associative array representing the piece
   * @param  {object} piecePos x and y coordiates for piece origin [0, 0]
   * @return {object}          JSX representation of the board
   */
  renderGameBoard (board, piece, piecePos) {
    const pieceCoordinates = piece ? this.calculatePieceCoordinates(piece, piecePos) : {};
    const { x, y } = this.boardDimensions;
    const height = window.innerHeight / (y + 4);

    const squares = board.map((row, rowIdx) => row.map((square, index) => {
      let fillClass = 'empty';
      if (square) {
        fillClass = `filled ${pieceColors[square]}`;
      }
      if (pieceCoordinates[[index, rowIdx]]) fillClass = `filled ${this.state.piece}`;
      return (
        <div key={ index } style={ { height, width: height } } className={ `block ${fillClass}` }>
          { this.props.options.style === '3d' && fillClass.split(' ')[0] === 'filled' &&
            <div>
              <div className="front" />
              <div className="back" />
              <div className="right" />
              <div className="left" />
              <div className="top" />
              <div className="bottom" />
            </div>
          }
        </div>
      );
    }));

    return (
      <div style={ { width: height * x, height: height * y } } className="board cf">
        <div className="cf" style={ { marginLeft: `-${height}px`, width: height * (x + 2) } }>
          { squares }
        </div>
      </div>
    );
  }

  /**
   * Adds a new piece at the origin
   */
  addNewPiece () {
    const piece = this.pieceQueue.pop();
    this.pieceQueue.unshift(generateRandomPiece(this.pieces));
    piece.piecePos = { x: 3, y: 0 };
    this.updatePieceState(piece);
  }

  /**
   * Utility function to retun the next built shape
   * @return {Array} Tetromino data structure
   */
  getNextPiece () {
    const { piece, rotation } = this.pieceQueue[this.pieceQueue.length - 1];
    return generatePiece(this.pieces[piece][rotation]);
  }

  /**
   * Rotates a piece to the next position, either left or right
   * @param  {String} direction       A rotation direction, either 'right' or 'left'
   * @param  {Number} currentPosition The current rotation index
   * @return {Object}                 Returns an object with the relative rotation and the cumulative position, both for udating state
   */
  rotatePiece (direction, currentPosition) {
    const nextPosition = direction === 'right' ? currentPosition + 1 : currentPosition - 1 ;
    return {
      currentPosition: nextPosition,
      rotation: Math.abs(nextPosition) % 4
    };
  }

  /**
   * Updates the component state dyanimcally based on arbitrary state properties
   * @param  {Object} newState Object mapping to updated properties in state
   */
  updatePieceState (newState = {}, callback = () => {}) {
    const updatedState = Object.assign({}, this.state, newState);
    const { piece, rotation } = updatedState;

    const thisPiece = this.pieces[piece];
    this.currentShape = generatePiece(thisPiece[rotation]);

    this.setState(updatedState, callback);
  }

  /**
   * Rotate the active piece left or right
   * @param  {String} direction Direction of 'left' or 'right'
   */
  handleRotation (direction) {
    const pieceConfig = this.rotatePiece(direction, this.state.currentPosition);
    if (this.noCollision(this.state.piecePos, generatePiece(this.pieces[this.state.piece][pieceConfig.rotation])))
      this.updatePieceState(pieceConfig);
  }

  /*****************************
  * On Screen Controls
  *****************************/
  renderLevelSelect (levelNumber = 9) {
    const options = [];
    let i = 0;

    while (i <= levelNumber) {
      options.push(<option value={ i } key={ i }> { i } </option>);
      i++;
    }
    return (
      <select onChange={ (event) => {
        this.triggerLevelChange(event.target.value);
      } }
      >
        { options }
      </select>
    );
  }

  /**
   * Renders a select box for swapping pieces
   * @param  {Array} pieces An array of piece names
   * @return {Object}        JSX to render in the components render method
   */
  renderPieceSelect (pieces) {
    const options = pieces.map((piece, index) => (
      <option value={ piece } key={ index }> {piece} </option>
    )
    );

    return (
      <select onChange={ (event) => {
        this.updatePieceState({ rotation: 0, piece: event.target.value });
      } }
      >
        { options }
      </select>
    );
  }

  render() {
    let board = null;
    const { options } = this.props;

    if (this.board) {
      board = this.renderGameBoard(this.board, this.currentShape, this.state.piecePos);
    }

    return (
      <div className={ `game cf ${this.levelThemes[this.level]} style--${options.style}` }>
        <div className="header">
          <div className="timer">
            <span style={ { margin: '10px 20px' } }>Score: { this.state.currentScore }</span>
          </div>
        </div>

        <div className="main">
          <div className="status">
            <span>Rows { this.completedLines }</span>
            <span>Level { this.level + 1 }</span>
          </div>
          { board }

          { this.flash ?
            <div className="flash-bang" />
            : null
          }
          { this.flash && <div className="flash-bang" /> }

          <div className="queue">
            <h5>Next</h5>
            <div className="queue__piece">
              <Tetromino dimensions={ this.boardDimensions } fillClass={ `filled ${this.pieceQueue[this.pieceQueue.length - 1].piece}` } shape={ this.getNextPiece() } />
            </div>
          </div>
        </div>

        { this.state.showLoseScreen &&
          <LoserScreen
            score={ this.state.currentScore }
            onRestart={ this.restartGame.bind(this) }
            onMainMenu={ () => {
              this.restartGame();
              this.props.goToMainMenu(this);
            } }
          />
        }

        { this.state.showWinScreen &&
          <WinnerScreen
            onRestart={ this.restartGame.bind(this) }
          />
        }

        { options.sound === 'yes' &&
          <div className="audio">
            <audio autoPlay={ true } controls={ true }>
              <source src={ require('../../assets/music/tetris-gameboy-02.mp3') } type="audio/mpeg" />
            </audio>
          </div>
        }
      </div>
    );
  }
}

Game.contextTypes = {
  loop: object
};

Game.propTypes = {
  goToMainMenu: func
};

export default Game;
