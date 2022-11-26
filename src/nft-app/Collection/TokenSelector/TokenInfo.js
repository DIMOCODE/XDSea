import React from "react";
import { useState } from "react";

import {
  CaptionTiny,
  TitleBold15,
  TitleBold18,
} from "../../../styles/TextStyles";

import {
  HStack,
  Separator,
  IconImg,
  Spacer,
  VStack,
} from "../../../styles/Stacks";
import edit from "../../../images/editPencil.png";
import { EarningRate } from "../../Staking/EarningRate";
import { InputStyled } from "../../../styles/InputStyled";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import crossIcon from "../../../images/crossIcon.png";
import doneIcon from "../../../images/doneIcon.png";
import Dropdown from "react-dropdown";
import { ButtonIcon } from "../../../styles/Buttons/ButtonIcon";
import { UpdateRewards } from "../../../common";
import { stakingaddress } from "../../../config";
import { fromXdc, toXdc, isXdc } from "../../../common/common";
import { updateStakingPool } from "../../../API/stake";

function TokenInfo(props) {
  const { logo, rewardRate, rewardFrequency, unparsedRewardFrequency, rewardStartTime, isCreator, wallet, tokenContract, stakingPool, setStakingPool, setWithdrawModal } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  const [isEditingRewardRate, setIsEditingRewardRate] = useState(false);
  const [isEditingRewardFrequency, setIsEditingRewardFrequency] =
    useState(false);
  const [newRewardRate, setNewRewardRate] = useState(0);
  const [newRewardFrequency, setNewRewardFrequency] = useState(0);
  const [rewardFrequencyPeriod, setRewardFrequencyPeriod] = useState("hrs");
  const options = ["hrs", "d", "mo", "yr"];
  const defaultOption = options[0];

  const updateRewardRate = async() => {
    try{
      console.log(stakingaddress, wallet?.address, newRewardRate, unparsedRewardFrequency, rewardStartTime)
      const success = await UpdateRewards(stakingaddress, isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address, "0x0000000000000000000000000000000000000000", newRewardRate * 10000, unparsedRewardFrequency * 3600, 0, 1658102400);
      if(success) {
        const updatedPool = await(await updateStakingPool({stakingPoolId: stakingPool?._id, rewardRates: [{
          amount: newRewardRate,
          rewardFrecuency: unparsedRewardFrequency,
          rewardTypeId: "638107a4ed9a6f026c81d6a9",
          type: "coin"
        }]})).data.stakingPool;
        setStakingPool(updatedPool);
      }
    }
    catch (err) {
      console.log(err);
    }
    setIsEditingRewardRate(false);
  }

  const updateRewardFrequency = async() => {
    var updatedRewardFrequency = 0;
    if (rewardFrequencyPeriod === "hrs") {
      updatedRewardFrequency = newRewardFrequency;
    } else if (rewardFrequencyPeriod === "d") {
      updatedRewardFrequency = newRewardFrequency * 24;
    } else if (rewardFrequencyPeriod === "mo") {
      updatedRewardFrequency = newRewardFrequency * 730;
    } else if (rewardFrequencyPeriod === "yr") {
      updatedRewardFrequency = newRewardFrequency * 8760;
    }
    if(document.getElementsByClassName("edit-reward-frequency").value === "0") {
      updatedRewardFrequency = 0;
    }
    try{
      const success = await UpdateRewards(stakingaddress, isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address, "0x0000000000000000000000000000000000000000", rewardRate * 10000, newRewardFrequency === 0 ? rewardFrequency * 3600 : updatedRewardFrequency * 3600, 0, 1658102400);
      if(success) {
        const updatedPool = await(await updateStakingPool({stakingPoolId: stakingPool?._id, rewardRates: [{
          amount: rewardRate,
          rewardFrecuency: updatedRewardFrequency,
          rewardTypeId: "638107a4ed9a6f026c81d6a9",
          type: "coin"
        }]})).data.stakingPool;
        setStakingPool(updatedPool);
      }
    }
    catch (err) {
      console.log(err);
    }
    setIsEditingRewardFrequency(false);
  }

  return (
    <VStack width="100%">
      {/* Reward Rate & Earning Rate */}
      <HStack responsive={true} style={{ zIndex: 1 }}>
        <VStack alignment="flex-start" spacing="6px" width="100%">
          <TitleBold15> Reward Rate</TitleBold15>
          <HStack height="62px" border="6px">
            {isEditingRewardRate ? (
              <>
                <InputStyled
                  propertyKey={"edit-reward-rate"}
                  type="number"
                  input={newRewardRate}
                  onChange={(event) => {
                    setNewRewardRate(event.target.value);
                  }}
                  textplace={"rgba(0,0,0,0.6)"}
                  padding={"0 12px 0 12px"}
                  height="62px"
                  background={({ theme }) => theme.faded}
                ></InputStyled>

                <HStack spacing="3px">
                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={doneIcon}
                    onClick={() => {
                      updateRewardRate();
                    }}
                  ></ButtonIcon>

                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={crossIcon}
                    onClick={() => {
                      setIsEditingRewardRate(false);
                    }}
                  ></ButtonIcon>
                </HStack>
              </>
            ) : isCreator ? (
              <HStack width="100%">
                <HStack
                  width="80%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="9px 60px 9px 60px"
                  spacing="6px"
                  height="62px"
                >
                  <IconImg url={logo} width="18px" height="18px"></IconImg>
                  <TitleBold18>{rewardRate}</TitleBold18>
                </HStack>

                <HStack width="20%">
                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={edit}
                    onClick={() => {
                      setIsEditingRewardRate(true);
                    }}
                  ></ButtonIcon>
                </HStack>
              </HStack>
            ) : (
              <HStack width="100%">
                <HStack
                  width="100%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="9px 60px 9px 60px"
                  spacing="6px"
                  height="62px"
                >
                  <IconImg url={logo} width="18px" height="18px"></IconImg>
                  <TitleBold18>{rewardRate}</TitleBold18>
                </HStack>
              </HStack>
            )}
          </HStack>
        </VStack>

        <VStack alignment="flex-start" spacing="6px" width="100%">
          <TitleBold15>Reward Frequency</TitleBold15>
          <HStack height="62px" border="6px" spacing="6px">
            {isEditingRewardFrequency ? (
              <>
                <InputStyled
                  propertyKey={"edit-reward-frequency"}
                  type="number"
                  input={newRewardFrequency}
                  onChange={(event) => {
                    setNewRewardFrequency(event.target.value);
                  }}
                  textplace={"rgba(0,0,0,0.6)"}
                  padding={"0 12px 0 12px"}
                  height="62px"
                  background={({ theme }) => theme.faded}
                  width="100%"
                ></InputStyled>
                <Dropdown
                  options={options}
                  className="dropdown"
                  controlClassName="control"
                  arrowClassName="customArrows"
                  menuClassName="dropmenu"
                  value={defaultOption}
                  placeholder="Select an option"
                  onChange={(e) => {
                    setRewardFrequencyPeriod(e.value);
                  }}
                />

                <HStack spacing="3px">
                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={doneIcon}
                    onClick={() => {
                      updateRewardFrequency();
                    }}
                  ></ButtonIcon>

                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={crossIcon}
                    onClick={() => {
                      setIsEditingRewardFrequency(false);
                    }}
                  ></ButtonIcon>
                </HStack>
              </>
            ) : isCreator ? (
              <HStack width="100%">
                <HStack
                  width="80%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="0"
                  spacing="6px"
                  height="62px"
                >
                  <TitleBold18 style={{ "white-space": "nowrap" }}>
                    {rewardFrequency}
                  </TitleBold18>
                </HStack>
                <HStack width="20%">
                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={edit}
                    onClick={() => {
                      setIsEditingRewardFrequency(true);
                    }}
                  ></ButtonIcon>
                </HStack>
              </HStack>
            ) : (
              <HStack width="100%">
                <HStack
                  width="100%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="0"
                  spacing="6px"
                  height="62px"
                >
                  <TitleBold18 style={{ "white-space": "nowrap" }}>
                    {rewardFrequency}
                  </TitleBold18>
                </HStack>
              </HStack>
            )}
          </HStack>
        </VStack>
      </HStack>

      {/* Action Buttons */}
      {isCreator && (
        <HStack>
          <ButtonM
            background={({ theme }) => theme.fadedBlue}
            textcolor={({ theme }) => theme.blue}
            title="Withdraw"
            height="52px"
            onClick={() => setWithdrawModal(true)}
          ></ButtonM>
          <ButtonM
            background={({ theme }) => theme.blue}
            textcolor={({ theme }) => theme.backElement}
            title="Deposit"
            height="52px"
          ></ButtonM>
        </HStack>
      )}
    </VStack>
  );
}

export { TokenInfo };
