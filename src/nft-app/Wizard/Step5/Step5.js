import React from "react";
import { HStack, VStack } from "../../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { RewardFrequencyStep } from "../Step3/RewardFrequencyStep";

function Step5() {
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 5</TitleBold30>
        <BodyRegular>Set the lock in period for your staking pool</BodyRegular>

        <RewardFrequencyStep></RewardFrequencyStep>
        <ActionButtons grayBtn="Close" blueBtn="Continue"></ActionButtons>
      </VStack>
    </HStack>
  );
}

export { Step5 };
