import React from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import {
  TitleBold15,
  TitleRegular33,
  BodyBold,
  CaptionBoldShort,
  TitleRegular21,
  CaptionSmallRegular,
} from "./TextStyles";

import firstPlace from "../images/firstPlace.png";
import secondPlace from "../images/secondPlace.png";
import thirdPlace from "../images/thirdPlace.png";
import miniXdcLogo from "../images/miniXdcLogo.png";
import { useState } from "react";
import useWindowSize from "../styles/useWindowSize";

function TopCollectionItem(props) {
  const size = useWindowSize();
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

  const [hasCup, setHasCup] = useState(0);

  const creator = {
    initial: {
      background: "rgba(255, 255, 255, 1)",
    },
    hover: {
      background: "rgba(255, 255, 255, 1)",
    },
  };
  const opacity = {
    hover: { background: "rgba(255, 255, 255, 0)", opacity: 1, x: 3 },
    initial: { background: "rgba(255, 255, 255, 0)", opacity: 0.3, x: 0 },
  };

  return (
    <VStack
      border="12px"
      padding="9px, 12px"
      width={width}
      spacing="0px"
      animate={isVisible ? "hover" : "initial"}
      variants={creator}
      onHoverStart={() => setIsVisible((isVisible) => !isVisible)}
      onHoverEnd={() => setIsVisible((isVisible) => !isVisible)}
      onClick={onClick}
      cursor={"pointer"}
    >
      <HStack padding="12px 12px ">
        <TitleRegular21
          textcolor={({ theme }) => theme.text}
          animate={isVisible ? "hover" : "initial"}
          variants={opacity}
        >
          {position || "0"}
        </TitleRegular21>
        <IconImg
          url={imageCreator}
          width="30px"
          height="30px"
          border="90px"
          bordersize="3px"
          bordercolor="white"
          cursor={"pointer"}
          backsize="cover"
          style={{
            boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
          }}
        ></IconImg>
        <TitleBold15>{collectionName || "Collection Name"}</TitleBold15>
        <Spacer></Spacer>

        {hasCup === 1 && (
          <IconImg url={miniXdcLogo} with="21px" height="21px"></IconImg>
        )}

        {hasCup === 2 && (
          <IconImg url={secondPlace} with="21px" height="21px"></IconImg>
        )}

        {hasCup === 3 && (
          <IconImg url={thirdPlace} with="21px" height="21px"></IconImg>
        )}
      </HStack>
      <Divider></Divider>
      <HStack spacing="0px" padding="0 ">
        {/* Floor Price and Owners */}

        <VStack spacing="3px" padding="6px" cursor={"pointer"} width="100%">
          <CaptionSmallRegular animate={{ opacity: 0.6 }}>
            NFT's
          </CaptionSmallRegular>
          <BodyBold>{nfts || "0"}</BodyBold>
        </VStack>

        <VStack spacing="3px" cursor={"pointer"}>
          <CaptionSmallRegular animate={{ opacity: 0.6 }}>
            Owners
          </CaptionSmallRegular>

          <BodyBold>{owners || "0"}</BodyBold>
        </VStack>

        {/* NFT and Volume */}

        <VStack spacing="3px" padding="6px" cursor={"pointer"}>
          <CaptionSmallRegular animate={{ opacity: 0.6 }}>
            Floor Price
          </CaptionSmallRegular>
          <HStack spacing="6px">
            <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
            <BodyBold>
              {floorprice.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) || "0"}
            </BodyBold>
          </HStack>
        </VStack>

        <VStack spacing="3px" padding="6px" cursor={"pointer"}>
          <CaptionSmallRegular animate={{ opacity: 0.6 }}>
            Volume Traded
          </CaptionSmallRegular>
          <HStack spacing="6px">
            <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
            <BodyBold>
            {volumetraded > 100000
              ? (Intl.NumberFormat('en-US', {
                notation: "compact",
                maximumFractionDigits: 2
              }).format(volumetraded))
            : (
              volumetraded.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) || "0"
            )}
            </BodyBold>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}

export { TopCollectionItem };
