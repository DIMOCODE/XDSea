import React, { useEffect } from "react";
import { WIZARD_STEPS, WIZARD_STATUS } from "../../constant";

import { HStack } from "../../styles/Stacks";
import { AdminWizard } from "./AdminWizard";
import { LoadingState } from "./LoadingState";
import { Review } from "./Review/Review";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3/Step3";
import { Step4 } from "./Step4/Step4";
import { Step5 } from "./Step5/Step5";

function ContentSteps(props) {
  const {
    step,
    currentStakingPool,
    collectionId,
    isEditing,
    validateStep,
    didSelectStep,
  } = props;

  const handleStepOne = (isValid, address) => {
    validateStep(1, isValid, address);
  };

  const handleStepTwo = (isValid, nftsSelected) => {
    console.info(isValid, nftsSelected);
    validateStep(
      2,
      isValid,
      nftsSelected.map((nft) => nft._id)
    );
  };

  if (currentStakingPool) {
    if (isEditing) {
      switch (step) {
        case WIZARD_STEPS.step1:
          return <Step1 onComplete={handleStepOne}></Step1>;
        case WIZARD_STEPS.step2:
          return <Step2 onComplete={() => validateStep(2)}></Step2>;
        case WIZARD_STEPS.step3:
          return <Step3 onComplete={() => validateStep(3)}></Step3>;
        case WIZARD_STEPS.step4:
          return <Step4 onComplete={() => validateStep(4)}></Step4>;
        case WIZARD_STEPS.step5:
          return <Step5 onComplete={() => validateStep(5)}></Step5>;
        default:
          return <LoadingState state={step}></LoadingState>;
      }
    } else {
      return <AdminWizard stakingPool={currentStakingPool}></AdminWizard>;
    }
  } else {
    switch (step) {
      case WIZARD_STEPS.step1:
        return (
          <Step1
            onNext={() => didSelectStep(WIZARD_STEPS.step2)}
            onBack={() => didSelectStep(WIZARD_STEPS.step1)}
            onComplete={handleStepOne}
          ></Step1>
        );
      case WIZARD_STEPS.step2:
        return (
          <Step2
            onComplete={handleStepTwo}
            collectionId={collectionId}
            onBack={() => didSelectStep(WIZARD_STEPS.step1)}
            onNext={() => didSelectStep(WIZARD_STEPS.step3)}
          />
        );
      case WIZARD_STEPS.step3:
        return (
          <Step3
            onComplete={() => validateStep(3)}
            onBack={() => didSelectStep(WIZARD_STEPS.Step2)}
            onNext={() => didSelectStep(WIZARD_STEPS.step4)}
          />
        );
      case WIZARD_STEPS.step4:
        return (
          <Step4
            onComplete={() => validateStep(4)}
            onBack={() => didSelectStep(WIZARD_STEPS.Step3)}
            onNext={() => didSelectStep(WIZARD_STEPS.step5)}
          />
        );
      case WIZARD_STEPS.step5:
        return (
          <Step5
            onComplete={() => validateStep(5)}
            onBack={() => didSelectStep(WIZARD_STEPS.Step5)}
            onNext={() => didSelectStep(WIZARD_STATUS.review)}
          />
        );
      case WIZARD_STATUS.review:
        return <Review></Review>;
      case WIZARD_STATUS.admin:
        return <AdminWizard></AdminWizard>;
      default:
        return <LoadingState state={step}></LoadingState>;
    }
  }
}

export { ContentSteps };
