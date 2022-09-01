import React from "react";
import { VStack, HStack, IconImg, Spacer } from "../../styles/Stacks";
import {
  TitleBold15,
  TitleBold18,
  CaptionSmallRegular,
  TitleSemi18,
  TitleSemi21,
  CaptionBoldShort,
} from "../../styles/TextStyles";
import exampleImage from "../../images/mountain.jpg";

function Activity() {
  return (
    <VStack
      background={({ theme }) => theme.backElement}
      width="100%"
      minheight="560px"
      border="6px"
      padding="21px"
      alignment="flex-end"
      cursor="pointer"
    >
      <TitleSemi18>Activity</TitleSemi18>

      {/* Notifications */}
      <VStack
        spacing="30px"
        width="100%"
        justify={"flex-start"}
        overflowy="scroll"
      >
        {/* Sold Notification */}
        <HStack spacing="9px">
          <VStack spacing="6px" alignment="flex-end">
            <CaptionSmallRegular>
              {" "}
              You sold <b>Fibowall #11</b> 🎉
            </CaptionSmallRegular>
            <CaptionSmallRegular animate={{ opacity: 0.6 }}>
              8 mins ago
            </CaptionSmallRegular>
          </VStack>

          <IconImg
            url={exampleImage}
            width="33px"
            height="33px"
            border="3px"
            backsize="cover"
          ></IconImg>
        </HStack>

        {/* Offer Notification */}
        <HStack spacing="9px">
          <VStack spacing="6px" alignment="flex-end">
            <CaptionSmallRegular>
              <b>300 XDC</b>offer on <b>Fibowall #11</b> 💰
            </CaptionSmallRegular>
            <CaptionSmallRegular animate={{ opacity: 0.6 }}>
              10 mins ago
            </CaptionSmallRegular>
          </VStack>

          <IconImg
            url={exampleImage}
            width="33px"
            height="33px"
            border="3px"
            backsize="cover"
          ></IconImg>
        </HStack>

        {/* New Follower */}
        <HStack spacing="9px">
          <VStack spacing="6px" alignment="flex-end">
            <CaptionSmallRegular>
              <b>XDSeaMonkeys</b> is following you ⚡️
            </CaptionSmallRegular>
            <CaptionSmallRegular animate={{ opacity: 0.6 }}>
              30 mins ago
            </CaptionSmallRegular>
          </VStack>

          <IconImg
            url={exampleImage}
            width="33px"
            height="33px"
            border="3px"
            backsize="cover"
          ></IconImg>
        </HStack>

        <Spacer></Spacer>
      </VStack>

      <HStack height="49px">
        {/* Tag Sold */}
        <HStack
          cursor="pointer"
          whileTap={{ scale: 0.9 }}
          self="none"
          spacing="9px"
        >
          <TitleSemi21 cursor="pointer">🎉</TitleSemi21>
          <HStack
            cursor="pointer"
            border="6px"
            width="30px"
            height="30px"
            background={({ theme }) => theme.faded}
          >
            <CaptionBoldShort>1</CaptionBoldShort>
          </HStack>
        </HStack>

        {/* Tag Offer */}
        <HStack
          cursor="pointer"
          whileTap={{ scale: 0.9 }}
          self="none"
          spacing="9px"
        >
          <TitleSemi21 cursor="pointer">💰</TitleSemi21>
          <HStack
            cursor="pointer"
            border="6px"
            width="30px"
            height="30px"
            background={({ theme }) => theme.faded}
          >
            <CaptionBoldShort>1</CaptionBoldShort>
          </HStack>
        </HStack>

        {/* Tag Follower */}
        <HStack
          cursor="pointer"
          whileTap={{ scale: 0.9 }}
          self="none"
          spacing="9px"
        >
          <TitleSemi21 cursor="pointer">⚡️</TitleSemi21>
          <HStack
            cursor="pointer"
            border="6px"
            width="30px"
            height="30px"
            background={({ theme }) => theme.faded}
          >
            <CaptionBoldShort>1</CaptionBoldShort>
          </HStack>
        </HStack>

        {/* All */}
        <HStack
          cursor="pointer"
          whileTap={{ scale: 0.9 }}
          self="none"
          spacing="9px"
        >
          <HStack cursor="pointer" border="6px" width="30px" height="30px">
            <CaptionBoldShort>ALL</CaptionBoldShort>
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  );
}

export { Activity };
