import React from "react";
import { HStack, IconImg, Spacer, VStack } from "./Stacks";
import xdcOffer from "../../src/images/xdcOffer.png";
import partyIcon from "../../src/images/partyIcon.png";
import errorIcon from "../../src/images/cancelIcon.png";
import mintIcon from "../../src/images/mintIcon.png";
import listIcon from "../../src/images/listIcon.png";
import warning from "../../src/images/alert.png";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { appStyle } from "./AppStyles";
import { BodyRegular, TitleBold21 } from "./TextStyles";
import ButtonApp from "./Buttons";
import { PongSpinner } from "react-spinners-kit";
import { InputStyled } from "./InputStyled";

function TxModal(props) {
  const {
    isOffer,
    cancelOffer,
    placeOffer,
    offerPrice,
    onChangeOffer,
    isFail,
    cancelFail,
    isProcessing,
    isMint,
    isPurchaised,
    isNotice,
    noticeActionModal,
    noticeMessage,
    PurchaisedNftName,
    cancelBtnPurchaise,
    confirmBtnPurchaise,
    isList,
    ListedImage,
    ListedNftName,
    cancelBtnList,
    confirmBtnList,
    isAction,
    actionMessage,
    cancelActionModal,
    confirmActionModal,
  } = props;

  return (
    <FadedBack>
      <VStack>
        <Spacer></Spacer>
        <VStack
          background={({ theme }) => theme.backElement}
          width="390px"
          border="9px"
          spacing="12px"
          padding="36px 30px"
          flex="0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.6,
          }}
        >
          {isAction && (
            <>
              <IconImg url={warning} width="59px" height="59px"></IconImg>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  {actionMessage}
                </BodyRegular>
              </HStack>
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelActionModal}
                  cursor="pointer"
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmActionModal}
                  cursor="pointer"
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isNotice && (
            <>
              <IconImg url={warning} width="59px" height="59px"></IconImg>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  {noticeMessage}
                </BodyRegular>
              </HStack>
              <HStack>
                <ButtonApp
                  text="Okay"
                  textcolor={({ theme }) => theme.text}
                  width="100%"
                  onClick={noticeActionModal}
                  cursor="pointer"
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isFail && (
            <>
              <VStack flex="0" spacing="6px">
                <IconImg url={errorIcon} width="54px" height="54px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Transaction Failed
                </TitleBold21>
              </VStack>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  Something went wrong , please check your wallet connection and
                  try again.
                </BodyRegular>
              </HStack>
              <ButtonApp
                text="Close"
                textcolor={({ theme }) => theme.text}
                background={appStyle.colors.darkgrey10}
                width="100%"
                onClick={cancelFail}
              ></ButtonApp>
            </>
          )}
          {isOffer && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={xdcOffer} width="59px" height="59px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Place an Offer
                </TitleBold21>
              </VStack>
              <InputStyled
                type="number"
                placeholder="0.00"
                propertyKey={"nft-price"}
                textalign="center"
                padding="0"
                fontsize="30px"
                input={offerPrice}
                height="51px"
                min={"0.0001"}
                onChange={onChangeOffer}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelOffer}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={placeOffer}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isMint && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={mintIcon} width="54px" height="54px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Mint is in Processing
                </TitleBold21>
              </VStack>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  We are minting your NFT! Thank you for your patience
                </BodyRegular>
              </HStack>
            </>
          )}
          {isProcessing && (
            <>
              <VStack flex="0" spacing="6px">
                <PongSpinner size={60} color="#99A2AF" loading={true} />
                {/* <IconImg url={successIcon} width="54px" height="54px"></IconImg> */}
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Processing your Purchaise
                </TitleBold21>
              </VStack>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  We are processing your request, thank you for your patiente.
                </BodyRegular>
              </HStack>
            </>
          )}
          {isList && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={listIcon} width="54px" height="54px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  List Confirmed{" "}
                </TitleBold21>
              </VStack>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  You listed <b>{ListedNftName}</b>, everyone can buy it now
                </BodyRegular>
              </HStack>
              <IconImg
                url={ListedImage}
                backsize="cover"
                border="9px"
                width="100%"
                height="260px"
              ></IconImg>
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelBtnList}
                ></ButtonApp>
                <ButtonApp
                  text="View NFT"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmBtnList}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isPurchaised && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={partyIcon} width="54px" height="54px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Congrats
                </TitleBold21>
              </VStack>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  You purchaised <b>{PurchaisedNftName}</b>
                </BodyRegular>
              </HStack>
              <IconImg
                url={ListedImage}
                backsize="cover"
                border="9px"
                width="100%"
                height="260px"
              ></IconImg>
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelBtnPurchaise}
                ></ButtonApp>
                <ButtonApp
                  text="View my NFT"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmBtnPurchaise}
                ></ButtonApp>
              </HStack>
            </>
          )}
        </VStack>
        <Spacer></Spacer>
      </VStack>
    </FadedBack>
  );
}

export { TxModal };

const FadedBack = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 100;
`;
