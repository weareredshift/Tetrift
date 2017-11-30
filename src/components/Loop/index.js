import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameLoop from '../../utils/gameLoop';

class Loop extends Component {
  constructor(props) {
    super(props);

    this.loop = new GameLoop();
  }

  componentDidMount() {
    this.loop.start();
  }

  componentWillUnmount() {
    this.loop.stop();
  }

  getChildContext() {
    return {
      loop: this.loop
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Loop.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
}

Loop.childContextTypes = {
  loop: PropTypes.object
};

export default Loop;