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

function TokenInfo(props) {
  const { logo, rewardRate, rewardFrequency } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  const [isEditingRewardRate, setIsEditingRewardRate] = useState(false);
  const [isEditingRewardFrequency, setIsEditingRewardFrequency] =
    useState(false);
  const [newRewardRate, setNewRewardRate] = useState(0);
  const [newRewardFrequency, setNewRewardFrequency] = useState(false);
  const options = ["hrs", "d", "mo", "yr"];
  const defaultOption = options[0];

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
                      //Call smart contract
                      setIsEditingRewardRate(false);
                    }}
                  ></ButtonIcon>

                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={crossIcon}
                    onClick={() => {
                      //Call smart contract
                      setIsEditingRewardRate(false);
                    }}
                  ></ButtonIcon>
                </HStack>
              </>
            ) : (
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
                      //Call smart contract
                      setIsEditingRewardRate(true);
                    }}
                  ></ButtonIcon>
                </HStack>
              </HStack>
            )}

            {/* <InputStyled
              fontsize="18px"
              type="number"
              background="transparent"
              width="120px"
              height="60px"
              iconWidth="1px"
              padding="0 12px"
              weight="bold"
              placeholder={rewardRate}
              textalign="center"
              textplace="rgba(0, 0, 0, 0.3)"
            ></InputStyled> */}
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
                />

                <HStack spacing="3px">
                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={doneIcon}
                    onClick={() => {
                      //Call smart contract
                      setIsEditingRewardFrequency(false);
                    }}
                  ></ButtonIcon>

                  <ButtonIcon
                    background={({ theme }) => theme.faded}
                    icon={crossIcon}
                    onClick={() => {
                      //Call smart contract
                      setIsEditingRewardFrequency(false);
                    }}
                  ></ButtonIcon>
                </HStack>
              </>
            ) : (
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
                      //Call smart contract
                      setIsEditingRewardFrequency(true);
                    }}
                  ></ButtonIcon>
                </HStack>
              </HStack>
            )}

            {/* <InputStyled
              fontsize="18px"
              type="number"
              background="transparent"
              width="120px"
              height="60px"
              iconWidth="1px"
              padding="0 12px"
              weight="bold"
              placeholder={rewardRate}
              textalign="center"
              textplace="rgba(0, 0, 0, 0.3)"
            ></InputStyled> */}
          </HStack>
          {/* <EarningRate titleOff={true} onlyOneToken={true}></EarningRate> */}
        </VStack>
      </HStack>

      {/* Action Buttons */}
      <HStack>
        <ButtonM
          background={({ theme }) => theme.fadedBlue}
          textcolor={({ theme }) => theme.blue}
          title="Withdraw"
          height="52px"
        ></ButtonM>
        <ButtonM
          background={({ theme }) => theme.blue}
          textcolor={({ theme }) => theme.backElement}
          title="Deposit"
          height="52px"
        ></ButtonM>
        {/* <HStack
          background={({ theme }) => theme.blue}
          height="52px"
          width="100%"
          border="6px"
          cursor="pointer"
          padding="3px 0 0 0 "
        >
          <VStack spacing="1px" cursor="pointer" width="100%">
            <HStack padding="0 12px 0 0">
              <CaptionTiny textcolor="white" cursor="pointer">
                DEPOSIT
              </CaptionTiny>
            </HStack>

            <InputStyled
              fontsize="18px"
              type="number"
              background="transparent"
              width="100%"
              height="21px"
              iconWidth="1px"
              padding="0 12px"
              weight="bold"
              textcolor="white"
              placeholder="00000"
              textalign="center"
              textplace="rgba(255, 255, 255, 0.3)"
            ></InputStyled>
          </VStack>
        </HStack> */}
      </HStack>
    </VStack>
  );
}

export { TokenInfo };
