import React from "react";
import { useState } from "react";
import { VStack, HStack, Spacer, IconImg, ZStack, ZItem } from "./Stacks";
import styled from "styled-components";
import empty from "../images/empty.png";
import { BodyBold, BodyRegular } from "./TextStyles";
import { appStyle } from "./AppStyles";
import { textTransform } from "@mui/system";

function InputStyled(props) {
  const {
    input,
    type,
    name,
    placeholder,
    icon,
    onChange,
    onBlur,
    min,
    max,
    propertyKey,
    background,
    textalign,
    padding,
    fontsize,
    texttransform,
    height,
    inputId
  } = props;
  const [hasURL, setHasUrl] = useState(false);

  return (
    <ZStack>
      <Input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        className={propertyKey}
        value={input}
        background={background}
        textalign={textalign}
        padding={padding}
        fontsize={fontsize}
        texttransform={texttransform}
        height={height}
      />
      <InputIcon>
        <IconImg url={icon || empty} width="18px" height="18px"></IconImg>
      </InputIcon>
      {hasURL ? (
        <InputURL>
          <BodyBold>https://xdsea.io/collection/</BodyBold>
        </InputURL>
      ) : null}
    </ZStack>
  );
}
export { InputStyled };

// const Input = styled.input`

//   width: 100%;
//   height: 39px;
//   border-radius: 9px;
//   padding: 0px 36px 0px 12px;
//   border-style: solid;
//   border-color: rgba(255, 255, 255, 0);
//   text-align:left;
//   border-size: 0px
//   -moz-box-sizing: border-box;
//   box-sizing: border-box;
//   font-style: normal;
//   font-weight: normal;
//   font-size: 15px;
//   letter-spacing: -0.01em;

//   color:${({ theme }) => theme.text};
//   background:${({ theme }) => theme.backElement};

//   &:focus {
//     outline: none;

//     border-color: rgba(153, 162, 175, 0.36);

//   }
// `;

const InputIcon = styled.div`
  position: absolute;
  top: 11px;
  right: 15px;
`;

const InputURL = styled.div`
  position: absolute;
  top: 11px;
  left: 15px;
`;

const Input = styled.input.attrs((props) => ({
  background: props.background || props.theme.backElement,
  padding: props.padding || "0px 36px 0px 12px",
  textalign: props.textalign || "left",
  fontsize: props.fontsize || "15px",
  texttransform: props.texttransform || "none",
  height: props.height || "39px",
}))`
  

  background: ${(props) => props.background};
  width: 100%;
  height: ${(props) => props.height};
  border-radius: 9px;
  padding: ${(props) => props.padding};
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  text-align:${(props) => props.textalign};
  border-size: 0px
  -moz-box-sizing: border-box; 
  box-sizing: border-box;
  font-style: normal;
  font-weight: normal;
  font-size: ${(props) => props.fontsize};
  letter-spacing: -0.01em;
  text-transform: ${(props) => props.texttransform};
  
  color:${({ theme }) => theme.text};


  &:focus {
    outline: none;
    
    border-color: rgba(153, 162, 175, 0.36);
    
  }
  
`;
