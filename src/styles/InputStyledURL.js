import React from "react";
import { useState } from "react";
import { ZStack } from "./Stacks";
import styled from "styled-components";
import { BodyBold } from "./TextStyles";

function InputStyledURL(props) {
  const { inputClass, type, name, placeholder, onChange } = props;
  const [hasURL, setHasUrl] = useState(false);

  return (
    <ZStack>
      <Input
        className={inputClass}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        disabled
      />

      <InputURL>
        <BodyBold>https://xdsea.com/collection/</BodyBold>
      </InputURL>
    </ZStack>
  );
}
export { InputStyledURL };

const Input = styled.input`
  width: 100%;
  height: 39px;
  border-radius: 9px;
  padding: 0px 12px 0px 245px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  
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

const InputURL = styled.div`
  position: absolute;
  top: 11px;
  left: 15px;
`;
