import React from "react";
import { useState } from "react";
import { IconImg, ZStack } from "./Stacks";
import styled, { withTheme } from "styled-components";
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
    iconTop,
    disabled,
    textplace,
    border,
    width,
    weight,
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
        border={border}
        texttransform={texttransform}
        height={height}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        onClick={onClick}
        onKeyPress={onKeyPress}
        textcolor={textcolor}
        disabled={disabled}
        textplace={textplace}
        width={width}
        weight={weight}
      />
      <InputIcon
        iconRight={iconRight || "15px"}
        iconTop={iconTop || null}
        iconLeft={iconLeft}
      >
        <IconImg
          url={icon || empty}
          width={iconWidth || "18px"}
          height={iconHeight || "18px"}
          cursor={iconClickable ? "pointer" : "default"}
          onClick={onClickIcon ? handleClick : () => {}}
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
  top: ${(props) => props.iconTop};
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
  width: props.width || "100%",
  weight: props.weight || "normal",
  textcolor: props.textcolor || props.theme.text,
  textplace: props.textplace || "rgba(255,255,255, 0.8)",
  border: props.border || "6px",
}))`
  background: ${(props) => props.background};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: ${(props) => props.border};
  padding: ${(props) => props.padding};
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  text-align:${(props) => props.textalign};
  border-size: 0px
  -moz-box-sizing: border-box; 
  box-sizing: border-box;
  font-style: normal;
  font-weight: ${(props) => props.weight};
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
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: ${(props) => props.textplace};
  opacity: 1; /* Firefox */
`;
