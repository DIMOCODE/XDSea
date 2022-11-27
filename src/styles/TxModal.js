import React from "react";
import { HStack, IconImg, Spacer, VStack } from "./Stacks";
import xdcOffer from "../../src/images/xdcOffer.png";
import editListingIcon from "../../src/images/editListing.png";
import list from "../../src/images/listIcon.png";
import partyIcon from "../../src/images/partyIcon.png";
import transferIcon from "../../src/images/transferIconGray.png";
// import errorIcon from "../../src/images/cancelIcon.png";
// import mintIcon from "../../src/images/mintIcon.png";
// import listIcon from "../../src/images/listIcon.png";
import warning from "../../src/images/alert.png";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { appStyle } from "./AppStyles";
import { BodyRegular, TitleBold21, CaptionRegular } from "./TextStyles";
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
    isProcessing,
    processingMessage,
    isMint,
    isPurchaised,
    isNotice,
    noticeActionModal,
    noticeMessage,
    PurchaisedNftName,
    confirmBtnPurchaise,
    isList,
    ListedImage,
    isAction,
    actionMessage,
    cancelActionModal,
    confirmActionModal,
    priceInvalid,
    isEdit,
    editListing,
    cancelEdit,
    onChangeEdit,
    editPrice,
    listPrice,
    onChangeList,
    cancelList,
    listNFT,
    isTransfer,
    transferAddress,
    onChangeTransfer,
    cancelTransfer,
    transferNFT,
    mintName,
    mintedNFT,
    isWithdrawFund,
    withdrawFundPrice,
    onChangeWithdrawFunds,
    cancelWithdrawFund,
    withdrawFunds,
    isDepositFund,
    depositFundPrice,
    onChangeDepositFunds,
    cancelDepositFund,
    depositFunds
  } = props;

  return (
    <FadedBack
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.21,
        delay: 0.1,
      }}
    >
      <VStack>
        <Spacer></Spacer>
        <VStack
          background={({ theme }) => theme.backElement}
          width="390px"
          border="9px"
          spacing="12px"
          padding="36px 30px"
          flex="0"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.21,
            delay: 0.3,
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
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmActionModal}
                  cursor="pointer"
                  btnStatus={0}
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
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
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
                textplace={"rgba(0,0,0,0.6)"}
                onChange={onChangeOffer}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelOffer}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={placeOffer}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isEdit && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg
                  url={editListingIcon}
                  width="59px"
                  height="59px"
                ></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Edit your Listing
                </TitleBold21>
              </VStack>
              <InputStyled
                type="number"
                placeholder="0.00"
                propertyKey={"nft-price"}
                textalign="center"
                padding="0"
                fontsize="30px"
                input={editPrice}
                height="51px"
                textplace={"rgba(0,0,0,0.6)"}
                min={"0.0001"}
                onChange={onChangeEdit}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelEdit}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={editListing}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isList && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={list} width="59px" height="59px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  List your NFT
                </TitleBold21>
              </VStack>
              <InputStyled
                type="number"
                placeholder="0.00"
                propertyKey={"nft-price"}
                textalign="center"
                padding="0"
                fontsize="30px"
                input={listPrice}
                height="51px"
                min={"0.0001"}
                textplace={"rgba(0,0,0,0.6)"}
                onChange={onChangeList}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelList}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={listNFT}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}

          {isWithdrawFund && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={list} width="59px" height="59px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Withdraw funds from pool
                </TitleBold21>
              </VStack>
              <InputStyled
                type="number"
                placeholder="0.00"
                propertyKey={"withdraw-fund"}
                textalign="center"
                padding="0"
                fontsize="30px"
                input={withdrawFundPrice}
                height="51px"
                min={"0.0001"}
                textplace={"rgba(0,0,0,0.6)"}
                onChange={onChangeWithdrawFunds}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelWithdrawFund}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={withdrawFunds}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}

          {isDepositFund && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg url={list} width="59px" height="59px"></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Deposit funds to pool
                </TitleBold21>
              </VStack>
              <InputStyled
                type="number"
                placeholder="0.00"
                propertyKey={"deposit-fund"}
                textalign="center"
                padding="0"
                fontsize="30px"
                input={depositFundPrice}
                height="51px"
                min={"0.0001"}
                textplace={"rgba(0,0,0,0.6)"}
                onChange={onChangeDepositFunds}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelDepositFund}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={depositFunds}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}

          {isTransfer && (
            <>
              <VStack flex="0" spacing="0px">
                <IconImg
                  url={transferIcon}
                  width="59px"
                  height="59px"
                ></IconImg>
                <TitleBold21 textcolor={({ theme }) => theme.text}>
                  Transfer your NFT
                </TitleBold21>
              </VStack>
              <InputStyled
                textalign="center"
                padding="0"
                fontsize="30px"
                input={transferAddress}
                height="51px"
                textplace={"rgba(0,0,0,0.6)"}
                onChange={onChangeTransfer}
                background={appStyle.colors.darkgrey10}
              ></InputStyled>
              {priceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The address does not seem right. Please check the address 
                    and try again.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <ButtonApp
                  text="Cancel"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  width="100%"
                  onClick={cancelTransfer}
                  cursor={"pointer"}
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="Confirm"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={transferNFT}
                  cursor={"pointer"}
                  btnStatus={0}
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
                  You purchased <b>{PurchaisedNftName}</b>
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
                  text="View your NFTs"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmBtnPurchaise}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isMint && (
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
                  You successfully minted <b>{mintName}</b>
                </BodyRegular>
              </HStack>
              <IconImg
                url={mintedNFT}
                backsize="cover"
                border="9px"
                width="100%"
                height="260px"
              ></IconImg>
              <HStack>
                <ButtonApp
                  text="View your NFT"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmActionModal}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )}
          {isProcessing && (
            <>
              <PongSpinner width="59px" height="59px"></PongSpinner>
              <HStack padding="0 30px">
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="center"
                >
                  {processingMessage}
                </BodyRegular>
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
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background: ${appStyle.colors.darkgrey60};
`;
