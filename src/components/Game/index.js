import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';
import {
  line,
  square,
  lShape,
  jShape,
  tShape,
  zShape,
  sShape
} from '../Tetromino/tetrominoShapes';

// import { tetrominoShapeNames } from '../Tetromino/tetrominoShapes';
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

    this.currentShape = this.generatePiece(this.pieces['line'][0]);
    this.boardDimensions = { x: 10, y: 20 };
    this.board = this.generateGameBoard(this.boardDimensions);


    this.state = {
      currentTime: 0,
      piece: 'line',
      piecePos: { x: 3, y: 0 },
      currentPosition: 0,
      rotation: 0
    };

    // Bind functions
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    // this.onPieceUpdate = this.onPieceUpdate.bind(this);

    this.boardDimensions = { x: 10, y: 20 };
    this.handleRotation = this.handleRotation.bind(this);
    this.updatePieceState = this.updatePieceState.bind(this);
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
    this.board = this.generateGameBoard(this.boardDimensions);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  /*****************************
  * Game Loop Functions
  *****************************/

  handleStart () {
    console.log(this.context.loop.loopID)

    this.context.loop.start()
  }

  handleStop () {
    console.log(this.context.loop.loopID)
    window.cancelAnimationFrame(this.context.loop.loopID)
  }

  // Tick logic subscribed from Loop component
  update = () => {
    if (this.state.currentTime % 30 === 0) this.fallDown();
    this.setState({
      currentTime: this.state.currentTime + 1
    });
  };

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

  noCollision(newPos) {
    let pieceCoordinates = this.calculatePieceCoordinates(this.currentShape, newPos, true);
    const collisions = pieceCoordinates.filter((piece) => {
      return this.board[piece.y][piece.x] !== 0;
    }).length;

    return collisions === 0;
  }

  handleKeyDown(event) {
    switch(event.keyCode) {
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
        this.fallDown()
        break;
      default:
        break;
    }
  }

  calculatePieceCoordinates (piece, origin = {x: -1, y: -3}, array = false) {
    const coordinates = array ? [] : {};

    piece.forEach((row, yIndex) => {
      row.forEach((square, xIndex) => {
        if (square === 1) {
          if (array)
            coordinates.push({x: xIndex + origin.x, y: yIndex + origin.y})
          else
            coordinates[[xIndex + origin.x, yIndex + origin.y]] = 1;
        }
      })
    });

    return coordinates;
  }

  killPiece() {
    let pieceCoordinates = this.calculatePieceCoordinates(this.currentShape, this.state.piecePos, true);

    pieceCoordinates.forEach((piece) => {
      this.board[piece.y][piece.x] = 1;
    })

    this.resetPiece();
  }

  resetPiece() {
    this.currentShape = this.generatePiece(this.pieces['line'][0]);
    this.setState({
      piece: 'line',
      piecePos: { x: 3, y: 0 },
      currentPosition: 0,
      rotation: 0
    });
  }

  /*****************************
  * Game Board Setup
  *****************************/

  /**
   * Creates an empty game board
   * @return {Array} Returns associative array as the game board
   */
  generateGameBoard (dimensions) {
    const { x, y } = dimensions;

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
    const height = window.innerHeight / (y + 3);
    const width = height * (x + 2)

    const squares = board.map((row, rowIdx) => {

      return row.map((square, index) => {
        let fillClass = 'empty';
        if (square) fillClass = 'border';
        if (pieceCoordinates[[index, rowIdx]]) fillClass = `filled ${ this.state.piece}`
        return <div key={ index } style={ { height, width: height } } className={ `block ${fillClass}` } />
      })

    });

    return (
      <div style={ { width } } className="board cf">
        { squares }
      </div>
    );

  }

  /*****************************
  * Tetronimo Setup
  *****************************/
  /**
   * Creates a tetromino piece data structure
   * @param  {Array} activeSquares An array of four tuples that define the filled squares
   * @return {Array}               A tetromino data structure (associative array)
   */
  generatePiece (activeSquares) {
    const pieceGrid =  [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

    activeSquares.forEach((coord, index) => {
      const row = coord[0];
      const column = coord[1];

      pieceGrid[row][column] = 1;
    });

    return pieceGrid;
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
    }
  }

  /**
   * Updates the component state dyanimcally based on arbitrary state properties
   * @param  {Object} newState Object mapping to updated properties in state
   */
  updatePieceState (newState = {}, callback = () => {}) {
    const updatedState = Object.assign({}, this.state, newState);
    const { piece, rotation } = updatedState;

    const thisPiece = this.pieces[piece];
    this.currentShape = this.generatePiece(thisPiece[rotation]);

    this.setState(updatedState, callback);
  }

  /**
   * Rotate the active piece left or right
   * @param  {String} direction Direction of 'left' or 'right'
   */
  handleRotation (direction) {
    const pieceConfig = this.rotatePiece(direction, this.state.currentPosition);
    this.updatePieceState(pieceConfig);
  }


  /*****************************
  * On Screen Controls
  *****************************/

  /**
   * Renders a select box for swapping pieces
   * @param  {Array} pieces An array of piece names
   * @return {Object}        JSX to render in the components render method
   */
  renderPieceSelect (pieces) {
    const options = pieces.map((piece, index) => (
        <option value={piece} key={index}> {piece} </option>
      )
    );

    return (
      <select onChange={ (event) => {
        this.updatePieceState({rotation: 0, piece: event.target.value});
      }}
      >
        { options }
      </select>
    );
  }

  render() {
    let board = null;

    if (this.board) {
      board = this.renderGameBoard(this.board, this.currentShape, this.state.piecePos);
    }

    const pieceSelect = this.renderPieceSelect(Object.keys(this.pieces));

    return (
      <div className="game cf">
        <div className="sidebar">
          <button onClick={ this.handleStart }>Start</button>
          <button onClick={ this.handleStop }>Stop</button>
          <div className="timer">
            { this.state.currentTime }
          </div>

          <div className="controls">
            { pieceSelect }
            <button onClick={ () => { this.handleRotation.call(this, 'right') } }>Rotate Right</button>
            <button onClick={ () => { this.handleRotation.call(this, 'left') } }>Rotate Left</button>
          </div>

          <Tetromino fillClass={ this.state.piece } shape={ this.currentShape } />
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
