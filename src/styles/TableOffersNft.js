import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  CaptionRegular,
} from "./TextStyles";
import transferIcon from "../images/transferIcon.png";
import star from "../images/starColor.png";
import xdclogo from "../images/miniXdcLogo.png";
import Tooltip from "@mui/material/Tooltip";
import ButtonApp from "./Buttons";
import { appStyle } from "./AppStyles";

function TableOffersNft(props) {
  const {
    imageBuyer,
    offerBy,
    offerTime,
    offerAmount,
    isRejected,
    onClickRejected,
    onClickWithdraw,
  } = props;

  const widthRow = "100%";
  const debugColor = "transparent";
  const heightRow = "69px";

  return (
    <HStack width="100%" height={heightRow} spacing="6px">
      <HStack background={debugColor} width={widthRow}>
        <VStack alignment="flex-start" padding="3px 30px" spacing="3px">
          <CaptionRegular>Offer By</CaptionRegular>
          <HStack justify="flex-start" spacing="6px">
            <IconImg
              url={imageBuyer}
              width="18px"
              height="18px"
              backsize="cover"
              border="18px"
            ></IconImg>
            <CaptionBoldShort>{offerBy}</CaptionBoldShort>
          </HStack>
        </VStack>
      </HStack>

      <HStack background={debugColor} width={widthRow}>
        <VStack spacing="3px">
          <HStack spacing="6px">
            <IconImg
              url={xdclogo}
              backsize="cover"
              width="18px"
              height="18px"
            ></IconImg>
            <BodyBold>{offerAmount}</BodyBold>
          </HStack>
          <CaptionRegular>{offerTime}</CaptionRegular>
        </VStack>
      </HStack>

      <HStack background={debugColor} width={widthRow} padding="3px 30px">
        <Spacer></Spacer>
        {isRejected ? (
          <ButtonApp
            text="Offer Rejected"
            height="48px"
            width="180px"
            textcolor={appStyle.colors.blue}
            background={appStyle.colors.softBlue}
            onClick={onClickRejected}
          ></ButtonApp>
        ) : (
          <ButtonApp
            text="Withdraw Offer"
            height="48px"
            width="180px"
            textcolor="white"
            onClick={onClickWithdraw}
          ></ButtonApp>
        )}
      </HStack>
    </HStack>
  );
}
export { TableOffersNft };
