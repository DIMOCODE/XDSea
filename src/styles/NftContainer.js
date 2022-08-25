import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import miniXdcLogo from "../images/miniXdcLogo.png";
import notforsale from "../images/notforsale.png";
import verifiedShape from "../images/verifiedShape.png";
import verifiedBlue from "../images/verifiedBlue.png";
import verifiedMask from "../images/verifiedMask.png";
import sale from "../images/sale.png";
import relist from "../images/relist.png";
import sold from "../images/sold.png";
import { CaptionBoldShort, TitleBold18, CaptionRegular } from "./TextStyles";
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
    iconStatus,
    hasOffers,
    isVerified,
    usdPrice,
    collectionVerified
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
  // const moveContainer = {
  //   initial: {
  //     y: 69,
  //   },
  //   hover: {
  //     y: 69,
  //   },
  // };
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nftStatus] = useState(iconStatus);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <VStack
      cursor={"pointer"}
      overflow="hidden"
      border="12px"
      background={appStyle.colors.darkgrey10}
      spacing="0"
      width="100%"
      height="390px"
      bordersize="0px"
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
      <ZStack overflow="hidden" border="12px">
        <ZItem>
          {fileType.match("image.*") ? (
            <IconImg
              url={itemImage}
              width="100%"
              height="100%"
              backsize="cover"
              animate={isVisible ? "hover" : "initial"}
              variants={scaleImage}
              border="12px"
              cursor={"pointer"}
            ></IconImg>
          ) : (
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
          )}
        </ZItem>
        <ZItem>
          <VStack
            spacing="0
            "
            background="linear-gradient(180.3deg, rgba(0, 0, 0, 0) 64.14%, rgba(0, 0, 0, 0.3) 78.31%, #000000 96.66%)"
            cursor={"pointer"}
            onClick={onClick}
            height="100%"
          >
            <HStack padding="15px" cursor={"pointer"}>
              {isVerified ? (
                <>
                  <ZStack>
                    <ZItem>
                      <Mask img={verifiedMask}>
                        <IconImg
                          url={creatorImage}
                          width="48px"
                          height="48px"
                          border="120px"
                          backsize="cover"
                        ></IconImg>
                      </Mask>
                    </ZItem>

                    <ZItem>
                      <IconImg
                        url={verifiedShape}
                        width="48px"
                        height="48px"
                        border="120px"
                        whileTap={onClickCreator}
                        backsize="cover"
                        cursor={"pointer"}
                        style={{
                          boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.15)",
                        }}
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
              )}

              {(() => {
                switch (nftStatus) {
                  case "relist":
                    return (
                      <IconImg
                        url={relist}
                        width="48px"
                        height="48px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  case "sale":
                    return (
                      <IconImg
                        url={sale}
                        width="48px"
                        height="48px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  case "sold":
                    return (
                      <IconImg
                        url={sold}
                        width="48px"
                        height="48px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                  default:
                    return (
                      <IconImg
                        url={notforsale}
                        width="48px"
                        height="48px"
                        border="120px"
                        backsize="cover"
                        cursor={"pointer"}
                      ></IconImg>
                    );
                }
              })()}
            </HStack>

            <VStack
              width="100%"
              alignment="flex-start"
              spacing="0px"
              animate={isVisible ? "hover" : "initial"}
              initial={false}
              height="auto"
              padding="0 21px 21px 21px "
              cursor={"pointer"}
            >
              <Spacer></Spacer>

              <HStack spacing="6px">
                <CaptionBoldShort
                  variants={fadeText}
                  animate={isVisible ? "hover" : "initial"}
                  textcolor={appStyle.colors.white}
                  cursor={"pointer"}
                >
                  {collectionName}
                </CaptionBoldShort>
                {collectionVerified
                  ? (
                    <IconImg
                      url={verifiedBlue}
                      width="15px"
                      height="15px"
                      border="120px"
                    ></IconImg>
                  )
                  : null
                }
                <Spacer></Spacer>
              </HStack>

              <HStack
                padding="6px 0"
                height="auto"
                justify="flex-start"
                cursor={"pointer"}
              >
                <TitleBold18
                  display={"-webkit-box"}
                  overflow={"hidden"}
                  clamp={"1"}
                  orient={"vertical"}
                  textcolor={appStyle.colors.white}
                >
                  {truncate(itemNumber, 33)}
                </TitleBold18>
              </HStack>
              <HStack spacing="3px" alignment="center" cursor={"pointer"}>
                <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
                <TitleBold18
                  // variants={fadeText}
                  // animate={isVisible ? "hover" : "initial"}
                  textcolor={appStyle.colors.white}
                >
                  {Number(price) > 100000
                    ? Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(Number(price))
                    : Number(price).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) || "0"}
                </TitleBold18>
                <CaptionRegular textcolor="white" animate={{ opacity: 0.6 }}>
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
                </CaptionRegular>

                <Spacer></Spacer>
                {hasOffers && (
                  <HStack
                    background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                    border="30px"
                    padding="3px 6px"
                  >
                    <CaptionBoldShort textcolor="white">
                      HAS OFFERS
                    </CaptionBoldShort>
                  </HStack>
                )}
              </HStack>
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
  bottom: -3px;
  left: 30px;
`;

const Mask = styled(motion.div)`
  -webkit-mask-image: url(${(props) => props.img});
  mask-image: url(${(props) => props.img});
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  mask-position: 0% 0%;
  mask-size: 48px;
  height: 48px;
  width: 48px;
`;
