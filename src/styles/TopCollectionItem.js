import React from "react";
import { HStack, IconImg, Spacer, VStack } from "./Stacks";
import {
  TitleBold15,
  TitleRegular33,
  BodyBold,
  CaptionBoldShort,
} from "./TextStyles";
import { appStyle } from "./AppStyles";

import miniXdcLogo from "../images/miniXdcLogo.png";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import { useState } from "react";

function TopCollectionItem(props) {
  const {
    position,
    floorprice,
    owners,
    nfts,
    volumetraded,
    collectionName,
    imageCreator,
    width,
    onClick,
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const creator = {
    initial: {
      background: "rgba(77, 88, 143, 0)",
    },

    hover: {
      background: "rgba(77, 88, 143, 0.14)",
    },
  };

  const opacity = {
    hover: { background: "rgba(255, 255, 255, 0)", opacity: 1, x: 3 },
    initial: { background: "rgba(255, 255, 255, 0)", opacity: 0.3, x: 0 },
  };

  return (
    <HStack
      border="12px"
      padding="18px"
      width={width}
      spacing="12px"
      animate={isVisible ? "hover" : "initial"}
      variants={creator}
      onHoverStart={() => setIsVisible((isVisible) => !isVisible)}
      onHoverEnd={() => setIsVisible((isVisible) => !isVisible)}
      onClick={onClick}
    >
      <TitleRegular33
        animate={isVisible ? "hover" : "initial"}
        variants={opacity}
      >
        {position || "0"}
      </TitleRegular33>
      <IconImg
        url={imageCreator}
        width="54px"
        height="54px"
        border="90px"
        bordersize="3px"
        bordercolor="white"
      ></IconImg>
      <VStack spacing="6px" alignment="flex-start">
        <TitleBold15>{collectionName || "Collection Name"}</TitleBold15>
        <HStack>
          <VStack spacing="3px">
            <CaptionBoldShort>Floor Price</CaptionBoldShort>

            <HStack spacing="6px">
              <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
              <BodyBold>
                {floorprice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) || "0"}
              </BodyBold>
            </HStack>
          </VStack>

          <VStack spacing="3px">
            <CaptionBoldShort>Owners</CaptionBoldShort>
            <BodyBold>{owners || "0"}</BodyBold>
          </VStack>

          <VStack spacing="3px">
            <CaptionBoldShort>NFT's</CaptionBoldShort>
            <BodyBold>{nfts || "0"}</BodyBold>
          </VStack>

          <VStack spacing="3px">
            <CaptionBoldShort align="center">Volume Traded</CaptionBoldShort>
            <HStack spacing="6px">
              <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
              <BodyBold>
                {volumetraded.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) || "0"}
              </BodyBold>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { TopCollectionItem };
