import React from "react";
import { HStack, IconImg, VStack, Spacer } from "../../../styles/Stacks";
import xdsea from "../../../images/LogoXDSEA.png";
import {
  BodyBold,
  BodyMedium,
  BodyRegular,
  CaptionBoldShort,
  TitleRegular18,
} from "../../../styles/TextStyles";

function Post(props) {
  const { date, text } = props;

  return (
    <HStack width="100%" alignment="flex-start" padding="15px 21px">
      <IconImg
        url={xdsea}
        width="42px"
        height="42px"
        backsize="cover"
      ></IconImg>

      <VStack width="100%" spacing="9px">
        <HStack spacing="9px" responsive={true} alignment="flex-start">
          <BodyBold textcolor="white">XDSEA Team</BodyBold>
          <CaptionBoldShort textcolor="#A6FF61">{date} </CaptionBoldShort>
          <Spacer></Spacer>
        </HStack>

        <TitleRegular18 textcolor="white">{text}</TitleRegular18>
      </VStack>
    </HStack>
  );
}

export { Post };
