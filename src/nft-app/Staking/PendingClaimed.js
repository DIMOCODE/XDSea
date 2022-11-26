import React, { useEffect, useState } from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import xdc from "../../images/miniXdcLogo.png";
import { XdcCounter } from "./XdcCounter";
import { BiblCounter } from "./BiblCounter";
import { GemCounter } from "./GemCounter";
import { TabedButtons } from "../../styles/Buttons/TabedButtons";

function PendingClaimed(props) {
  const { onlyOneToken, stakeData, rewardRate, backedValue } = props;

  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (stakeData?.rewardsClaimed) {
      if (onlyOneToken) {
        setRewards([
          {
            ...stakeData?.rewardsClaimed[0],
          },
        ]);
      } else {
        //workflow for multiples coins
      }
    }
  }, [stakeData]);

  return (
    <HStack
      width="100%"
      border="6px"
      background={({ theme }) => theme.faded}
      padding="15px"
    >
      {onlyOneToken ? (
        <>
          <VStack width="100%" spacing="15px">
            <CaptionBold initial={{ opacity: 0.6 }}>PENDING</CaptionBold>
            <XdcCounter
              amount={rewards.length ? rewards[0].amountOfPendingRewards : "--"}
              period={0}
            ></XdcCounter>
          </VStack>

          <VStack width="100%" spacing="15px">
            <CaptionBold initial={{ opacity: 0.6 }}>CLAIMED</CaptionBold>
            <XdcCounter
              amount={rewards.length ? rewards[0].amountOfClaimedRewards : "0"}
              period={0}
            ></XdcCounter>
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
