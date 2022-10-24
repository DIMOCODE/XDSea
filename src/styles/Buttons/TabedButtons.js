import React, { useState } from "react";
import { HStack } from "../Stacks";
import { CaptionMedium } from "../TextStyles";

function TabedButtons() {
  const [isPending, setIsPending] = useState(false);

  return (
    <HStack
      width="100%"
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
        onClick={() => setIsPending(true)}
        background={
          isPending ? ({ theme }) => theme.backElement : "transparent"
        }
      >
        <CaptionMedium
          cursor="pointer"
          textcolor={
            isPending ? ({ theme }) => theme.text : ({ theme }) => theme.faded60
          }
        >
          {" "}
          PENDING
        </CaptionMedium>
      </HStack>

      <HStack
        height="100%"
        width="100%"
        border="3px"
        cursor="pointer"
        onClick={() => setIsPending(false)}
        background={
          isPending ? "transparent" : ({ theme }) => theme.backElement
        }
      >
        <CaptionMedium
          cursor="pointer"
          textcolor={
            isPending ? ({ theme }) => theme.faded60 : ({ theme }) => theme.text
          }
        >
          CLAIMED
        </CaptionMedium>
      </HStack>
    </HStack>
  );
}

export { TabedButtons };
