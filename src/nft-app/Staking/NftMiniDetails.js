import React from "react";
import { HStack, IconImg, VStack, Spacer } from "../../styles/Stacks";
import { BodyBold, CaptionBoldShort } from "../../styles/TextStyles";
import xdc from "../../images/miniXdcLogo.png";

function NftMiniDetails(props) {
  const { image, title, price, width } = props;

  return (
    <HStack width={width || "100%"} self="none">
      <IconImg
        url={image}
        width="60px"
        height="60px"
        cursor="pointer"
        border="6px"
        backsize="cover"
      ></IconImg>

      <VStack alignment="flex-start" cursor="pointer">
        <BodyBold cursor="pointer">{title}</BodyBold>
        <HStack cursor="pointer" spacing="6px" self="none">
          <BodyBold cursor="pointer">{price}</BodyBold>
          <IconImg
            cursor="pointer"
            url={xdc}
            width="18px"
            height="18px"
          ></IconImg>
          <CaptionBoldShort cursor="pointer" initial={{ opacity: 0.6 }}>
            (000 usd)
          </CaptionBoldShort>
          <Spacer></Spacer>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { NftMiniDetails };
