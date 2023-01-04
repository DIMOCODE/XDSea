import React from "react";
import { VStack } from "../../styles/Stacks";
import { LogoWizard } from "./LogoWizard";
import { StepWiz } from "./StepWiz";

function SideSteps() {
  return (
    <VStack maxwidth="390px" minwidth="390px" background="green">
      <LogoWizard isWizard={true}></LogoWizard>

      <VStack width="100%" spacing="0px" maxheight="520px">
        <StepWiz
          title="Step 1"
          description="Address of your nft collection"
          selected={true}
          completed={false}
        ></StepWiz>
        <StepWiz
          title="Step 2"
          description="Choose NFTs from your collection"
          selected={false}
          completed={false}
        ></StepWiz>
        <StepWiz
          title="Step 3"
          description="Reward Token, Rate & Frequency"
          selected={false}
          completed={false}
        ></StepWiz>
        <StepWiz
          title="Step 4"
          description="Add Backed Value"
          selected={false}
          completed={false}
        ></StepWiz>
        <StepWiz
          title="Step 5"
          description="Lock In Period"
          selected={false}
          completed={false}
        ></StepWiz>
      </VStack>
    </VStack>
  );
}

export { SideSteps };
