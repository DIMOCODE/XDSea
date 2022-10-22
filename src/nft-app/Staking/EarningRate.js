import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer } from "../../styles/Stacks";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import xdc from "../../images/miniXdcLogo.png";
import { XdcCounter } from "./XdcCounter";
import { BiblCounter } from "./BiblCounter";
import { GemCounter } from "./GemCounter";
import { MultiTab } from "../../styles/Buttons/MultiTab";

function EarningRate(props) {
  const { onlyOneToken } = props;

  const [isOneToken, setIsOneToken] = useState(onlyOneToken);

  return (
    <HStack width="100%">
      <VStack
        width="100%"
        border="6px"
        background={({ theme }) => theme.faded}
        padding="15px"
      >
        {isOneToken ? (
          <VStack width="100%">
            <CaptionBold initial={{ opacity: 0.6 }}>EARNING RATE</CaptionBold>
            <HStack width="100%">
              <XdcCounter amount="100" period={1}></XdcCounter>
              <XdcCounter amount="100" period={2}></XdcCounter>
              <XdcCounter amount="100" period={3}></XdcCounter>
            </HStack>
          </VStack>
        ) : (
          <VStack width="100%">
            <HStack>
              <CaptionBold initial={{ opacity: 0.6 }}>EARNING RATE</CaptionBold>
              <Spacer></Spacer>
              <MultiTab></MultiTab>
            </HStack>
            <HStack width="100%">
              <XdcCounter amount="100" period={1}></XdcCounter>
              <BiblCounter amount="200" period={1}></BiblCounter>
              <GemCounter amount="300" period={1}></GemCounter>
            </HStack>
          </VStack>
        )}
      </VStack>
    </HStack>
  );
}

export { EarningRate };
