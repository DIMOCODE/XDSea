import React, { useEffect, useState } from "react";
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

function Review(props) {
  const [backedValAmount, setBackedValAmount] = useState(0);

  const {
    onCreateStakingPool,
    address,
    lockPeriod,
    isEditing,
    rewards,
    nftsStakeables,
    nftsBackedValues,
    isBackedValue,
  } = props;

  useEffect(() => {
    let amount = 0;
    nftsBackedValues.forEach((nft) => {
      amount += Number(nft.backedValue);
    });

    setBackedValAmount(amount);
  }, [nftsBackedValues]);

  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="auto">
        <VStack alignment="flex-start" spacing="6px" width="100%">
          <TitleBold30>Review</TitleBold30>
          <BodyMedium>Double check your staking pool settings</BodyMedium>
        </VStack>

        {/* NFT Collection Address */}

        <PCollectionAddress contract={address}></PCollectionAddress>

        {/* NFT Collection items */}

        <PCollection amount={nftsStakeables?.length ?? "--"}></PCollection>

        {/* Reward Token, Rate and Frequency */}
        <PRewardTRF
          rewardRates={
            rewards?.map((r) => ({
              ...r,
              rewardTypeId: {
                iconUrl: r.iconUrl,
                name: r.name,
              },
            })) ?? []
          }
        />

        {/* BackedValue and Lock in Period */}
        <PBVandLP
          hasBL={isBackedValue}
          backedValue={backedValAmount}
          lockPeriod={lockPeriod}
        />

        <ButtonM
          title={
            isEditing ? "Update your Staking Pool" : "Publish Staking Pool"
          }
          background={({ theme }) => theme.blue}
          textcolor="white"
          height="52px"
          onClick={onCreateStakingPool}
        ></ButtonM>
      </VStack>
    </HStack>
  );
}

export { Review };
