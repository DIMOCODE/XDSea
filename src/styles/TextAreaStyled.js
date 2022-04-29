import React from "react";
import { VStack } from "./Stacks";
import styled from "styled-components";

function TextAreaStyled(props) {
  const { value, onChange, height } = props;
  return <TextArea height={height} value={value} onChange={onChange} />;
}
export { TextAreaStyled };

// Example of Styled Component with attributes
export const TextArea = styled.textarea.attrs((props) => ({
  height: props.height || "300px",
}))`
  height: ${(props) => props.height}; //
  width: 100%;
  
 

  border-radius: 9px;
  padding: 15px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  
  border-size: 0px
  -moz-box-sizing: border-box; 
  box-sizing: border-box;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  letter-spacing: -0.01em;
  
  font-family: "Poppins", sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smooting: antialiased;

  
  color:${({ theme }) => theme.text};
  background:${({ theme }) => theme.backElement};


  &:focus {
    outline: none;
    
    border-color: rgba(153, 162, 175, 0.36);
    
  }
`;
