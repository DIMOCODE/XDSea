import React, { useState } from "react";
import { HOURS_BY_TIME } from "../../../constant";
import { HStack, VStack } from "../../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { RewardFrequencyStep } from "../Step3/RewardFrequencyStep";

function Step5(props) {
  const { onComplete, onBack, onNext } = props;
  const [lockPeriodAmount, setLockPeriodAmount] = useState("");
  const [lockPeriodType, setLockPeriodType] = useState("HOUR");
  const saveLockPeriod = () => {
    onComplete(true, lockPeriodAmount * HOURS_BY_TIME[lockPeriodType]);
    onNext();
  };
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 5</TitleBold30>
        <BodyRegular>Set the lock in period for your staking pool</BodyRegular>

        <RewardFrequencyStep
          time={lockPeriodAmount}
          timeType={lockPeriodType}
          onChangeTime={setLockPeriodAmount}
          onChangeTimeType={setLockPeriodType}
        />
        <ActionButtons
          grayBtn="Back"
          blueBtn="Continue"
          onClickGray={onBack}
          onClickBlue={saveLockPeriod}
          blueBtnDisabled={!lockPeriodAmount}
        />
      </VStack>
    </HStack>
  );
}

export { Step5 };
