import React, { useState } from "react";
import { HStack } from "../Stacks";
import { CaptionMedium } from "../TextStyles";

function MultiTab() {
  const [isPeriod, setIsPeriod] = useState(0);

  return (
    <HStack
      width="42%"
      spacing="0px"
      background={({ theme }) => theme.faded}
      height="30px"
      padding="3px"
      border="6px"
    >
      <HStack
        height="100%"
        width="100%"
        border="3px"
        cursor="pointer"
        onClick={() => setIsPeriod(0)}
        background={
          isPeriod === 0 ? ({ theme }) => theme.backElement : "transparent"
        }
      >
        <CaptionMedium
          cursor="pointer"
          textcolor={
            isPeriod === 0
              ? ({ theme }) => theme.text
              : ({ theme }) => theme.faded60
          }
        >
          D
        </CaptionMedium>
      </HStack>

      <HStack
        height="100%"
        width="100%"
        border="3px"
        cursor="pointer"
        onClick={() => setIsPeriod(1)}
        background={
          isPeriod === 1 ? ({ theme }) => theme.backElement : "transparent"
        }
      >
        <CaptionMedium
          cursor="pointer"
          textcolor={
            isPeriod === 1
              ? ({ theme }) => theme.text
              : ({ theme }) => theme.faded60
          }
        >
          Mo
        </CaptionMedium>
      </HStack>

      <HStack
        height="100%"
        width="100%"
        border="3px"
        cursor="pointer"
        onClick={() => setIsPeriod(2)}
        background={
          isPeriod === 2 ? ({ theme }) => theme.backElement : "transparent"
        }
      >
        <CaptionMedium
          cursor="pointer"
          textcolor={
            isPeriod === 2
              ? ({ theme }) => theme.text
              : ({ theme }) => theme.faded60
          }
        >
          Yr
        </CaptionMedium>
      </HStack>
    </HStack>
  );
}

export { MultiTab };
