import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg } from "./Stacks";
import newBlue from "../images/newBlue.png";
import logoWhiteX from "../images/logoWhiteX.png";
import { TitleRegular21, TitleRegular18 } from "./TextStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import goldPrice from "../images/goldPrice.png";
import silverPrice from "../images/silverPrice.png";
import cooperPrice from "../images/cooperPrice.png";

import styled from "styled-components";

function PricePosition(props) {
  const { creator, amount, image, position, nickName, redirect } = props;
  return (
    <VStack width="160px">
      <Crown>
        {position === 1 && (
          <IconImg
            url={goldPrice}
            width="90px"
            height="90px"
            backsize="contain"
          ></IconImg>
        )}
        {position === 2 && (
          <IconImg
            url={silverPrice}
            width="90px"
            height="90px"
            backsize="contain"
          ></IconImg>
        )}
        {position === 3 && (
          <IconImg
            url={cooperPrice}
            width="90px"
            height="90px"
            backsize="contain"
          ></IconImg>
        )}
      </Crown>
      <IconImg
        url={image || newBlue}
        width="90px"
        height="90px"
        border="90px"
        bordersize="3px"
        bordercolor="white"
        backsize="cover"
        cursor="pointer"
        onClick={() => redirect(`collection/${nickName}`)}
      ></IconImg>
      <VStack spacing="9px">
        <TitleRegular21 textcolor="black" align="center">
          {creator || "Creator Name"}
        </TitleRegular21>

        <HStack
          self="none"
          height="36px"
          border="30px"
          padding="0 15px "
          spacing="9px"
          background="linear-gradient(317.1deg, #0905C4 16.98%, #2D28FF 32.68%, #59E1FF 98.99%, #71FCF4 128.65%)"
        >
          <TitleRegular18 textcolor="white">{amount || "0"}</TitleRegular18>
          <IconImg url={logoWhiteX} width="18px" height="18px"></IconImg>
        </HStack>
      </VStack>
    </VStack>
  );
}

export { PricePosition };

const Crown = styled(motion.div)`
  position: absolute;
  z-index: 10;
  top: -60px;
`;
