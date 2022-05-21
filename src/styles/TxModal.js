import React from "react";
import { HStack, IconImg, Spacer, VStack } from "./Stacks";
import xdcOffer from "../../src/images/xdcOffer.png";
import editListingIcon from "../../src/images/editListing.png";
import list from "../../src/images/listIcon.png";
import partyIcon from "../../src/images/partyIcon.png";
import transferIcon from "../../src/images/transferIconGray.png";
import errorIcon from "../../src/images/cancelIcon.png";
import mintIcon from "../../src/images/mintIcon.png";
import listIcon from "../../src/images/listIcon.png";
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
    transferNFT
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
                    The input in the price field is not a number. Please 
                    use numeric characters with a maximum of one decimal point only.
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
                <IconImg url={editListingIcon} width="59px" height="59px"></IconImg>
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
                    The input in the price field is not a number. Please 
                    use numeric characters with a maximum of one decimal point only.
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
                  The input in the price field is not a number. Please 
                  use numeric characters with a maximum of one decimal point only.
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
          {/* {isList && (
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
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="View NFT"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmBtnList}
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </>
          )} */}
          {isTransfer && (
            <>
            <VStack flex="0" spacing="0px">
              <IconImg url={transferIcon} width="59px" height="59px"></IconImg>
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
                  The address does not seem right. Please use the wallet address with
                  a "0x..." prefix and not the "xdc..." prefix.
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
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  text="View my NFT"
                  width="100%"
                  textcolor={appStyle.colors.white}
                  onClick={confirmBtnPurchaise}
                  btnStatus={0}
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
