import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import miniXdcLogo from "../images/miniXdcLogo.png";
import notforsale from "../images/notforsale.png";
import verifiedShape from "../images/verifiedShape.png";
import verifiedBlue from "../images/verifiedBlue.png";
import verifiedMask from "../images/verifiedMask.png";
import star from "../images/stakeStar.png";
import sale from "../images/sale.png";
import relist from "../images/relist.png";
import sold from "../images/sold.png";
import {
  CaptionBoldShort,
  TitleBold18,
  CaptionRegular,
  BodyMedium,
  CaptionMedium,
  BodyRegular,
} from "./TextStyles";
import ReactPlayer from "react-player";
import { appStyle } from "./AppStyles";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";

function NftContainer(props) {
  const {
    elementKey,
    price,
    collectionName,
    itemNumber,
    creatorImage,
    itemImage,
    onClick,
    onClickCreator,
    fileType,
    owner,
    iconStatus,
    hasOffers,
    isVerified,
    usdPrice,
    collectionVerified,
    itemPreview,
    width,
    height,
    border,
    minwidth,
    minheight,
    setIsPlaying,
    isPlaying,
    nftIndex,
    hasStaking,
  } = props;

  const scaleImage = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
    },
  };

  const fadeText = {
    initial: {
      opacity: 0.3,
    },
    hover: {
      opacity: 1,
    },
  };

  const [isVisible, setIsVisible] = useState(false);
  const [nftStatus] = useState(iconStatus);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  function longPress(callback, ms = 250) {
    let timeout = null;

    const start = () => (timeout = setTimeout(callback, ms));
    const stop = () => timeout && window.clearTimeout(timeout);
    return callback
      ? {
          onMouseDown: start,
          onMouseUp: stop,
          onMouseLeave: stop,
          onTouchStart: start,
          onTouchMove: stop,
          onTouchEnd: stop,
        }
      : {};
  }

  return (
    <VStack
      key={elementKey}
      cursor={"pointer"}
      overflow="hidden"
      border={border}
      background={appStyle.colors.darkgrey10}
      spacing="0"
      minwidth={minwidth || "auto"}
      width={width || "100%"}
      height={height || "100%"}
      minheight={minheight || "auto"}
      bordersize="0px"
      bordercolor={appStyle.colors.darkgrey10}
      onHoverStart={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying(nftIndex, false);
      }}
      onHoverEnd={() => {
        setIsVisible((isVisible) => !isVisible);
        setIsPlaying(nftIndex, false);
      }}
    >
      <ZStack overflowy="hidden" border={border}>
        <ZItem>
          {fileType.match("image.*") ? (
            <IconImg
              url={itemImage}
              width="100%"
              height="100%"
              backsize="cover"
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              border={border}
              cursor={"pointer"}
            ></IconImg>
          ) : fileType.match("video.*") ? (
            <VStack
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              background={"black"}
              height="100%"
            >
              <ReactPlayer
                url={itemImage}
                playing={isPlaying}
                muted={true}
                volume={0}
                loop={true}
                width="120%"
                height="100%"
              />
            </VStack>
          ) : (
            <IconImg
              url={itemPreview}
              width="100%"
              height="100%"
              backsize="cover"
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              border={border}
              cursor={"pointer"}
            ></IconImg>
          )}
        </ZItem>
        <ZItem
          {...longPress(() => {
            setIsPlaying(nftIndex, true);
          })}
        >
          <VStack
            spacing="0"
            background=" linear-gradient(1.11deg, rgba(0, 0, 0, 0.89) 8.6%, rgba(0, 0, 0, 0.18) 28.93%, rgba(0, 0, 0, 0) 36.1%)"
            cursor={"pointer"}
            onClick={onClick}
            height="100%"
            border="0 0 6px 6px"
          >
            <HStack padding="15px" cursor={"pointer"}>
              {/* {creatorImage ? (
                isVerified ? (
                  <>
                    <ZStack>
                      <ZItem>
                        <Mask img={verifiedMask}>
                          <IconImg
                            url={creatorImage}
                            width="52px"
                            height="52px"
                            border="120px"
                            backsize="cover"
                          ></IconImg>
                        </Mask>
                      </ZItem>

                      <ZItem>
                        <IconImg
                          url={verifiedShape}
                          width="52px"
                          height="52px"
                          border="120px"
                          whileTap={onClickCreator}
                          backsize="cover"
                          cursor={"pointer"}
                        ></IconImg>
                        <AbsoluteVerified>
                          <IconImg
                            url={verifiedBlue}
                            width="21px"
                            height="21px"
                            border="120px"
                          ></IconImg>
                        </AbsoluteVerified>
                      </ZItem>
                    </ZStack>

                    <Spacer></Spacer>
                  </>
                ) : (
                  <>
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
                    <Spacer></Spacer>
                    {owner ? (
                      <OwnerTag>OWNER</OwnerTag>
                    ) : (
                      <CreatorTag>CREATOR</CreatorTag>
                    )}
                  </>
                )
              ) : (
                <Spacer></Spacer>
              )} */}

              <Spacer></Spacer>
              {(() => {
                switch (nftStatus) {
                  case "relist":
                    return (
                      <IconImg
                        url={relist}
                        width="36px"
                        height="36px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  case "sale":
                    return (
                      <IconImg
                        url={sale}
                        width="36px"
                        height="36px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  case "sold":
                    return (
                      <IconImg
                        url={sold}
                        width="30px"
                        height="30px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  case "not_sale":
                    return (
                      <IconImg
                        url={notforsale}
                        width="36px"
                        height="36px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  default:
                    return <></>;
                }
              })()}
            </HStack>

            <VStack
              width="100%"
              alignment="flex-start"
              spacing="3px"
              animate={isVisible ? "hover" : "initial"}
              initial={false}
              height="auto"
              padding="0"
              cursor={"pointer"}
            >
              <Spacer></Spacer>

              {/* <HStack spacing="6px">
                <CaptionBoldShort
                  variants={fadeText}
                  animate={isVisible ? "hover" : "initial"}
                  textcolor={appStyle.colors.white}
                  cursor={"pointer"}
                >
                  {collectionName}
                </CaptionBoldShort>
                {collectionVerified ? (
                  <IconImg
                    url={verifiedBlue}
                    width="15px"
                    height="15px"
                    border="120px"
                  ></IconImg>
                ) : null}
                <Spacer></Spacer>
              </HStack> */}

              <HStack
                height="auto"
                justify="flex-start"
                cursor={"pointer"}
                padding="0 15px"
              >
                <BodyMedium
                  display={"-webkit-box"}
                  overflow={"hidden"}
                  clamp={"1"}
                  orient={"vertical"}
                  textcolor={appStyle.colors.white}
                >
                  {truncate(itemNumber, 33)}
                </BodyMedium>
              </HStack>
              {price ? (
                <HStack
                  spacing="3px"
                  alignment="center"
                  padding="0 15px 12px 15px"
                  cursor={"pointer"}
                >
                  <IconImg
                    url={miniXdcLogo}
                    width="18px"
                    height="18px"
                  ></IconImg>
                  <BodyMedium textcolor={appStyle.colors.white}>
                    {Number(price) > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(Number(price))
                      : Number(price).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        }) || "0"}
                  </BodyMedium>
                  <CaptionMedium textcolor="white" animate={{ opacity: 0.6 }}>
                    (
                    {(usdPrice?.xdcPrice * Number(price) > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(usdPrice?.xdcPrice * Number(price))
                      : (usdPrice?.xdcPrice * Number(price)).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0") + " USD"}
                    )
                  </CaptionMedium>

                  <Spacer></Spacer>
                  {hasOffers && (
                    <HStack
                      background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                      border="30px"
                      padding="6px 11px"
                    >
                      <CaptionBoldShort textcolor="white">!</CaptionBoldShort>
                    </HStack>
                  )}
                </HStack>
              ) : null}

              {hasStaking && (
                <HStack
                  background={({ theme }) => theme.blue}
                  height="24px"
                  border="0 0 6px 6px"
                  spacing="6px"
                >
                  <CaptionBoldShort textcolor="white">STAKING</CaptionBoldShort>
                  <IconImg url={star} width="15px" height="15px"></IconImg>
                </HStack>
              )}
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
  left: 13px;
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
  left: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const AbsoluteVerified = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  left: 30px;
`;

const Mask = styled(motion.div)`
  -webkit-mask-image: url(${(props) => props.img});
  mask-image: url(${(props) => props.img});
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  mask-position: 0% 0%;
  mask-size: 52px;
  height: 52px;
  width: 52px;
`;
