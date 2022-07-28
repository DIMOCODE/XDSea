import React from "react";
import { HStack, IconImg, VStack } from "./Stacks";
import {
  TitleBold15,
  TitleRegular33,
  BodyBold,
  CaptionBoldShort,
  TitleRegular21,
} from "./TextStyles";
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
  const creator = {
    initial: {
      background: "rgba(255, 255, 255, 0)",
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
      cursor={"pointer"}
    >
      <TitleRegular21
        textcolor={({ theme }) => theme.text}
        animate={isVisible ? "hover" : "initial"}
        variants={opacity}
      >
        {position || "0"}
      </TitleRegular21>
      <IconImg
        url={imageCreator}
        width="54px"
        height="54px"
        border="90px"
        bordersize="3px"
        bordercolor="white"
        cursor={"pointer"}
        backsize="cover"
        style={{
          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
        }}
      ></IconImg>
      <VStack spacing="6px" alignment="flex-start" cursor={"pointer"}>
        <TitleBold15>{collectionName || "Collection Name"}</TitleBold15>

        <HStack responsive="true" cursor={"pointer"} spacing="6px">
          {/* Floor Price and Owners */}

          <HStack
            // background={
            //   size.width > 414 ? "transparent" : ({ theme }) => theme.faded
            // }
            spacing="6px"
            border="6px"
            width="100%"
          >
            {" "}
            <VStack spacing="3px" padding="6px" cursor={"pointer"} width="100%">
              <CaptionBoldShort>NFT's</CaptionBoldShort>
              <BodyBold>{nfts || "0"}</BodyBold>
            </VStack>
            <VStack spacing="3px" cursor={"pointer"}>
              <CaptionBoldShort>Owners</CaptionBoldShort>
              <BodyBold>{owners || "0"}</BodyBold>
            </VStack>
          </HStack>

          {/* NFT and Volume */}

          <HStack
            // background={
            //   size.width > 414 ? "transparent" : ({ theme }) => theme.faded
            // }
            spacing="6px"
            border="6px"
            width="100%"
          >
            <VStack spacing="3px" padding="6px" cursor={"pointer"}>
              <CaptionBoldShort>Floor Price</CaptionBoldShort>
              <HStack spacing="6px">
                <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
                <BodyBold>
                  {floorprice > 100000
                   ? (Intl.NumberFormat('en-US', {
                      notation: "compact",
                      maximumFractionDigits: 2
                    }).format(floorprice))
                  : (
                    floorprice.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }) || "0"
                  )}
                </BodyBold>
              </HStack>
            </VStack>

            <VStack spacing="3px" padding="6px" cursor={"pointer"}>
              <CaptionBoldShort>Volume Traded</CaptionBoldShort>
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
        </HStack>
      </VStack>
    </HStack>
  );
}

export { TopCollectionItem };
