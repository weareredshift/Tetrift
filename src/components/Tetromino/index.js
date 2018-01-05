import React from 'react';
import './Tetromino.css';

/**
* Generates a 4 x 4 grid representing a Tetronimo
* @param  {Array} shape         An associative array representing active squares for a Tetronimo in a given position
* @param {string} fillClass     String defining class to add to filled blocks
* @param  {Number} position     A number representing the current rotation for a piece
* @return {Array}               An associative array, of DOM elements renderable by react
*/
const Tetronimo = ({ shape, fillClass }) => {
  const renderedRows = shape.map((row, index) => {
     const rows = row.map((square, i) => {
      const filled = square ? `filled ${fillClass}` : 'empty';
      return <div className={ `block ${filled}` } key={ i } />
     });
    return (
      <div className="row" key={ index }>
        { rows }
      </div>
    );
  });

  return (
    <div className="tetromino">
      <div className="piece cf">
        { renderedRows }
      </div>
    </div>
  );
}

export default Tetronimo;