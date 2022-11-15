import React, { useState } from "react";

import { useLocation } from "react-router-dom";
import linkSocial from "../../images/linkBlack.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import { HStack, Spacer, IconImg, VStack } from "../../styles/Stacks";
import arrow from "../../images/backB.png";
import mountain from "../../images/mountain.jpg";
import close from "../../images/crossIcon.png";
import check from "../../images/checkBlue.png";
import chevronRight from "../../images/chevronRight.png";
import useWindowSize from "../../styles/useWindowSize";
import emptyState from "../../images/emptyState.png";
import {
  BodyMedium,
  CaptionBoldShort,
  CaptionBold,
  TitleBold18,
} from "../../styles/TextStyles";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import { ShareModal } from "../../styles/ShareModal";

const webLink = `https://www.xdsea.com/`;

// ${nftaddress}/${id}

function TopNFT(props) {
  const size = useWindowSize();
  const {
    collectionBanner,
    collectionName,
    collectionLogo,
    onClickCollection,
    nftimage,
  } = props;

  /**
   * Copy the current location URL to the clipboard
   */
  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const webLocation = useLocation();
  const [copied, setCopied] = useState(false);
  const [isShare, setIsShare] = useState(false);
  return (
    <>
      <HStack
        height="150px"
        style={{ "margin-top": "-69px" }}
        backgroundimage={collectionBanner}
        padding="69px 15px 0 15px"
      >
        {/* {nft?.name && (
        <ButtonApp
          height="30px"
          text={nft.collectionId.name}
          background={({ theme }) => theme.walletButton}
          textcolor={({ theme }) => theme.walletText}
          cursor="pointer"
          onClick={() =>
            props.redirect(`collection/${nft.collectionId.nickName}`)
          }
          btnStatus={0}
        ></ButtonApp>
      )} */}

        <HStack
          background={({ theme }) => theme.backElement}
          border="6px"
          height="52px"
          self="none"
          padding="0 12px"
          spacing="9px"
          cursor="pointer"
          onClick={onClickCollection}
          style={{ position: "absolute", left: "15px" }}
        >
          <IconImg
            url={arrow}
            width="18px"
            height="18px"
            cursor="pointer"
            onClick={onClickCollection}
          ></IconImg>
          <IconImg
            url={collectionLogo}
            width="36px"
            height="36px"
            backsize="cover"
            border="3px"
            cursor="pointer"
            onClick={onClickCollection}
          ></IconImg>
          <VStack spacing="3px" alignment="flex-start">
            <CaptionBold cursor="pointer" initial={{ opacity: 0.4 }}>
              COLLECTION
            </CaptionBold>
            <BodyMedium cursor="pointer">{collectionName}</BodyMedium>
          </VStack>
        </HStack>
        <Spacer></Spacer>

        {/* Share */}
        <HStack
          justify="flex-start"
          border="30px"
          padding="0 12px"
          spacing="15px"
          height="52px"
          self="none"
          background={({ theme }) => theme.backElement}
          onClick={() => {
            setIsShare(true);
          }}
          whileTap={{ scale: 0.96 }}
        >
          <CaptionBoldShort cursor="pointer">SHARE</CaptionBoldShort>
        </HStack>
      </HStack>
      {isShare && <ShareModal onClick={() => setIsShare(false)}></ShareModal>}
    </>
  );
}

export { TopNFT };

const Modal = styled(motion.div)`
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 0;

  width: 100%;
  height: 100%;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */

  z-index: 1;
`;
