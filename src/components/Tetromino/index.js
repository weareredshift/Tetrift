
import React, { Component } from 'react';
import './Tetronimo.css';

class Tetromino extends Component {
  constructor(props) {
    super(props);

    const line = [
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[1, 0], [1, 1], [1, 2], [1, 3]],
      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[2, 0], [2, 1], [2, 2], [2, 3]]
    ];

    const square = [
      [[1, 1], [1, 2], [2, 1], [2, 2]],
      [[1, 1], [1, 2], [2, 1], [2, 2]],
      [[1, 1], [1, 2], [2, 1], [2, 2]],
      [[1, 1], [1, 2], [2, 1], [2, 2]]
    ];

    const lShape = [
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 0]]
    ];

    const jShape = [
      [[0, 1], [0, 2], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 0], [2, 1]],
      [[0, 0], [1, 0], [1, 1], [1, 2]]
    ];

    const tShape = [
      [[0, 1], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [1, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 1]],
      [[0, 1], [1, 1], [2, 1], [1, 0]]
    ];

    const zShape = [
      [[0, 1], [1, 1], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[0, 2], [1, 2], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [2, 1], [2, 2]]
    ];

    const sShape = [
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 1], [0, 2], [1, 0], [1, 1]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[1, 1], [1, 2], [2, 0], [2, 1]]
    ];

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
      piece: 'sShape'
    };

    this.handleClick = this.handleClick.bind(this);
  }

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


  /**
   * Generates a 4 x 4 grid representing a Tetronimo
   * @param  {Array} piece    An associative array representing active squares for a Tetronimo in a given position
   * @param  {Number} position A number representing the current rotation for a piece
   * @return {Array}          An associative array, of DOM elements renderable by react
   */
  renderPiece (piece, position) {
    const currentShape = this.generatePeice(piece[position]);
    const renderedRows = currentShape.map((row, index) => {
       const rows = row.map((square, i) => {
        const filled = square ? 'filled' : 'empty';
        return <div className={ `square ${filled}` } key={ i } />
       });
      return (
        <div className="row" key={ index }>
          { rows }
        </div>
      );
    });

    return (
      <div className="piece">
        { renderedRows }
      </div>
    );
  }

  renderPieceSelect (pieces) {
    const options = pieces.map((piece, index) => (
        <option value={piece} key={index}> {piece} </option>
      )
    );

    return (
      <select onChange={ (event) => {
        this.setState({
            piece: event.target.value
          });
        }}
      >
        { options }
      </select>
    );
  }

  handleClick (direction) {
    const rotation = this.rotatePiece(direction, this.state.currentPosition);
    this.setState(rotation);
  }

  render() {
    const piece = this.renderPiece(this.pieces[this.state.piece], this.state.rotation);
    const pieceSelect = this.renderPieceSelect(Object.keys(this.pieces));

    return (
        <div>
          <h2>Tetromino</h2>
          <h3>{ this.state.piece }</h3>
          <div className="display">
            <div className="controls">
              { pieceSelect }
              <button onClick={ () => { this.handleClick.call(this, 'right') } }>Rotate Right</button>
              <button onClick={ () => { this.handleClick.call(this, 'left') } }>Rotate Left</button>
            </div>
            { piece }
          </div>
        </div>
      );
  }
}

export default Tetromino;
