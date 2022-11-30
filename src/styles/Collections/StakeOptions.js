import React from "react";
import { HStack, VStack, ZStack, ZItem, IconImg, Spacer } from "../Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBold,
  CaptionBoldShort,
  BodyMedium,
  TitleBold18,
  CaptionMedium,
} from "../TextStyles";
import { StakeBar } from "./StakeBar";
import xdc from "../../images/miniXdcLogo.png";
import { ButtonM } from "../Buttons/ButtonM";

function StakeOptions(props) {
  const { advance, stakers, tvl, collection } = props;

  return (
    <VStack width="100%" spacing="18px" alignment="flex-start">
      {/* Pool name */}
      <VStack spacing="6px" alignment="flex-start">
        <CaptionBoldShort initial={{ opacity: 0.6 }} textcolor="white">
          COLLECTION
        </CaptionBoldShort>
        <BodyMedium textcolor="white">{collection}</BodyMedium>
      </VStack>

      {/* Advance bar */}
      {/* <StakeBar advance={advance}></StakeBar> */}
      {/* <HStack> */}
        {/* Stakers */}
        {/* <VStack
          background="rgba(255, 255, 255, 0.12)"
          height="52px"
          width="100%"
          border="6px"
          spacing="3px"
        >
          <CaptionMedium textcolor="white">Stakers</CaptionMedium>

          <TitleBold18 textcolor="white">{stakers}</TitleBold18>
        </VStack> */}

        {/* Value Stakers */}
        {/* <VStack
          background="rgba(255, 255, 255, 0.12)"
          height="52px"
          width="100%"
          border="6px"
          spacing="3px"
        >
          <CaptionMedium textcolor="white">Total Value Locked</CaptionMedium>

          <HStack spacing="3px" alignment="flex-end">
            <HStack spacing="3px" justify="flex-end">
              <IconImg
                url={xdc}
                width="18px"
                height="18
              px"
              ></IconImg>

              <TitleBold18 textcolor="white">{tvl}</TitleBold18>
            </HStack>
            <CaptionMedium textcolor="white" initial={{ opacity: 0.6 }}>
              000 USD
            </CaptionMedium>
          </HStack>
        </VStack>
      </HStack> */}

      <ButtonM
        title="Visit Pool"
        textcolor="black"
        background="white"
      ></ButtonM>
    </VStack>
  );
}

export { StakeOptions };
