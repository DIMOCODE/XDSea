import React from "react";
import { HStack, IconImg, VStack, Spacer } from "../../../styles/Stacks";
import {
  CaptionBold,
  CaptionBoldShort,
  CaptionTiny,
  TitleBold15,
} from "../../../styles/TextStyles";
import xdc from "../../../images/miniXdcLogo.png";

function MiniPreview(props) {
  const { image, nftname, nftvalue, maxwidth, minwidth, hasEarning } = props;
  return (
    <VStack
      minwidth={minwidth}
      maxwidth={maxwidth}
      padding="21px"
      border="6px"
      background={({ theme }) => theme.faded}
    >
      <HStack width="100%">
        <IconImg
          url={image}
          width="66px"
          height="66px"
          border="6px"
          backsize="cover"
        ></IconImg>

        <VStack alignment="flex-start" width="100%" spacing="3px">
          <TitleBold15>{nftname}</TitleBold15>
          <CaptionTiny textcolor={({ theme }) => theme.blue}>
            BACKED VALUE
          </CaptionTiny>
          <HStack spacing="6px">
            <IconImg url={xdc} width="15px" height="15px"></IconImg>
            <TitleBold15>{nftvalue}</TitleBold15>
            <CaptionBoldShort initial={{ opacity: 0.6 }}>
              (000 usd)
            </CaptionBoldShort>
            <Spacer></Spacer>
          </HStack>
        </VStack>
      </HStack>

      <HStack height="52px">
        <CaptionBold>Earning Rate Here</CaptionBold>
      </HStack>
    </VStack>
  );
}

export { MiniPreview };
