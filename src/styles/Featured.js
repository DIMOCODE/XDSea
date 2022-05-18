import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import { BodyBold, CaptionBold, CaptionRegular } from "./TextStyles";
import ReactPlayer from "react-player";
import styled from "styled-components";

import { appStyle } from "./AppStyles";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import { LoadingFeatured } from "./LoadingFeatured";

function Featured(props) {
  const {
    creatorName,
    collectionName,
    itemNumber,
    creatorImage,
    itemImage,
    width,
    height,
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

  const scaleContainer = {
    initial: {
      scale: 1,
    },

    hover: {
      scale: 1.02,
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
      spacing="0"
      width="100%"
      height={height}
      animate={isVisible ? "hover" : "initial"}
      variants={scaleContainer}
      onHoverStart={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying((isPlaying) => !isPlaying);
      }}
      onHoverEnd={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying((isPlaying) => !isPlaying);
      }}
    >
      {itemImage === undefined ? (
        <LoadingFeatured></LoadingFeatured>
      ) : (
        <ZStack
          key="Loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* NFT Image*/}

          <ZItem>
            {fileType.match("image.*") ? (
              <IconImg
                url={itemImage}
                width="100%"
                height="100%"
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
                height={height}
              >
                <AbsolutePlayer>
                  <ReactPlayer
                    url={itemImage}
                    playing={isPlaying}
                    muted={true}
                    loop={true}
                    width="100%"
                    height="100%"
                  />
                </AbsolutePlayer>
              </VStack>
            )}
          </ZItem>
          {/* NFT Content*/}
          <ZItem>
            <VStack
              padding="15px 0px"
              spacing="9px"
              background="linear-gradient(180.3deg, rgba(0, 0, 0, 0) 64.14%, rgba(0, 0, 0, 0.3) 78.31%, #000000 96.66%)"
            >
              <HStack padding="0 15px">
                {/* Creator Bubble*/}
                <Spacer></Spacer>
                <AnimatePresence>
                  <HStack
                    variants={creator}
                    background="white"
                    style={{
                      borderRadius: "30px",
                    }}
                    layout
                    spacing="0"
                    padding="3px"
                    overflow="hidden"
                    whileTap={onClickCreator}
                  >
                    {isVisible && (
                      <VStack
                        variants={creator}
                        key={1}
                        initial="hidden"
                        animate="visible"
                        layoutId={1}
                        layout="position"
                        exit="hidden"
                        spacing="0px"
                        alignment="flex-end"
                        padding="0 15px"
                      >
                        <CaptionBold textcolor={appStyle.colors.darkgrey60}>
                          CREATOR
                        </CaptionBold>
                        <CaptionRegular textcolor={appStyle.colors.black}>
                          {creatorName}
                        </CaptionRegular>
                      </VStack>
                    )}
                    <IconImg
                      variants={creator}
                      key={2}
                      layoutId={2}
                      url={creatorImage}
                      width="48px"
                      height="48px"
                      border="120px"
                    ></IconImg>
                  </HStack>
                </AnimatePresence>
              </HStack>
              <Spacer></Spacer>
              <BodyBold textcolor={appStyle.colors.white}>
                {collectionName}
              </BodyBold>
              <CaptionBold textcolor={appStyle.colors.white}>
                {itemNumber}
              </CaptionBold>
            </VStack>
          </ZItem>
        </ZStack>
      )}
    </VStack>
  );
}

export { Featured };

const AbsolutePlayer = styled(motion.div)`
  position: absolute;
  width: 560px;

  top: 0px;
`;
