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

function TokenInfo(props) {
  const { logo, rewardRate, hideButtons } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);

  return (
    <VStack width="100%">
      {/* Reward Rate & Earning Rate */}
      <HStack>
        <VStack alignment="flex-start" spacing="6px">
          <TitleBold15> Reward Rate</TitleBold15>
          <HStack
            height="62px"
            background={({ theme }) => theme.faded}
            border="6px"
            onClick={() => setIsEditing(!isEditing)}
            cursor="pointer"
          >
            <HStack spacing="6px">
              <IconImg url={logo} width="18px" height="18px"></IconImg>

              <InputStyled
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
              ></InputStyled>
            </HStack>

            <IconImg url={edit} width="15px" height="15px"></IconImg>
          </HStack>
        </VStack>

        <VStack alignment="flex-start" spacing="6px">
          <TitleBold15> Earning Rate</TitleBold15>

          <EarningRate titleOff={true} onlyOneToken={true}></EarningRate>
        </VStack>
      </HStack>

      {/* Action Buttons */}

      {hideButtons ? null : (
        <HStack>
          <ButtonM
            background="#CCD8F8"
            textcolor={({ theme }) => theme.blue}
            title="Withdraw"
            height="52px"
          ></ButtonM>
          <HStack
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
          </HStack>
        </HStack>
      )}
    </VStack>
  );
}

export { TokenInfo };
