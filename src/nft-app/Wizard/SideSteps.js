import React, { useEffect } from "react";
import { Spacer, VStack } from "../../styles/Stacks";
import { LogoWizard } from "./LogoWizard";
import { StepWiz } from "./StepWiz";
import gradient from "../../images/meshGradient.png";
import { PublishedPool } from "./PublishedPool";
import { WIZARD_STEPS } from "../../constant";

function SideSteps(props) {
  const {
    currentStep,
    didSelectStep,
    currentStakingPool,
    step1Validated,
    step2Validated,
    step3Validated,
    step4Validated,
    step5Validated,
  } = props;

  return (
    <VStack maxwidth="390px" minwidth="390px" backgroundimage={gradient}>
      <LogoWizard isWizard={props.isAdmin}></LogoWizard>

      {!props.isEditing && props.isAdmin ? (
        <VStack width="100%" spacing="0px" maxheight="520px">
          <PublishedPool date={currentStakingPool.createdAt}></PublishedPool>
          <Spacer></Spacer>
        </VStack>
      ) : (
        <VStack width="100%" spacing="0px" maxheight="520px">
          <StepWiz
            title="Step 1"
            description="Address of your nft collection"
            selected={currentStep === WIZARD_STEPS.step1}
            completed={step1Validated}
            didSelect={() => didSelectStep(WIZARD_STEPS.step1)}
          ></StepWiz>
          <StepWiz
            title="Step 2"
            description="Choose NFTs from your collection"
            selected={currentStep === WIZARD_STEPS.step2}
            completed={step2Validated}
            didSelect={() => didSelectStep(WIZARD_STEPS.step2)}
          ></StepWiz>
          <StepWiz
            title="Step 3"
            description="Reward Token, Rate & Frequency"
            selected={currentStep === WIZARD_STEPS.step3}
            completed={step3Validated}
            didSelect={() => didSelectStep(WIZARD_STEPS.step3)}
          ></StepWiz>
          <StepWiz
            title="Step 4"
            description="Add Backed Value"
            selected={currentStep === WIZARD_STEPS.step4}
            completed={step4Validated}
            didSelect={() => didSelectStep(WIZARD_STEPS.step4)}
          ></StepWiz>
          <StepWiz
            title="Step 5"
            description="Lock In Period"
            selected={currentStep === WIZARD_STEPS.step5}
            completed={step5Validated}
            didSelect={() => didSelectStep(WIZARD_STEPS.step5)}
          ></StepWiz>
        </VStack>
      )}
    </VStack>
  );
}

export { SideSteps };
