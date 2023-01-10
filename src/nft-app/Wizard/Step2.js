import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { VStack, HStack } from "../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../styles/TextStyles";
import { GridNFT } from "./GridNFT";

function Step2() {
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="600px" alignment="flex-start">
        <TitleBold30>Step2</TitleBold30>

        <GridNFT></GridNFT>

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

export { Step2 };
