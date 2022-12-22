import React from "react";
import { HStack, IconImg, VStack, Spacer } from "../../styles/Stacks";
import { BodyBold, CaptionBoldShort } from "../../styles/TextStyles";
import xdc from "../../images/miniXdcLogo.png";
import ReactPlayer from "react-player";

function NftMiniDetails(props) {
  const { image, title, type, price, width, usdPrice, redirect } = props;

  return (
    <HStack width={width || "100%"} self="none" onClick={redirect}>
      {type.match("image.*") ? (
        <IconImg
          url={image}
          width="60px"
          height="60px"
          cursor="pointer"
          border="6px"
          backsize="cover"
        ></IconImg>
      ) : (
        <ReactPlayer
          url={image}
          playing={true}
          muted={true}
          volume={0}
          loop={false}
          width="60px"
          height="60px"
        />
      )}

      <VStack alignment="flex-start" cursor="pointer" width="100%">
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
            (
            {(usdPrice?.xdcPrice * Number(price) > 100000
              ? Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(usdPrice?.xdcPrice * Number(price))
              : (usdPrice?.xdcPrice * Number(price)).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) || "0") + " USD"}
            )
          </CaptionBoldShort>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { NftMiniDetails };
