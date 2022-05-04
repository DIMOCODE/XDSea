import React from "react";
import { IconImg, ZStack } from "./Stacks";
import styled from "styled-components";
import empty from "../images/empty.png";

function InputStyledLink(props) {
  const { type, name, placeholder, icon, onChange } = props;

  return (
    <ZStack>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
      <InputIcon>
        <IconImg url={icon || empty} width="21px" height="21px"></IconImg>
      </InputIcon>
    </ZStack>
  );
}
export { InputStyledLink };

const Input = styled.input`
  width: 100%;
  height: 39px;
  border-radius: 9px;
  padding: 0px 12px 0px 39px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  text-align: center;
  border-size: 0px
  -moz-box-sizing: border-box; 
  box-sizing: border-box;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  letter-spacing: -0.01em;

  
  color:${({ theme }) => theme.text};
  background:${({ theme }) => theme.backElement};


  &:focus {
    outline: none;
    
    border-color: rgba(153, 162, 175, 0.36);
    
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 11px;
  left: 15px;
`;
