import React from "react";
import { appStyle } from "./AppStyles";
import ButtonApp from "./Buttons";
import { HStack, IconImg, Spacer, VStack } from "./Stacks";
import {
  BodyRegular,
  BodyBold,
  TitleBold18,
  CaptionBoldShort,
} from "./TextStyles";
import miniXdcLogo from "../images/miniXdcLogo.png";

function CollectionUserProfile(props) {
  const {
    title,
    description,
    floorprice,
    textcolor,
    owners,
    nfts,
    volumetraded,
    image1,
    image2,
    image3,
    image4,
    sizetiles,
    background,
    onClick,
  } = props;

  return (
    <HStack
      responsive={true}
      border="15px"
      padding="21px "
      spacing="21px"
      bordersize="1px"
      bordercolor="rgba(153, 162, 175, 0.33)"
    >
      <HStack
        padding="15px 0"
        width="310px"
        maxheight="300px"
        maxwidth="310px"
        flexwrap="wrap"
      >
        <IconImg
          url={image1}
          width={sizetiles}
          height={sizetiles}
          border="15px"
        ></IconImg>
        <IconImg
          url={image2}
          width={sizetiles}
          height={sizetiles}
          border="15px"
        ></IconImg>

        <IconImg
          url={image3}
          width={sizetiles}
          height={sizetiles}
          border="15px"
        ></IconImg>
        <IconImg
          url={image4}
          width={sizetiles}
          height={sizetiles}
          border="15px"
        ></IconImg>
      </HStack>

      <VStack maxwidth="300px" minwidth="310px">
        <TitleBold18 textcolor={textcolor}>
          {title || "Collection Name "}
        </TitleBold18>
        <BodyRegular textcolor={textcolor}>
          {description || "Collection Description"}
        </BodyRegular>

        <HStack>
          <VStack
            spacing="9px"
            border="9px"
            padding="18px 0"
            background={background}
            width="100%"
          >
            <HStack spacing="6px">
              <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
              <BodyBold>{floorprice || "0"}</BodyBold>
            </HStack>
            <CaptionBoldShort>Floor Price</CaptionBoldShort>
          </VStack>

          <VStack
            border="9px"
            padding="18px 0"
            spacing="9px"
            background={background}
            width="100%"
          >
            <BodyBold>{owners || "0"}</BodyBold>{" "}
            <CaptionBoldShort>Owners</CaptionBoldShort>
          </VStack>
        </HStack>

        <HStack>
          <VStack
            border="9px"
            padding="18px 0"
            background={background}
            spacing="9px"
            width="100%"
          >
            <BodyBold>{nfts || "0"}</BodyBold>
            <CaptionBoldShort> NFT's</CaptionBoldShort>{" "}
          </VStack>
          <VStack
            border="9px"
            padding="18px 0"
            background={background}
            spacing="9px"
            width="100%"
          >
            <HStack spacing="6px">
              <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>
              <BodyBold>{volumetraded || "0"}</BodyBold>
            </HStack>
            <CaptionBoldShort>Volume Traded</CaptionBoldShort>
          </VStack>
        </HStack>
        <ButtonApp
          height="39px"
          text="Visit Collection"
          textcolor={appStyle.colors.white}
          onClick={onClick}
          btnStatus={0}
        ></ButtonApp>
      </VStack>
    </HStack>
  );
}

export { CollectionUserProfile };
