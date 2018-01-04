import React from 'react';
import './Tetromino.css';

/**
* Generates a 4 x 4 grid representing a Tetronimo
* @param  {Array} piece    An associative array representing active squares for a Tetronimo in a given position
* @param  {Number} position A number representing the current rotation for a piece
* @return {Array}          An associative array, of DOM elements renderable by react
*/
const Tetronimo = ({ shape }) => {
  const renderedRows = shape.map((row, index) => {
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
    <div className="tetromino">
      <div className="piece">
        { renderedRows }
      </div>
    </div>
  );
}

export default Tetronimo;