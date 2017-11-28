import React from 'react';
import ReactDOM from 'react-dom';
import Tetromino from './Tetromino';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tetromino />, div);
});
