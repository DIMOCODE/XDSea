import React, { useEffect } from "react";
import { truncateAddress } from "../../common/common";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack } from "../../styles/Stacks";
import { BodyMedium, TitleBold30 } from "../../styles/TextStyles";
import { PBVandLP } from "./Review/PBVandLP";
import { PCollection } from "./Review/PCollection";
import { PCollectionAddress } from "./Review/PCollectionAddress";
import { PRewardTRF } from "./Review/PRewardTRF";

function AdminWizard(props) {
  const { stakingPool } = props;
  useEffect(() => {
    console.log("werwer", stakingPool);
  }, []);

  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="auto">
        <TitleBold30>Your Staking Pool</TitleBold30>
        <PCollectionAddress
          contract={truncateAddress(stakingPool?.collectionId.address)}
        ></PCollectionAddress>
        <PCollection amount={stakingPool.items}></PCollection>

        <PRewardTRF rewardRates={stakingPool.rewardRates} />

        <PBVandLP
          hasBL={stakingPool.isBackedValue}
          backedValue={stakingPool.backedValuesAmount}
          lockPeriod={stakingPool.lockPeriod}
        ></PBVandLP>

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