import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { BodyBold, BodyRegular } from "./TextStyles";
import { HStack, IconImg } from "./Stacks";
import { RingSpinner } from "react-spinners-kit";
import successIcon from "../images/successIcon.png";
import failIcon from "../images/cancelIcon.png";

export default function ButtonApp(props) {
  const {
    text,
    onClick,
    background,
    padding,
    width,
    textcolor,
    height,
    border,
    icon,
    iconWidth,
    iconHeight,
    cursor,
    buttonId,
    btnStatus,
    hasImage,
  } = props;

  return (
    <ButtonView
      onClick={onClick}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.96 }}
      width={width}
      height={height}
      background={background}
      padding={padding}
      textcolor={textcolor}
      border={border}
      transition={{ ease: "easeOut", duration: 0.2 }}
      cursor={cursor}
      id={buttonId}
    >
      {btnStatus === 1 ? (
        <HStack spacing="6px">
          <BodyRegular textcolor={appStyle.colors.white}>Minting</BodyRegular>
          <RingSpinner size={21} color={appStyle.colors.white} loading={true} />
        </HStack>
      ) : btnStatus === 2 ? ( 
        <HStack spacing="6px">
          <BodyRegular textcolor={appStyle.colors.white}>Updating Ledger</BodyRegular>
          <RingSpinner size={21} color={appStyle.colors.white} loading={true} />
        </HStack>
      ) : btnStatus === 3 ? (
        <HStack spacing="6px">
          <BodyRegular textcolor={appStyle.colors.white}>Minted</BodyRegular>
          <IconImg url={successIcon} width="21px" height="21px"></IconImg>
        </HStack>
      ) : btnStatus === 4 ? (
        <HStack spacing="6px">
          <BodyRegular textcolor={appStyle.colors.white}>
            Mint Failed
          </BodyRegular>
          <IconImg url={failIcon} width="21px" height="21px"></IconImg>
        </HStack>
      ) : (
        <>
          <BodyBold textcolor={textcolor}>{text}</BodyBold>
          {hasImage && (
            <IconImg url={icon} width={iconWidth} height={iconHeight}></IconImg>
          )}
        </>
      )}
    </ButtonView>
  );
}

const ButtonView = styled(motion.div).attrs((props) => ({
  background: props.background || appStyle.colors.blue,
  padding: props.padding || "0px 21px 0 21px",
  width: props.width || "auto",
  height: props.height || "49px",
  textcolor: props.textcolor || appStyle.colors.white,
  border: props.border || "9px",
  cursor: props.cursor || "default",
}))`
  display: flex;
  flex-direction: row;
  font-weight: 500;
  gap: 6px;
  align-items: center;

  color: ${(props) => props.textcolor};
  border-radius: ${(props) => props.border};
  padding: ${(props) => props.padding};
  background: ${(props) => props.background};
  min-height: ${(props) => props.height};
  justify-content: center;
  width: ${(props) => props.width};
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */
  cursor: ${(props) => props.cursor};
`;
