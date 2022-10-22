import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import xdc from "../../images/miniXdcLogo.png";
import { XdcCounter } from "./XdcCounter";
import { BiblCounter } from "./BiblCounter";
import { GemCounter } from "./GemCounter";
import { TabedButtons } from "../../styles/Buttons/TabedButtons";

function PendingClaimed(props) {
  const { onlyOneToken } = props;

  const [isOneToken, setIsOneToken] = useState(onlyOneToken);

  return (
    <HStack
      width="100%"
      border="6px"
      background={({ theme }) => theme.faded}
      padding="15px"
    >
      {isOneToken ? (
        <>
          <VStack width="100%" spacing="3px">
            <CaptionBold initial={{ opacity: 0.6 }}>PENDING</CaptionBold>
            <XdcCounter amount="100" period={0}></XdcCounter>
          </VStack>

          <VStack width="100%" spacing="3px">
            <CaptionBold initial={{ opacity: 0.6 }}>CLAIMED</CaptionBold>
            <XdcCounter amount="100" period={0}></XdcCounter>
          </VStack>
        </>
      ) : (
        <VStack>
          <TabedButtons></TabedButtons>
          <HStack width="100%">
            <XdcCounter amount="200" period={0}></XdcCounter>
            <BiblCounter amount="300" period={0}></BiblCounter>
            <GemCounter amount="400" period={0}></GemCounter>
          </HStack>
        </VStack>
      )}
    </HStack>
  );
}

export { PendingClaimed };
