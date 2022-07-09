import React from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import { BodyBold, CaptionBoldShort, CaptionRegular } from "./TextStyles";
import xdclogo from "../images/miniXdcLogo.png";
import ButtonApp from "./Buttons";
import { appStyle } from "./AppStyles";
import { useHistory } from "react-router-dom";
import { isXdc, fromXdc } from "../common/common";

function TableOffersNft(props) {
  const {
    wallet,
    owner,
    imageBuyer,
    offerBy,
    offerAmount,
    isWithdrawn,
    onClickAccept,
    onClickWithdraw,
    withdrawStatus,
    acceptStatus,
  } = props;

  const widthRow = "100%";
  const debugColor = "transparent";
  const heightRow = "69px";
  const history = useHistory();

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  const convertPrice = (price) => {
    return price
      ? (price / 1000000000000000000).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : "-";
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  return (
    <>
      <Divider></Divider>
      <HStack width="100%" height={heightRow} spacing="6px">
        <HStack background={debugColor} width={widthRow}>
          <VStack alignment="flex-start" padding="3px 30px" spacing="3px">
            <CaptionRegular>Offer By</CaptionRegular>
            <HStack
              justify="flex-start"
              spacing="6px"
              onClick={() => NavigateTo(`UserProfile/${offerBy}`)}
            >
              <IconImg
                url={imageBuyer}
                width="18px"
                height="18px"
                backsize="cover"
                border="18px"
                cursor="pointer"
              ></IconImg>
              <CaptionBoldShort cursor="pointer">
                {truncateAddress(offerBy)}
              </CaptionBoldShort>
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
              <BodyBold>{convertPrice(offerAmount)}</BodyBold>
            </HStack>
          </VStack>
        </HStack>
        <HStack background={debugColor} width={widthRow} padding="3px 30px">
          <Spacer></Spacer>
          {isWithdrawn ? (
            <ButtonApp
              text="Offer Withdrawn"
              height="48px"
              width="180px"
              textcolor={({ theme }) => theme.text}
              background={({ theme }) => theme.faded}
              btnStatus={-1}
            ></ButtonApp>
          ) : (isXdc(wallet?.address) ? fromXdc(wallet?.address?.toLowerCase()) : wallet?.address?.toLowerCase()) !== owner?.toLowerCase() && (isXdc(wallet?.address) ? fromXdc(wallet?.address?.toLowerCase()) : wallet?.address?.toLowerCase()) === offerBy?.toLowerCase() ? (
            <ButtonApp
              text="Withdraw Offer"
              height="48px"
              width="180px"
              textcolor="white"
              onClick={onClickWithdraw}
              btnStatus={withdrawStatus}
              func="WithdrawOffer"
              cursor="pointer"
            ></ButtonApp>
          ) : (isXdc(wallet?.address) ? fromXdc(wallet?.address?.toLowerCase()) : wallet?.address?.toLowerCase()) === owner?.toLowerCase() ? (
            <ButtonApp
              text="Accept Offer"
              height="48px"
              width="180px"
              textcolor="white"
              onClick={onClickAccept}
              btnStatus={acceptStatus}
              func="AcceptOffer"
              cursor="pointer"
            ></ButtonApp>
          ) : (
            <ButtonApp
              text="Offer Placed"
              height="48px"
              width="180px"
              textcolor={appStyle.colors.blue}
              background={appStyle.colors.softBlue}
              btnStatus={-1}
            ></ButtonApp>
          )}
        </HStack>
      </HStack>
    </>
  );
}
export { TableOffersNft };