import React from "react";
import { useState } from "react";
import { IconImg, VStack, Spacer, ZStack, ZItem, HStack } from "./Stacks";
import { appStyle } from "./AppStyles";
import verifiedMask from "../images/verifiedMask.png";
import verifiedShape from "../images/verifiedShape.png";
import verifiedBlue from "../images/verifiedBlue.png";
import miniXdcLogo from "../images/miniXdcLogo.png";
import {
  BodyRegular,
  BodyBold,
  CaptionBold,
  CaptionBoldShort,
  TitleBold21,
  CaptionRegular,
} from "./TextStyles";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { fromXdc, isXdc } from "../common/common";
import styled from "styled-components";

function Collection(props) {
  const {
    floorprice,
    owners,
    nfts,
    volumetraded,
    collectionImage,
    creatorLogo,
    collectionName,
    collectionDescription,
    onClickCollection,
    onClickCreator,
    creatorName,
    keyContent,
    keyID,
    isVerified,
    sortFloor,
    sortOwners,
    sortNFTs,
    sortVolume,
    sortDate,
  } = props;

  const scaleImage = {
    initial: {
      scale: 1.01,
    },
    hover: {
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.15,
      },
    },
  };
  const scaleContainer = {
    initial: {
      scale: 1,
      borderRadius: 15,
    },
    hover: {
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.15,
      },
      borderRadius: 15,
    },
  };
  const background = {
    initial: {
      background:
        "linear-gradient(359.63deg, rgba(2, 2, 2, 0.74) 10.27%, rgba(2, 2, 2, 0.602581) 25.13%, rgba(2, 2, 2, 0) 50.93%)",
    },
    hover: {
      transition: {
        type: "spring",
        bounce: 0.15,
      },
      background:
        "linear-gradient(359.63deg, rgba(2, 2, 2, 0.74) 5.27%, rgba(2, 2, 2, 0.74) 20.13%, rgba(2, 2, 2, 0.74) 40.93%)",
    },
  };
  const [isVisible, setIsVisible] = useState(false);

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 6) + "..." + address.substring(38)
      : "undefined";
  };

  return (
    <VStack
      overflow="hidden"
      border="15px"
      animate={isVisible ? "hover" : "initial"}
      variants={scaleContainer}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
      background={({ theme }) => theme.backElement}
      onClick={onClickCollection}
      width="100%"
      bordersize="0px"
    >
      <ZStack overflow="hidden" border="15px">
        <ZItem>
          <IconImg
            url={collectionImage}
            width="100%"
            height="100%"
            backsize="cover"
            animate={isVisible ? "initial" : "hover"}
            variants={scaleImage}
            border="15px"
            overflow="hidden"
          ></IconImg>
        </ZItem>
        <ZItem>
          <AnimatePresence initial={false}>
            <VStack
              spacing="0"
              padding="21px"
              animate={isVisible ? "hover" : "initial"}
              variants={background}
              cursor={"pointer"}
              border="12px"
            >
              <VStack
                cursor={"pointer"}
                key={keyID}
                initial={{
                  y: 0,
                  x: 0,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                layout
                width="100%"
              >
                <Spacer></Spacer>
                <motion.div layout="position" cursor={"pointer"}>
                  <VStack spacing="6px" cursor={"pointer"}>
                    {isVerified ? (
                      <>
                        <ZStack height="60px">
                          <ZItem>
                            <HStack>
                              <Mask img={verifiedMask}>
                                <IconImg
                                  url={creatorLogo}
                                  width="60px"
                                  height="60px"
                                  border="120px"
                                  backsize="cover"
                                ></IconImg>
                              </Mask>
                            </HStack>
                          </ZItem>

                          <ZItem>
                            <HStack>
                              {" "}
                              <IconImg
                                url={verifiedShape}
                                width="60px"
                                height="60px"
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
                            </HStack>
                          </ZItem>
                        </ZStack>
                      </>
                    ) : (
                      <IconImg
                        url={creatorLogo}
                        width="60px"
                        height="60px"
                        border="60px"
                        bordercolor="white"
                        bordersize="3px"
                        backsize="cover"
                        onClick={onClickCreator}
                        cursor={"pointer"}
                      ></IconImg>
                    )}

                    <CaptionBold textcolor={appStyle.colors.white}>
                      CREATOR
                    </CaptionBold>
                    <CaptionBoldShort
                      cursor={"pointer"}
                      textcolor={appStyle.colors.white}
                    >
                      {truncateAddress(
                        isXdc(creatorName) ? fromXdc(creatorName) : creatorName
                      )}
                    </CaptionBoldShort>
                    <TitleBold21
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}
                      width={"250px"}
                      textOverflow={"ellipsis"}
                      align={"center"}
                    >
                      {collectionName || "Collection Name"}
                    </TitleBold21>
                    <VStack
                      key={keyContent}
                      initial={{
                        y: 0,
                        x: 0,
                        opacity: 0,
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          bounce: 0.15,
                        },
                      }}
                      exit={{
                        y: 0,
                        opacity: 0,
                      }}
                      layout
                      width="100%"
                    >
                      <VStack width="100%">
                        <BodyRegular
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          width={"250px"}
                          textOverflow={"ellipsis"}
                          align="center"
                          textcolor={appStyle.colors.white}
                          cursor={"pointer"}
                        >
                          {collectionDescription || null}
                        </BodyRegular>
                        <HStack
                          spacing="6px"
                          width="100%"
                          background="transparent"
                        >
                          {/* Sorting by Floor Price */}
                          {sortFloor && (
                            <VStack
                              spacing="2px"
                              border="9px"
                              padding="12px 0"
                              width="100%"
                              background={appStyle.colors.darkgrey30}
                              blur="26px"
                            >
                              <HStack spacing="6px">
                                <IconImg
                                  url={miniXdcLogo}
                                  width="18px"
                                  height="18px"
                                ></IconImg>
                                <BodyBold textcolor={appStyle.colors.white}>
                                  {floorprice > 100000
                                    ? Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                      }).format(floorprice)
                                    : floorprice.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      }) || "0"}
                                </BodyBold>
                                <CaptionRegular textcolor="white">
                                  (
                                  {props.xdc.xdcPrice * floorprice > 100000
                                    ? Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                      }).format(props.xdc.xdcPrice * floorprice)
                                    : (
                                        props.xdc.xdcPrice * floorprice
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      }) || "0"}{" "}
                                  USD)
                                </CaptionRegular>
                              </HStack>{" "}
                              <CaptionRegular textcolor={appStyle.colors.white}>
                                Floor Price
                              </CaptionRegular>
                            </VStack>
                          )}

                          {/* Sorting by Owners */}
                          {sortOwners && (
                            <VStack
                              border="9px"
                              padding="12px 0"
                              spacing="9px"
                              background={appStyle.colors.darkgrey30}
                              blur="26px"
                            >
                              <HStack>
                                <CaptionRegular
                                  textcolor={appStyle.colors.white}
                                >
                                  Owners
                                </CaptionRegular>
                                <BodyBold textcolor={appStyle.colors.white}>
                                  {owners || "0"}
                                </BodyBold>{" "}
                              </HStack>
                            </VStack>
                          )}

                          {/* Sorting by NFTs Items */}
                          {sortNFTs && (
                            <HStack
                              border="9px"
                              padding="12px 0"
                              background={appStyle.colors.darkgrey30}
                              blur="26px"
                              spacing="9px"
                              width="100%"
                            >
                              <CaptionRegular textcolor={appStyle.colors.white}>
                                NFT Pieces
                              </CaptionRegular>{" "}
                              <BodyBold textcolor={appStyle.colors.white}>
                                {nfts || "0"}
                              </BodyBold>
                            </HStack>
                          )}

                          {sortVolume && (
                            <VStack
                              border="9px"
                              padding="12px 0"
                              background={appStyle.colors.darkgrey30}
                              blur="26px"
                              spacing="6px"
                            >
                              <HStack spacing="6px">
                                <IconImg
                                  url={miniXdcLogo}
                                  width="18px"
                                  height="18px"
                                ></IconImg>
                                <BodyBold textcolor={appStyle.colors.white}>
                                  {volumetraded > 100000
                                    ? Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                      }).format(volumetraded)
                                    : volumetraded.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      }) || "0"}
                                </BodyBold>
                                <CaptionRegular textcolor="white">
                                  (
                                  {props.xdc.xdcPrice * volumetraded > 100000
                                    ? Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                      }).format(
                                        props.xdc.xdcPrice * volumetraded
                                      )
                                    : (
                                        props.xdc.xdcPrice * volumetraded
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      }) || "0"}{" "}
                                  USD)
                                </CaptionRegular>
                              </HStack>
                              <CaptionRegular
                                textcolor={appStyle.colors.white}
                                align="center"
                              >
                                Volume Traded
                              </CaptionRegular>
                            </VStack>
                          )}

                          {sortDate && (
                            <VStack
                              border="9px"
                              padding="12px 0"
                              background={appStyle.colors.white30}
                              spacing="9px"
                            >
                              <HStack>
                                <CaptionRegular textcolor="white">
                                  Published
                                </CaptionRegular>

                                <CaptionBoldShort
                                  textcolor={appStyle.colors.white}
                                  align="center"
                                >
                                  10 Jan 2022
                                </CaptionBoldShort>
                              </HStack>
                            </VStack>
                          )}
                        </HStack>
                      </VStack>
                    </VStack>
                  </VStack>
                </motion.div>
              </VStack>
            </VStack>
          </AnimatePresence>
        </ZItem>
      </ZStack>
    </VStack>
  );
}

export { Collection };

const AbsoluteVerified = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  left: 136px;
`;

const Mask = styled(motion.div)`
  -webkit-mask-image: url(${(props) => props.img});
  mask-image: url(${(props) => props.img});
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  mask-position: 0% 0%;
  mask-size: 60px;
  height: 60px;
  width: 60px;
`;
