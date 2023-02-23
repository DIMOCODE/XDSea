import React, { useState } from "react";
import { useEffect } from "react";
import { calculatePeriod } from "../../../common/common";
import { HStack, VStack } from "../../../styles/Stacks";
import { BodyMedium, BodyBold } from "../../../styles/TextStyles";

function PBVandLP(props) {
  const { hasBL, backedValue, lockPeriod } = props;

  const [lockPeriodLabel, setLockPeriodLabel] = useState("");
  useEffect(() => {
    const lockPeriodInTime = calculatePeriod(lockPeriod);

    setLockPeriodLabel(lockPeriodInTime);
  }, [lockPeriod]);

  return (
    <HStack>
      {hasBL && (
        <VStack width="100%" spacing="9px" alignment="flex-start">
          <BodyMedium>Backed Value</BodyMedium>
          <HStack
            height="52px"
            background="rgba(54, 102, 255, 0.21)"
            border="6px"
            width="100%"
            padding="0 18px"
          >
            <BodyBold textcolor={({ theme }) => theme.blueText}>
              {`${backedValue} Value Locked`}
            </BodyBold>
          </HStack>
        </VStack>
      )}

      <VStack width="100%" spacing="9px" alignment="flex-start">
        <BodyMedium>Lock in Period</BodyMedium>

        <HStack
          height="52px"
          background={({ theme }) => theme.faded30}
          border="6px"
          width="100%"
        >
          <BodyBold>{lockPeriodLabel}</BodyBold>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { PBVandLP };
