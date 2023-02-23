import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { ContentSteps } from "./ContentSteps";
import { ModalWizard } from "./ModalWizard";
import { SideSteps } from "./SideSteps";
import {
  LS,
  LS_ROOT_KEY,
  WIZARD_STATUS,
  WIZARD_STEPS as STEPS,
} from "../../constant";
import close from "../../images/closeIcon.svg";
import { useHistory, useParams } from "react-router-dom";
import {
  createStakingPool,
  getStakingPoolDetailByCollection as getStakingPoolService,
  updateRewardTypeById,
  updateStakingPool,
} from "../../API/stake";
import { loadImgWithPresignedUrl } from "../../API/S3Bucket";
import { getCollectionById } from "../../API/Collection";
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
  const [collection, setCollection] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nftsStakeables, setNftsStakeables] = useState([]);
  const [nftsBackedValues, setNftsBackedValues] = useState([]);
  const [isBackedValue, setIsBackedValue] = useState(false);
  const history = useHistory();
  function NavigateTo(route) {
    history.push(`/${route}`);
  }
  useEffect(() => {
    fetchCollection().then(() => {
      fetchStakingPool();
    });
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
  const fetchCollection = async () => {
    try {
      const { data } = await getCollectionById(collectionId);
      const { user } = LS.get(LS_ROOT_KEY);

      setCollection(data.collection);
      setIsAllowed(!!user && user._id === data.collection.creator._id);
      setIsLoaded(true);
      return data.collection;
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
        setNftsStakeables(data);
        break;
      case 3:
        setStep3Validated(isValid);
        setRewards(data);
        break;
      case 4:
        setStep4Validated(isValid);
        setNftsBackedValues(data);
        setIsBackedValue(data?.length > 0);
        break;
      case 5:
        setStep5Validated(isValid);
        setLockPeriod(data);
        break;

      default:
        break;
    }
  };

  const saveStakingPool = async () => {
    try {
      setCurrentStep(WIZARD_STATUS.creating);
      if (isEditing) {
        //code for update staking pool
        const { data } = await updateStakingPool({
          stakingPoolId: currentStakingPool._id,
          walletAddress,
          lockPeriod,
          rewardRates: rewards.map((rw) =>
            !rw.imgFile
              ? {
                  amount: rw.amount,
                  rewardFrecuency: rw.rewardFrecuency,
                  rewardTypeId: rw._id,
                }
              : {
                  amount: rw.amount,
                  rewardFrecuency: rw.rewardFrecuency,
                  addressContract: rw.addressContract,
                  type: rw.type,
                  name: rw.name,
                  color: rw.color,
                }
          ),
          nftsStakeables: nftsStakeables.map((nft) => nft._id),
          nftsBackedValues: nftsBackedValues.map((nft) => ({
            nftId: nft._id,
            value: nft.backedValue,
          })),
          isBackedValue,
        });

        console.log(data);
        const { rewardsSignedUrls } = data;
        for (const { signedUrl, url, rewardTypeId } of rewardsSignedUrls) {
          const { imgFile } = rewards.find(
            (r) => r.addressContract === rewardTypeId.addressContract
          );
          await loadImgWithPresignedUrl(imgFile, signedUrl);
          await updateRewardTypeById({
            rewardTypeId: rewardTypeId._id,
            iconUrl: url,
          });
        }
      } else {
        const { data } = await createStakingPool(
          collectionId,
          walletAddress,
          lockPeriod,
          rewards.map((rw) =>
            !rw.imgFile
              ? {
                  amount: rw.amount,
                  rewardFrecuency: rw.rewardFrecuency,
                  rewardTypeId: rw._id,
                }
              : {
                  amount: rw.amount,
                  rewardFrecuency: rw.rewardFrecuency,
                  addressContract: rw.addressContract,
                  type: rw.type,
                  name: rw.name,
                  color: rw.color,
                }
          ),
          nftsStakeables.map((nft) => nft._id),
          nftsBackedValues.map((nft) => ({
            nftId: nft._id,
            value: nft.backedValue,
          })),
          isBackedValue
        );

        const { rewardsSignedUrls } = data;
        for (const { signedUrl, url, rewardTypeId } of rewardsSignedUrls) {
          const { imgFile } = rewards.find(
            (r) => r.addressContract === rewardTypeId.addressContract
          );
          await loadImgWithPresignedUrl(imgFile, signedUrl);
          await updateRewardTypeById({
            rewardTypeId: rewardTypeId._id,
            iconUrl: url,
          });
        }
      }

      setCurrentStep(WIZARD_STATUS.published);
    } catch (error) {
      setCurrentStep(WIZARD_STATUS.error);
      console.dir(error);
    }
  };

  const handleEditMode = () => {
    setWalletAddress(currentStakingPool.walletAddress);
    setLockPeriod(currentStakingPool.lockPeriod);
    setRewards(
      currentStakingPool.rewardRates.map((rr) => ({
        addressContract: rr.rewardTypeId.addressContract,
        amount: rr.amount,
        color: rr.rewardTypeId.color,
        iconUrl: rr.rewardTypeId.iconUrl,
        name: rr.rewardTypeId.name,
        rewardFrecuency: rr.rewardFrecuency,
        type: rr.rewardTypeId.type,
        _id: rr.rewardTypeId._id,
      }))
    );
    setNftsStakeables(currentStakingPool.items);
    setNftsBackedValues(currentStakingPool.items);
    setIsBackedValue(currentStakingPool.isBackedValue);
    setIsEditing(true);
    setCurrentStep(STEPS.step1);
  };

  const onVisitCollection = () => {
    NavigateTo(`collection/${collection.nickName}`);
  };

  const onAdminStakingPool = () => {
    setIsEditing(false);
    setCurrentStep(WIZARD_STATUS.admin);
    fetchStakingPool();
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
        {isLoaded && isAllowed && (
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
        )}

        {isLoaded && (
          <ContentSteps
            isAllowed={isAllowed}
            isEditing={isEditing}
            step={currentStep}
            currentStakingPool={currentStakingPool}
            collectionId={collectionId}
            validateStep={didCompleteStep}
            didSelectStep={(step) => {
              setCurrentStep(step);
            }}
            walletAddress={walletAddress}
            lockPeriod={lockPeriod}
            rewards={rewards}
            nftsStakeables={nftsStakeables}
            nftsBackedValues={nftsBackedValues}
            isBackedValue={isBackedValue}
            onCreateStakingPool={saveStakingPool}
            onVisitCollection={onVisitCollection}
            onAdminStakingPool={onAdminStakingPool}
            onEdit={handleEditMode}
          />
        )}

        <IconImg
          style={{ position: "absolute", top: "21px", right: "21px" }}
          url={close}
          width="21px"
          height="21px"
          onClick={handleModal}
          whileHover={{ scale: 0.96 }}
        ></IconImg>

        {showModal && (
          <ModalWizard
            clickCancel={handleModal}
            clickOk={() => NavigateTo(`collection/${collection.nickName}`)}
          ></ModalWizard>
        )}
      </HStack>
    </HStack>
  );
}

export { Wizard };
