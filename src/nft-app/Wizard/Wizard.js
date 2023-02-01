import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { ContentSteps } from "./ContentSteps";
import { ModalWizard } from "./ModalWizard";
import { SideSteps } from "./SideSteps";
import { WIZARD_STATUS, WIZARD_STEPS as STEPS } from "../../constant";
import close from "../../images/closeIcon.svg";
import { useParams } from "react-router-dom";
import { getStakingPoolDetailByCollection as getStakingPoolService } from "../../API/stake";
function Wizard() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStakingPool, setCurrentStakingPool] = useState(null);
  const [currentStep, setCurrentStep] = useState("");
  const [step1Validated, setStep1Validated] = useState(false);
  const [step2Validated, setStep2Validated] = useState(false);
  const [step3Validated, setStep3Validated] = useState(false);
  const [step4Validated, setStep4Validated] = useState(false);
  const [step5Validated, setStep5Validated] = useState(false);
  const { collectionId } = useParams();

  const [walletAddress, setWalletAddress] = useState("");
  const [lockPeriod, setLockPeriod] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [nftsStakeabkes, setNftsStakeabkes] = useState([]);
  const [nftsBackedValues, setNftsBackedValues] = useState([]);
  const [isBackedValue, setIsBackedValue] = useState(false);

  useEffect(() => {
    fetchStakingPool();
  }, []);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const fetchStakingPool = async () => {
    try {
      const { data } = await getStakingPoolService(collectionId);
      const { stakingPool, items } = data;
      if (stakingPool) {
        setCurrentStakingPool({ ...stakingPool, items });
        setCurrentStep(WIZARD_STATUS.admin);
      } else {
        setCurrentStep(STEPS.step1);
      }
    } catch (error) {
      console.dir(error);
    }
  };

  const didCompleteStep = (step, isValid, data) => {
    switch (step) {
      case 1:
        setStep1Validated(isValid);
        setWalletAddress(data);
        break;
      case 2:
        setStep2Validated(isValid);
        setNftsStakeabkes(data);
        break;
      case 3:
        setStep3Validated(isValid);
        break;
      case 4:
        setStep4Validated(isValid);
        break;
      case 5:
        setStep5Validated(isValid);
        break;

      default:
        break;
    }
  };
  return (
    <HStack height="auto" width="100%" padding="90px 12px 90px 12px">
      <HStack
        height="789px"
        background="white"
        overflowx="hidden"
        border="9px"
        width="1200px"
        style={{ boxShadow: " 0px 11px 42px 0px rgba(0, 0, 0, 0.28)" }}
      >
        <SideSteps
          isAdmin={!!currentStakingPool}
          isEditing={isEditing}
          currentStakingPool={currentStakingPool}
          currentStep={currentStep}
          didSelectStep={(step) => {
            setCurrentStep(step);
          }}
          step1Validated={step1Validated}
          step2Validated={step2Validated}
          step3Validated={step3Validated}
          step4Validated={step4Validated}
          step5Validated={step5Validated}
        ></SideSteps>

        <ContentSteps
          step={currentStep}
          currentStakingPool={currentStakingPool}
          collectionId={collectionId}
          validateStep={didCompleteStep}
          didSelectStep={(step) => {
            setCurrentStep(step);
          }}
        ></ContentSteps>

        <IconImg
          style={{ position: "absolute", top: "21px", right: "21px" }}
          url={close}
          width="21px"
          height="21px"
          onClick={handleModal}
          whileHover={{ scale: 0.96 }}
        ></IconImg>

        {showModal && <ModalWizard clickCancel={handleModal}></ModalWizard>}
      </HStack>
    </HStack>
  );
}

export { Wizard };
