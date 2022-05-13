import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import miniXdcLogo from "../images/miniXdcLogo.png";
import { BodyBold, BodyRegular, TitleBold18 } from "./TextStyles";
import ReactPlayer from "react-player";

import { appStyle } from "./AppStyles";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import ButtonApp from "./Buttons";

function NftContainer(props) {
  const {
    price,
    collectionName,
    itemNumber,
    creatorImage,
    itemImage,
    textcolor,
    background,
    onClick,
    onClickCreator,
    fileType,
  } = props;
  const scaleImage = {
    initial: {
      scale: 1,
    },

    hover: {
      scale: 1.05,
    },
  };

  const moveContainer = {
    initial: {
      y: 69,
    },

    hover: {
      y: 10,
    },
  };

  const creator = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 0 },
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <VStack
      overflow="hidden"
      border="27px"
      background={appStyle.colors.darkgrey10}
      spacing="0"
      width="100%"
      height="450px"
      bordersize="1px"
      bordercolor={appStyle.colors.darkgrey10}
      onHoverStart={() => {setIsVisible((isVisible) => !isVisible); setIsPlaying((isPlaying) => !isPlaying)}}
      onHoverEnd={() => {setIsVisible((isVisible) => !isVisible); setIsPlaying((isPlaying) => !isPlaying)}}
    >
      <ZStack overflow="hidden" border="27px">
        {/* NFT Image*/}

        <ZItem>
          {fileType.match("image.*") ? (
            <IconImg
              url={itemImage}
              width="100%"
              height="450px"
              backsize="cover"
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              border="27px"
            ></IconImg>
          ) : (
            <VStack
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              background={appStyle.colors.darkgrey10}
              height="370px"
            >
              <ReactPlayer
                url={itemImage}
                playing={isPlaying}
                muted={true}
                loop={true}
                width="100%"
                height="100%"
              />
            </VStack>
          )}
        </ZItem>
        {/* NFT Content*/}
        <ZItem>
          <VStack
            spacing="9px"
            background="linear-gradient(180.3deg, rgba(0, 0, 0, 0) 64.14%, rgba(0, 0, 0, 0.3) 78.31%, #000000 96.66%)"
          >
            <HStack padding="15px">
              {/* Creator Bubble*/}
              <Spacer></Spacer>

              <IconImg
                url={creatorImage}
                width="48px"
                height="48px"
                border="120px"
                bordersize="3px"
                bordercolor="white"
                whileTap={onClickCreator}
                backsize="cover"
              ></IconImg>
            </HStack>
            <Spacer></Spacer>
            <VStack
              background={background}
              width="100%"
              alignment="flex-start"
              padding="21px 21px 30px 21px"
              spacing="0px"
              maxheight="155px"
              animate={isVisible ? "hover" : "initial"}
              variants={moveContainer}
            >
              <BodyBold>{collectionName}</BodyBold>

              <HStack padding="9px 0" height="30px">
                <BodyRegular
                  display={"-webkit-box"}
                  overflow={"hidden"}
                  clamp={"1"}
                  orient={"vertical"}
                >
                  {itemNumber}
                </BodyRegular>
                <Spacer></Spacer>
                <HStack spacing="3px" alignment="center">
                  <IconImg
                    url={miniXdcLogo}
                    width="18px"
                    height="18px"
                  ></IconImg>
                  <TitleBold18>
                    {price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </TitleBold18>
                </HStack>
              </HStack>
              <Spacer></Spacer>
              <ButtonApp
                height="39px"
                text="Buy Now"
                textcolor={appStyle.colors.white}
                width="100%"
                onClick={onClick}
                cursor="pointer"
              ></ButtonApp>
            </VStack>
          </VStack>
        </ZItem>
      </ZStack>
    </VStack>
  );
}

export { NftContainer };
