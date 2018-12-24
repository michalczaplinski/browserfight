import React, { Component } from "react";
import styled from "styled-components";

const Box = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid black;
  position: absolute;
`;

const Ball = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  position: relative;
  width: 30px;
  height: 30px;
  background-color: blue;
`;

class Game extends Component {
  state = { top: 0, left: 0 };

  componentDidMount() {
    window.onkeydown = this.checkKey;
  }

  checkKey = e => {
    console.log(e);
    const keyPr = e.keyCode; //Key code of key pressed
    if (keyPr === 39) {
      this.setState(({ left }) => ({ left: left + 1 }));
    } else if (keyPr === 37) {
      this.setState(({ left }) => ({ left: left - 1 }));
    } else if (keyPr === 38) {
      this.setState(({ top }) => ({ top: top - 1 }));
    } else if (keyPr === 40) {
      this.setState(({ top }) => ({ top: top + 1 }));
    }
  };

  render() {
    const { top, left } = this.state;
    return (
      <Box>
        <Ball top={top} left={left}>
          hi
        </Ball>
      </Box>
    );
  }
}

export default Game;
