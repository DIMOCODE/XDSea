import React from "react";
import { HStack, VStack } from "../../styles/Stacks";
import { ContentSteps } from "./ContentSteps";
import { SideSteps } from "./SideSteps";

function Wizard() {
  return (
    <HStack height="auto" width="100%" padding="90px 12px 90px 12px">
      <HStack
        height="789px"
        background="white"
        overflowx="hidden"
        border="9px"
        width="1200px"
      >
        <SideSteps></SideSteps>

        <ContentSteps step="step3"></ContentSteps>
      </HStack>
    </HStack>
  );
}

export { Wizard };
