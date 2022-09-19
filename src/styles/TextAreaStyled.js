import React from "react";
import styled from "styled-components";

function TextAreaStyled(props) {
  const {
    value,
    onChange,
    height,
    textClass,
    textColor,
    background,
    resize,
    maxLength,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    placeholder,
    textplace,
  } = props;
  return (
    <TextArea
      height={height}
      value={value}
      onChange={onChange}
      className={textClass}
      textColor={textColor}
      background={background}
      resize={resize}
      maxLength={maxLength}
      fontSize={fontSize}
      fontWeight={fontWeight}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      placeholder={placeholder}
      textplace={textplace}
    />
  );
}

export { TextAreaStyled };

export const TextArea = styled.textarea.attrs((props) => ({
  height: props.height || "300px",
  placeholder: props.placeholder || "Describe your NFT",
  textColor: props.textColor || "black",
  background: props.background || "white",
  resize: props.resize,
  maxLength: props.maxLength,
  fontSize: props.fontSize || "15px",
  fontWeight: props.fontWeight || "normal",
  letterSpacing: props.letterSpacing || "-0.01em",
  lineHeight: props.lineHeight,
  padding: props.padding || "15px",
  textplace: props.textplace || "rgba(255,255,255,0.3)",
}))`
  height: ${(props) => props.height}; //
  width: 100%;
  border-radius: 9px;
  padding: ${(props) => props.padding};
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  border-size: 0px
  -moz-box-sizing: border-box; 
  box-sizing: border-box;
  font-style: normal;
  font-weight:${(props) => props.fontWeight};
  font-size:${(props) => props.fontSize};
  letter-spacing:${(props) => props.letterSpacing};
  line-height:${(props) => props.lineHeight};
  font-family: "Poppins", sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smooting: antialiased;
  resize:${(props) => props.resize};
  maxlength:${(props) => props.maxLength};
  color:${(props) => props.textColor};
  background:${(props) => props.background};
  &:focus {
    outline: none;
    border-color: rgba(153, 162, 175, 0.36);
  }
   ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: ${(props) => props.textplace};
  opacity: 1; /* Firefox */
`;
