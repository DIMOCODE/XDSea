import React from "react";
import { VStack, HStack } from "../../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../../styles/TextStyles";

function InfoBar(props) {
  const { logo, token, rewardrate, frequency } = props;
  return (
    <HStack>
      <VStack
        maxwidth="42px"
        height="42px"
        background="gray"
        backgroundimage={logo}
        border="42px"
      ></VStack>

      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Name</CaptionBoldShort>
        <BodyMedium>{token || "Token"}</BodyMedium>
      </VStack>
      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Reward Rate</CaptionBoldShort>
        <BodyMedium>{rewardrate}</BodyMedium>
      </VStack>
      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Frequency</CaptionBoldShort>
        <BodyMedium>{frequency} Hrs</BodyMedium>
      </VStack>
    </HStack>
  );
}

function PRewardTRF(props) {
  const { rewardRates } = props;
  return (
    <VStack alignment="flex-start" height="120px" width="100%">
      <BodyMedium>Reward Token, Rate & Frequency</BodyMedium>

      <HStack
        height="auto"
        background={({ theme }) => theme.faded30}
        border="6px"
        width="100%"
        padding="15px 21px"
      >
        <VStack spacing="18px">
          {rewardRates?.map((rwRt) => (
            <InfoBar
              key={rwRt._id}
              logo={rwRt.rewardTypeId.iconUrl}
              token={rwRt.rewardTypeId.name}
              rewardrate={rwRt.amount}
              frequency={rwRt.rewardFrecuency}
            ></InfoBar>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
}

export { PRewardTRF };
