import styled from "styled-components";
import React, { Children, ReactNode } from "react";

const StyledHUD = styled.div`
  position: absolute;
  top: 20px;
  left: 25px;
  width: auto;
  height: auto;
`

const StyledHUDContent = styled.div`
  position: relative;
  background-color: rgba(156, 39, 176, 0.2);
`


const HUD = ({ children }: { children: ReactNode }) => (
  <StyledHUD>
    <StyledHUDContent>
      {Children.map(children, child => child)}
    </StyledHUDContent>
  </StyledHUD>
)

export default HUD;