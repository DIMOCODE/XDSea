import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import miniXdcLogo from "../images/miniXdcLogo.png";
import { BodyBold, BodyRegular, TitleBold18 } from "./TextStyles";
import ReactPlayer from "react-player";
import { appStyle } from "./AppStyles";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";

function NftContainer(props) {
  const {
    price,
    collectionName,
    itemNumber,
    creatorImage,
    itemImage,
    onClick,
    onClickCreator,
    fileType,
    owner,
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
      y: 69,
    },
  };
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <VStack
      cursor={"pointer"}
      overflow="hidden"
      border="27px"
      background={appStyle.colors.darkgrey10}
      spacing="0"
      width="100%"
      height="450px"
      bordersize="1px"
      bordercolor={appStyle.colors.darkgrey10}
      onHoverStart={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying((isPlaying) => !isPlaying);
      }}
      onHoverEnd={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying((isPlaying) => !isPlaying);
      }}
    >
      <ZStack overflow="hidden" border="27px">
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
              cursor={"pointer"}
            ></IconImg>
          ) : (
            <VStack
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              background={appStyle.colors.darkgrey10}
              height="100%"
            >
              <ReactPlayer
                url={itemImage}
                playing={isPlaying}
                muted={true}
                loop={true}
                width="123%"
                height="100%"
              />
            </VStack>
          )}
        </ZItem>
        <ZItem>
          <VStack
            spacing="9px"
            background="linear-gradient(180.3deg, rgba(0, 0, 0, 0) 64.14%, rgba(0, 0, 0, 0.3) 78.31%, #000000 96.66%)"
            cursor={"pointer"}
            onClick={onClick}
          >
            <HStack padding="15px">
              {owner ? (
                <OwnerTag>OWNER</OwnerTag>
              ) : (
                <CreatorTag>CREATOR</CreatorTag>
              )}
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
                cursor={"pointer"}
              ></IconImg>
            </HStack>
            <Spacer></Spacer>
            <VStack
              // background={background}
              width="100%"
              alignment="flex-start"
              padding="21px 21px 30px 21px"
              spacing="0px"
              maxheight="155px"
              animate={isVisible ? "hover" : "initial"}
              variants={moveContainer}
              initial={false}
            >
              <BodyBold textcolor={appStyle.colors.white}>
                {collectionName}
              </BodyBold>
              <HStack padding="9px 0" height="30px">
                <BodyRegular
                  display={"-webkit-box"}
                  overflow={"hidden"}
                  clamp={"1"}
                  orient={"vertical"}
                  textcolor={appStyle.colors.white}
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
                  <TitleBold18 textcolor={appStyle.colors.white}>
                    {Number(price).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }) || "0"}
                  </TitleBold18>
                </HStack>
              </HStack>
              <Spacer></Spacer>
              {/* <ButtonApp
                height="39px"
                text="Buy Now"
                textcolor={appStyle.colors.white}
                width="100%"
                onClick={onClick}
                cursor="pointer"
                btnStatus={0}
              ></ButtonApp> */}
            </VStack>
          </VStack>
        </ZItem>
      </ZStack>
    </VStack>
  );
}

export { NftContainer };

const OwnerTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 13px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;
