import React from "react";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { HStack, VStack, Spacer } from "../../../styles/Stacks";
import {
  BodyBold,
  BodyMedium,
  CaptionBoldShort,
  TitleBold30,
} from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { PBVandLP } from "./PBVandLP";
import { PCollection } from "./PCollection";
import { PCollectionAddress } from "./PCollectionAddress";
import { PRewardTRF } from "./PRewardTRF";

function Review() {
  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="auto">
        <VStack alignment="flex-start" spacing="6px" width="100%">
          <TitleBold30>Review</TitleBold30>
          <BodyMedium>Double check your staking pool settings</BodyMedium>
        </VStack>

        {/* NFT Collection Address */}

        <PCollectionAddress contract="0x8900388008588030985760957"></PCollectionAddress>

        {/* NFT Collection items */}

        <PCollection amount="340"></PCollection>

        {/* Reward Token, Rate and Frequency */}
        <PRewardTRF></PRewardTRF>

        {/* BackedValue and Lock in Period */}
        <PBVandLP hasBL={true}></PBVandLP>

        <ButtonM
          title="Publish Staking Pool"
          background={({ theme }) => theme.blue}
          textcolor="white"
          height="52px"
        ></ButtonM>
      </VStack>
    </HStack>
  );
}

export { Review };
