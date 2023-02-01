import React, { useState } from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";

import { HStack, VStack } from "../../styles/Stacks";
import { BodyMedium, BodyRegular, TitleBold30 } from "../../styles/TextStyles";
import { InputWizard } from "./InputWizard";

function Step1({ onComplete, onNext, onBack }) {
  const [address, setAddress] = useState("");
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step1</TitleBold30>
        <BodyRegular>
          Paste the address contract of your NFT Collection
        </BodyRegular>

        <InputWizard
          onComplete={(flag) => onComplete(flag, address)}
          onChange={(add) => setAddress(add)}
        ></InputWizard>

        <HStack>
          <ButtonM
            title="Cancel Creation"
            background={({ theme }) => theme.faded30}
            height="52px"
            onClick={onBack}
          ></ButtonM>
          <ButtonM
            onClick={onNext}
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

export { Step1 };
