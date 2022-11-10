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

function TokenInfo(props) {
  const { logo, rewardRate, rewardFrequency } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  const [isEditingRewardRate, setIsEditingRewardRate] = useState(false);
  const [isEditingRewardFrequency, setIsEditingRewardFrequency] = useState(false);
  const [newRewardRate, setNewRewardRate] = useState(0);
  const [newRewardFrequency, setNewRewardFrequency] = useState(false);
  const options = ["hours", "days", "months", "years"];
  const defaultOption = options[0];

  return (
    <VStack width="100%">
      {/* Reward Rate & Earning Rate */}
      <HStack>
        <VStack alignment="flex-start" spacing="6px">
          <TitleBold15> Reward Rate</TitleBold15>
          <HStack
            height="62px"
            border="6px"
          >
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
                >
                </InputStyled>
                <HStack background={({ theme }) => theme.faded}
                  width="50%"
                  border="50px"
                  cursor="pointer"
                  onClick={() => {
                    //Call smart contract
                    setIsEditingRewardRate(false);
                  }}>
                  <IconImg url={doneIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
                <HStack background={({ theme }) => theme.faded}
                  width="50%"
                  border="50px"
                  cursor="pointer"
                  onClick={() => {
                    setIsEditingRewardRate(false);
                  }}>
                  <IconImg url={crossIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
            ) : (
              <>
                <HStack
                  width="75%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="9px 60px 9px 60px"
                  spacing="6px"
                  height="62px"
                >
                  <IconImg url={logo} width="18px" height="18px"></IconImg>
                  <TitleBold18>
                    {rewardRate}
                  </TitleBold18>
                </HStack>
                <HStack
                  width="25%"
                  height="62px"
                  background={({ theme }) => theme.faded}
                  border="52px"
                  cursor="pointer"
                  onClick={() => {
                    setIsEditingRewardRate(true);
                  }}
                >
                  <IconImg url={edit} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
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

        <VStack alignment="flex-start" spacing="6px">
          <TitleBold15>Reward Frequency</TitleBold15>
          <HStack
            height="62px"
            border="6px"
            spacing="6px"
          >
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
                >
                </InputStyled>
                <Dropdown
                  options={options}
                  className="dropdown"
                  controlClassName="control"
                  menuClassName="dropmenu"
                  value={defaultOption}
                  placeholder="Select an option"
                />
                <HStack background={({ theme }) => theme.faded}
                  width="50%"
                  border="20px"
                  cursor="pointer"
                  onClick={() => {
                    //Call smart contract
                    setIsEditingRewardFrequency(false);
                  }}>
                  <IconImg url={doneIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
                <HStack background={({ theme }) => theme.faded}
                  width="50%"
                  border="20px"
                  cursor="pointer"
                  onClick={() => {
                    setIsEditingRewardFrequency(false);
                  }}>
                  <IconImg url={crossIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
            ) : (
              <>
                <HStack
                  width="75%"
                  background={({ theme }) => theme.faded}
                  border="6px"
                  padding="9px 60px 9px 60px"
                  spacing="6px"
                  height="62px"
                >
                  <TitleBold18 style={{"white-space": "nowrap"}}>
                    {rewardFrequency}
                  </TitleBold18>
                </HStack>
                <HStack
                  width="25%"
                  height="62px"
                  background={({ theme }) => theme.faded}
                  border="52px"
                  cursor="pointer"
                  onClick={() => {
                    setIsEditingRewardFrequency(true);
                  }}
                >
                  <IconImg url={edit} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
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
          background="#CCD8F8"
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
