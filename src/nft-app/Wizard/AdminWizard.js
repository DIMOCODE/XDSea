import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack } from "../../styles/Stacks";
import { BodyMedium, TitleBold30 } from "../../styles/TextStyles";
import { PBVandLP } from "./Review/PBVandLP";
import { PCollection } from "./Review/PCollection";
import { PCollectionAddress } from "./Review/PCollectionAddress";
import { PRewardTRF } from "./Review/PRewardTRF";

function AdminWizard() {
  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="auto">
        <TitleBold30>Your Staking Pool</TitleBold30>
        <PCollectionAddress contract="0x99849837949488"></PCollectionAddress>
        <PCollection amount="300"></PCollection>

        <PRewardTRF></PRewardTRF>
        <PBVandLP></PBVandLP>

        <ButtonM
          title="Edit Staking Pool"
          background={({ theme }) => theme.blue}
          textcolor="white"
          height="52px"
        ></ButtonM>
      </VStack>
    </HStack>
  );
}
export { AdminWizard };
