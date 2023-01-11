import React from "react";
import { VStack, HStack } from "../../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../../styles/TextStyles";

function InfoBar(props) {
  return (
    <HStack>
      <VStack
        maxwidth="42px"
        height="42px"
        background="gray"
        backgroundimage={props.logo}
        border="42px"
      ></VStack>

      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Name</CaptionBoldShort>
        <BodyMedium>{props.token || "Token"}</BodyMedium>
      </VStack>
      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Reward Rate</CaptionBoldShort>
        <BodyMedium>{props.rewardrate}</BodyMedium>
      </VStack>
      <VStack spacing="3px" width="100%">
        <CaptionBoldShort>Frequency</CaptionBoldShort>
        <BodyMedium>{props.frequency}</BodyMedium>
      </VStack>
    </HStack>
  );
}

function PRewardTRF() {
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
          <InfoBar token="" rewardrate="300" frequency="3 day"></InfoBar>
          <InfoBar token="" rewardrate="300" frequency="3 day"></InfoBar>
        </VStack>
      </HStack>
    </VStack>
  );
}

export { PRewardTRF };
