import React from "react";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { VStack, HStack } from "../../../styles/Stacks";
import { TitleBold30 } from "../../../styles/TextStyles";

function Step3() {
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 3</TitleBold30>
        <BodyRegular>Choose a reward token or add one</BodyRegular>

        <TokenGrid></TokenGrid>

        <HStack>
          <ButtonM
            title="Go Back"
            background={({ theme }) => theme.faded30}
            height="52px"
          ></ButtonM>
          <ButtonM
            title="Continue"
            background={({ theme }) => theme.blue}
            textcolor="white"
            height="52px"
          ></ButtonM>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { Step3 };
