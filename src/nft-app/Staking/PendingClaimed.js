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
  const { onlyOneToken, stakeData, rewardRate, backedValue } = props;

  const [isOneToken, setIsOneToken] = useState(onlyOneToken);

  const getReward = (id) => {
    var rewards = {};
    rewardRate?.map((reward) => {
      if(reward._id === id) {
        rewards = reward.amount * backedValue;
      }
      return rewards;
    });
    return rewards;
  }

  const getClaimed = () => {
    var amount = 0;
    stakeData?.rewardsClaimed?.map((reward) => {
      amount += reward.amountOfPeriods * getReward(reward._id);
    });
    return amount;
  }

  const getPending = () => {
    return stakeData?.amountminutesSinceLastReward / (stakeData?.stakingPoolId?.rewardFrecuency * 60) * getReward(stakeData?.stakingPoolId?.rewardRates[0]?._id);
  }

  return (
    <HStack
      width="100%"
      border="6px"
      background={({ theme }) => theme.faded}
      padding="15px"
    >
      {isOneToken ? (
        <>
          <VStack width="100%" spacing="15px">
            <CaptionBold initial={{ opacity: 0.6 }}>PENDING</CaptionBold>
            <XdcCounter amount={isNaN(getPending()) ? "-" : (getPending() > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(getPending())
                      : (getPending()).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0")} period={0}></XdcCounter>
          </VStack>

          <VStack width="100%" spacing="15px">
            <CaptionBold initial={{ opacity: 0.6 }}>CLAIMED</CaptionBold>
            <XdcCounter amount={getClaimed()} period={0}></XdcCounter>
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
