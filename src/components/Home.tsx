import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex; 
  justify-content: center;
  align-items: center;
`;

const StartButton = styled.button`
  display: block;
  height: 30px;
  width: 100px;
`

const Home = ({ start }: { start: () => void }) => (
  <Wrapper>
    <StartButton id="start-game" onClick={() => start()}> start </StartButton>
  </Wrapper>
);

export default Home;