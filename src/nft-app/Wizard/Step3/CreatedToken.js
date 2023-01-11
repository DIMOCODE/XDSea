import React from "react";
import { PricePosition } from "../../../styles/PricePosition";
import { HStack, IconImg, Spacer, VStack } from "../../../styles/Stacks";
import {
  BodyMedium,
  TitleBold18,
  TitleBold21,
} from "../../../styles/TextStyles";
import xdc from "../../../images/xdcLogo.png";
import edit from "../../../images/editIcon.svg";
import add from "../../../images/addIcon.svg";
import { ActionButtons } from "../ActionButtons";

function PublishedToken(props) {
  return (
    <HStack
      background={({ theme }) => theme.faded30}
      border="9px"
      height="75px"
      padding=" 0 15px"
      onClick={props.onClick}
      cursor="pointer"
      whileTap={{ scale: 0.99 }}
    >
      <VStack spacing="0px" cursor="pointer">
        <HStack spacing="6px" maxheight="15px" cursor="pointer">
          <TitleBold18 cursor="pointer" textcolor="black">
            {props.amount}
          </TitleBold18>
          <IconImg
            url={props.logo}
            cursor="pointer"
            width="21px"
            height="21px"
          ></IconImg>
        </HStack>
        <BodyMedium cursor="pointer">XDC/D</BodyMedium>
      </VStack>
      <IconImg cursor="pointer" url={edit} width="30px" height="30px"></IconImg>
    </HStack>
  );
}

function AddNewToken(props) {
  return (
    <HStack
      background={({ theme }) => theme.faded30}
      border="9px"
      height="75px"
      padding=" 0 15px"
      onClick={props.onClick}
      cursor="pointer"
      whileTap={{ scale: 0.99 }}
    >
      <Spacer></Spacer>
      <TitleBold18 cursor="pointer" textcolor={({ theme }) => theme.faded90}>
        Add Reward Token
      </TitleBold18>
      <Spacer></Spacer>
      <IconImg cursor="pointer" url={add} width="30px" height="30px"></IconImg>
    </HStack>
  );
}

function CreatedToken(props) {
  return (
    <HStack>
      <VStack height="auto" width="100%" alignment="flex-start">
        <BodyMedium>Staking Pool Rewards Tokens</BodyMedium>
        <PublishedToken
          logo={xdc}
          amount="100"
          onClick={props.onClick}
        ></PublishedToken>
        <AddNewToken onClick={props.onClick}></AddNewToken>
        <ActionButtons grayBtn="Cancel" blueBtn="Continue"></ActionButtons>
      </VStack>
    </HStack>
  );
}

export { CreatedToken };
