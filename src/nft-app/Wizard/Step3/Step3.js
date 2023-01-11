import React, { useState } from "react";

import { VStack, HStack } from "../../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { CreatedToken } from "./CreatedToken";
import { CreateNewToken } from "./CreateNewToken";
import { RewardFrequencyStep } from "./RewardFrequencyStep";
import { RewardRateStep } from "./RewardRateStep";
import { TokenGrid } from "./TokenGrid";

function Step3() {
  const [setStep, setIsStep] = useState(1);

  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 3</TitleBold30>
        {setStep === 1 && (
          <>
            <BodyRegular>Choose a reward token or add one</BodyRegular>

            <TokenGrid
              onClick={() => {
                setIsStep(2);
              }}
            ></TokenGrid>

            <RewardRateStep></RewardRateStep>

            <RewardFrequencyStep></RewardFrequencyStep>

            <ActionButtons
              grayBtn="Go Back"
              blueBtn="Continue"
              onClickBlue={() => setIsStep(3)}
            ></ActionButtons>
          </>
        )}

        {setStep === 2 && (
          <CreateNewToken onClickCancel={() => setIsStep(1)}></CreateNewToken>
        )}

        {setStep === 3 && (
          <CreatedToken onClick={() => setIsStep(1)}></CreatedToken>
        )}
      </VStack>
    </HStack>
  );
}

export { Step3 };
