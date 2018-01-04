
import React, { Component } from 'react';
import Tetromino from './Tetromino';
import './Tetronimo.css';
import {
  line,
  square,
  lShape,
  jShape,
  tShape,
  zShape,
  sShape
} from './tetrominoShapes';

class TetrominoState extends Component {
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
    }

    this.state = {
      currentPosition: 0,
      rotation: 0,
      piece: this.props.shape,
      currentShape: this.generatePeice(this.pieces[this.props.shape][0])
    };

    this.pieceDidUpdate = this.pieceDidUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.pieceDidUpdate(this.state.piece);
  }

  pieceDidUpdate () {
    this.props.pieceDidUpdate(this.state.currentShape);
  }

  /**
   * Creates a tetromino piece data structure
   * @param  {Array} activeSquares An array of four tuples that define the filled squares
   * @return {Array}               A tetromino data structure (associative array)
   */
  generatePeice (activeSquares) {
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

  setPiece (rotation, piece) {
    const thisPiece = this.pieces[piece];
    const shape = this.generatePeice(thisPiece[rotation.rotation]);

    this.setState({
      ...rotation,
      currentShape: shape
    }, this.pieceDidUpdate)
  }


  renderPieceSelect (pieces) {
    const options = pieces.map((piece, index) => (
        <option value={piece} key={index}> {piece} </option>
      )
    );

    return (
      <select onChange={ (event) => {
        this.setPiece({rotation: 0}, event.target.value)
      }}
      >
        { options }
      </select>
    );
  }

  handleClick (direction) {
    const rotation = this.rotatePiece(direction, this.state.currentPosition);
    this.setPiece(rotation, this.state.piece);
  }

  render() {
    const shape = this.state.currentShape;
    const pieceSelect = this.renderPieceSelect(Object.keys(this.pieces));
    return (
      <div className="tetromino">
        <h2>Tetromino</h2>
        <h3>{ this.state.piece }</h3>
        <div className="display">
          <div className="controls">
            { pieceSelect }
            <button onClick={ () => { this.handleClick.call(this, 'right') } }>Rotate Right</button>
            <button onClick={ () => { this.handleClick.call(this, 'left') } }>Rotate Left</button>
          </div>
          { shape ?
            <Tetromino shape={ shape } />
            : null}
        </div>
      </div>
    );
  }
}

export default TetrominoState;