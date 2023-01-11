import React, { useState } from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import xdc from "../../../images/xdcLogo.png";
import addToken from "../../../images/AddTokenIcon.svg";
import { ThemeConsumer } from "styled-components";

function Token(props) {
  const [setActive, setIsActive] = useState(false);

  const handleActive = () => {
    setIsActive(!setActive);
  };

  return (
    <VStack
      spacing="6px"
      padding="3px"
      maxwidth="90px"
      height="111px"
      border="9px"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.08)" }}
      bordercolor={setActive ? ({ theme }) => theme.blueText : "transparent"}
      bordersize={"2px"}
      onClick={props.onClick}
      whileTap={handleActive}
      cursor="pointer"
    >
      <IconImg
        url={props.image}
        width="52px"
        height="52px"
        cursor="pointer"
      ></IconImg>
      <BodyMedium cursor="pointer">{props.name}</BodyMedium>
    </VStack>
  );
}

function TokenGrid(props) {
  return (
    <HStack flexwrap="wrap" justify="flex-start" spacing="18px">
      <Token image={xdc} name="XDC"></Token>

      <Token image={xdc} name="XDC"></Token>
      <Token image={xdc} name="XDC"></Token>
      <Token image={addToken} name="Add Token" onClick={props.onClick}></Token>
    </HStack>
  );
}

export { TokenGrid };
