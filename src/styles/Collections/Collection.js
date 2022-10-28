import React from "react";
import { useState } from "react";
import { IconImg, VStack, Spacer, ZStack, ZItem, HStack } from "../Stacks";
import { appStyle } from "../AppStyles";

import verifiedShape from "../../images/verifiedShape.png";
import verifiedBlue from "../../images/verifiedBlue.png";
import miniXdcLogo from "../../images/miniXdcLogo.png";
import star from "../../images/starColor.png";
import {
  BodyRegular,
  BodyBold,
  CaptionBold,
  CaptionBoldShort,
  TitleBold21,
  CaptionRegular,
  BodyMedium,
} from "../TextStyles";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { fromXdc, isXdc, truncateAddress } from "../../common/common";
import styled from "styled-components";
import { StakeOptions } from "./StakeOptions";

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
    isStake,
    stakeEnabled
  } = props;

  const scaleImage = {
    initial: {
      scale: 1.05,
    },
    hover: {
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.15,
      },
    },
  };

  const [isVisible, setIsVisible] = useState(false);

  return (
    <VStack
      overflowx="hidden"
      border="9px"
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
      background={({ theme }) => theme.faded}
      onClick={onClickCollection}
      width="100%"
      bordersize="0px"
    >
      <ZStack overflow="hidden" border="9px">
        <ZItem>
          <IconImg
            url={collectionImage}
            width="100%"
            height="100%"
            backsize="cover"
            animate={isVisible ? "initial" : "hover"}
            variants={scaleImage}
            border="9px"
            overflow="hidden"
          ></IconImg>
        </ZItem>
        <ZItem>
          <VStack
            spacing="0"
            padding="18px"
            cursor={"pointer"}
            border="9px"
            background={
              isStake
                ? "linear-gradient(357.4deg, #000000 42.29%, rgba(0, 0, 0, 0) 82%)"
                : "linear-gradient(0.6deg, #000000 7.19%, rgba(0, 0, 0, 0) 30.73%)"
            }
          >
            <Spacer></Spacer>

            {isStake ? (
              <StakeOptions
                collection={collectionName || "Collection Name"}
                advance={60}
                stakers="334"
                tvl="39"
              ></StakeOptions>
            ) : (
              <HStack width="100%" spacing="0px">
                <VStack
                  spacing="6px"
                  cursor={"pointer"}
                  width="100%"
                  alignment="flex-start"
                >
                  <CaptionBoldShort
                    initial={{ opacity: 0.6 }}
                    textcolor={appStyle.colors.white}
                  >
                    COLLECTION
                  </CaptionBoldShort>

                  <BodyMedium textcolor="white">
                    {collectionName || "Collection Name"}
                  </BodyMedium>

                  <HStack
                    self="none"
                    background="white"
                    border="30px"
                    padding="3px 6px"
                    spacing="6px"
                    onClick={onClickCreator}
                  >
                    <IconImg
                      url={creatorLogo}
                      width="21px"
                      height="21px"
                      border="30px"
                      backsize="cover"
                      cursor={"pointer"}
                    ></IconImg>

                    <CaptionBoldShort
                      cursor={"pointer"}
                      textcolor={appStyle.colors.text}
                    >
                      By {creatorName}
                    </CaptionBoldShort>

                    {isVerified && (
                      <IconImg
                        url={verifiedBlue}
                        width="21px"
                        height="21px"
                        border="120px"
                      ></IconImg>
                    )}
                  </HStack>
                </VStack>

                {sortVolume && (
                  <VStack spacing="3px" maxwidth="81px" justify="flex-end">
                    <CaptionRegular
                      textcolor={appStyle.colors.white}
                      align="center"
                      initial={{ opacity: 0.6 }}
                    >
                      TRADED
                    </CaptionRegular>
                    <HStack spacing="3px">
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
                    </HStack>

                    <CaptionRegular
                      textcolor="white"
                      initial={{ opacity: 0.6 }}
                    >
                      (
                      {props.xdc.xdcPrice * volumetraded > 100000
                        ? Intl.NumberFormat("en-US", {
                            notation: "compact",
                            maximumFractionDigits: 0,
                          }).format(props.xdc.xdcPrice * volumetraded)
                        : (props.xdc.xdcPrice * volumetraded).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            }
                          ) || "0"}{" "}
                      USD)
                    </CaptionRegular>
                  </VStack>
                )}
              </HStack>
            )}
          </VStack>
        </ZItem>
      </ZStack>

      {stakeEnabled && (
        <StakeBtn>
          <VStack
            spacing="0px"
            background={({ theme }) => theme.blue}
            padding="9px"
            border="0px 9px 0px 9px"
          >
            <HStack spacing="3px">
              <CaptionBoldShort initial={{ opacity: 0.6 }} textcolor="white">
                STAKE
              </CaptionBoldShort>
              <IconImg url={star} width="12px" height="12px"></IconImg>
            </HStack>

            <BodyBold textcolor="white">56%</BodyBold>
            <CaptionBoldShort textcolor="white" initial={{ opacity: 0.6 }}>
              APR
            </CaptionBoldShort>
          </VStack>
        </StakeBtn>
      )}
    </VStack>
  );
}

export { Collection };

const StakeBtn = styled(motion.div)`
  position: absolute;
  top: 0px;
  right: 0px;
`;
