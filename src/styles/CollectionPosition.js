import React from "react";
import { VStack, HStack, IconImg, Spacer, ZStack, ZItem } from "./Stacks";
import {
  BodyRegular,
  TitleBold21,
  TitleRegular21,
  TitleRegular18,
  TitleRegular27,
} from "./TextStyles";
import logoWhiteX from "../images/logoWhiteX.png";
import newBlue from "../images/newBlue.jpg";

function CollectionPosition(props) {
  const { rank, name, amount, creator, percent, nickName, redirect } = props;
  return (
    <HStack
      background="linear-gradient(204.15deg, rgba(255, 255, 255, 0.49) 12.72%, rgba(255, 255, 255, 0) 116.77%)"
      height="136px"
      border="6px"
      padding="0 21px"
    >
      <TitleRegular27>{rank || 0}</TitleRegular27>
      <IconImg
        url={creator || newBlue}
        width="66px"
        height="66px"
        backsize="cover"
        border="66px"
        bordersize="3px"
        bordercolor="white"
        cursor={"pointer"}
        onClick={() => redirect(`collection/${nickName}`)}
      ></IconImg>

      <VStack spacing="9px">
        <HStack>
          <TitleRegular21 textcolor="black">
            {name || "Collection Name"}
          </TitleRegular21>
          <Spacer></Spacer>
        </HStack>

        {/* Advance Bar */}
        <ZStack height="6px" width="100%">
          <ZItem>
            <HStack
              width="100%"
              background="rgba(20, 16, 16, 0.15);"
              height="6px"
              border="6px"
            ></HStack>
          </ZItem>

          <ZItem>
            <HStack
              width={percent || "30%"}
              background="linear-gradient(269.98deg, #42F4FF -2.6%, #14D4E0 21.21%, #0769FB 103.73%)"
              height="6px"
              border="6px"
            ></HStack>
          </ZItem>
        </ZStack>

        <HStack>
          <BodyRegular>Volume Traded</BodyRegular>
          <Spacer></Spacer>
          <HStack
            self="none"
            height="33px"
            border="30px"
            padding="0 15px "
            spacing="9px"
            background="linear-gradient(317.1deg, #0905C4 16.98%, #2D28FF 32.68%, #59E1FF 98.99%, #71FCF4 128.65%)"
          >
            <BodyRegular textcolor="white">{amount || "0"}</BodyRegular>

            <IconImg url={logoWhiteX} width="18px" height="18px"></IconImg>
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { CollectionPosition };
