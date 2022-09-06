import React from "react";
import { useState } from "react";
import { IconImg, ZStack } from "./Stacks";
import styled from "styled-components";
import empty from "../images/empty.png";
import { BodyBold } from "./TextStyles";

function InputStyled(props) {
  const {
    input,
    type,
    name,
    placeholder,
    icon,
    onChange,
    onClick,
    onBlur,
    min,
    max,
    step,
    propertyKey,
    background,
    textalign,
    padding,
    fontsize,
    texttransform,
    height,
    inputId,
    iconHeight,
    iconWidth,
    onKeyPress,
    iconClickable,
    onClickIcon,
    textcolor,
    iconRight,
    iconLeft,
  } = props;

  const [hasURL] = useState(false);

  const handleClick = () => {
    onClickIcon(document.getElementById(inputId).value);
  };

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
        step={step}
        className={propertyKey}
        value={input}
        background={background}
        textalign={textalign}
        padding={padding}
        fontsize={fontsize}
        texttransform={texttransform}
        height={height}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        onClick={onClick}
        onKeyPress={onKeyPress}
        textcolor={textcolor}
      />
      <InputIcon iconRight={iconRight || "15px"} iconLeft={iconLeft}>
        <IconImg
          url={icon || empty}
          width={iconWidth || "18px"}
          height={iconHeight || "18px"}
          cursor={iconClickable ? "pointer" : "default"}
          onClick={handleClick}
        ></IconImg>
      </InputIcon>
      {hasURL ? (
        <InputURL>
          <BodyBold>https://xdsea.com/collection/</BodyBold>
        </InputURL>
      ) : null}
    </ZStack>
  );
}

export { InputStyled };

const InputIcon = styled.div`
  position: absolute;
  top: 11px;

  width: 18px;
  right: ${(props) => props.iconRight};
  left: ${(props) => props.iconLeft};
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
  fontsize: props.fontsize || "16px",
  texttransform: props.texttransform || "none",
  height: props.height || "39px",
  textcolor: props.textcolor || props.theme.text,
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
  color:${(props) => props.textcolor};
  
   -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  &:focus {
    outline: none;
    border-color: rgba(153, 162, 175, 0.36);

  }
`;
