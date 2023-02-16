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
    walletAddress,
    lockPeriod,
    rewards,
    nftsStakeables,
    nftsBackedValues,
    isBackedValue,
    onCreateStakingPool,
    onVisitCollection,
    onAdminStakingPool,
    onEdit,
    isAllowed,
  } = props;

  const handleStepOne = (isValid, address) => {
    validateStep(1, isValid, address);
  };

  const handleStepTwo = (isValid, nftsSelected) => {
    console.info(isValid, nftsSelected);
    validateStep(2, isValid, nftsSelected);
  };
  const handleStepThree = (isValid, rewardRates) => {
    console.info(isValid, rewardRates);
    validateStep(3, isValid, rewardRates);
  };
  const handleStepFour = (isValid, backedValues) => {
    console.info(isValid, backedValues);
    validateStep(4, isValid, backedValues);
  };
  const handleStepFive = (isValid, lockPeriod) => {
    validateStep(5, isValid, lockPeriod);
  };

  if (!isAllowed) {
    return <LoadingState status={WIZARD_STATUS.notAllowed} />;
  } else if (!currentStakingPool || isEditing) {
    switch (step) {
      case WIZARD_STEPS.step1:
        return (
          <Step1
            walletAddress={walletAddress}
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
            nftsAlreadySelected={nftsStakeables}
            onBack={() => didSelectStep(WIZARD_STEPS.step1)}
            onNext={() => didSelectStep(WIZARD_STEPS.step3)}
          />
        );
      case WIZARD_STEPS.step3:
        return (
          <Step3
            initialRewardRates={rewards}
            onComplete={handleStepThree}
            onBack={() => didSelectStep(WIZARD_STEPS.step2)}
            onNext={() => didSelectStep(WIZARD_STEPS.step4)}
          />
        );
      case WIZARD_STEPS.step4:
        return (
          <Step4
            isBackedValue={isBackedValue}
            onComplete={handleStepFour}
            onBack={() => didSelectStep(WIZARD_STEPS.step3)}
            onNext={() => didSelectStep(WIZARD_STEPS.step5)}
            nftsStakeables={nftsStakeables}
          />
        );
      case WIZARD_STEPS.step5:
        return (
          <Step5
            initialLockPeriod={lockPeriod}
            onComplete={handleStepFive}
            onBack={() => didSelectStep(WIZARD_STEPS.step5)}
            onNext={() => didSelectStep(WIZARD_STATUS.review)}
          />
        );
      case WIZARD_STATUS.review:
        return (
          <Review
            isEditing={isEditing}
            address={walletAddress}
            lockPeriod={lockPeriod}
            rewards={rewards}
            nftsStakeables={nftsStakeables}
            nftsBackedValues={nftsBackedValues}
            isBackedValue={isBackedValue}
            onCreateStakingPool={onCreateStakingPool}
          />
        );
      // case WIZARD_STATUS.admin:
      //   return <AdminWizard></AdminWizard>;
      default:
        return (
          <LoadingState
            isEditing={isEditing}
            status={step}
            onVisitCollection={onVisitCollection}
            onAdminStakingPool={onAdminStakingPool}
          />
        );
    }
  } else {
    return <AdminWizard stakingPool={currentStakingPool} onEdit={onEdit} />;
  }
}

export { ContentSteps };
