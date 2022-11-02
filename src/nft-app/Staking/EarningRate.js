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
  const { onlyOneToken, rewardRate, rewardFrequency, backedValue } = props;

  const [isOneToken,] = useState(onlyOneToken);

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
              {rewardRate
                ? rewardRate[0]?.rewardTypeId?.type === "coin"
                  ? <>
                    <XdcCounter amount={backedValue * 24 * rewardRate[0]?.amount / rewardFrequency} period={1}></XdcCounter>
                    <XdcCounter amount={backedValue * 730 * rewardRate[0]?.amount / rewardFrequency} period={2}></XdcCounter>
                    <XdcCounter amount={backedValue * 8760 * rewardRate[0]?.amount / rewardFrequency} period={3}></XdcCounter> 
                  </>
                  : <></>
                : <></>
              }
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
