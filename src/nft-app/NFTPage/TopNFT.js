import React, { useState } from "react";

import { useLocation } from "react-router-dom";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import { HStack, Spacer, IconImg, VStack } from "../../styles/Stacks";
import arrow from "../../images/backB.png";
import mountain from "../../images/mountain.jpg";
import close from "../../images/crossIcon.png";
import {
  BodyMedium,
  CaptionBoldShort,
  CaptionBold,
} from "../../styles/TextStyles";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
/**
 * Copy the location address
 */
const copy = async () => {
  await navigator.clipboard.writeText(webLink);
  // setCopied(true);
  setTimeout(() => {
    // setCopied(false);
  }, 1500);
};
// const webLocation = useLocation();

const webLink = `https://www.xdsea.com/`;

// ${nftaddress}/${id}

function TopNFT() {
  const [copied, setCopied] = useState(false);
  const [isShare, setIsShare] = useState(false);
  return (
    <HStack height="90px" backgroundimage={mountain} padding="0 15px">
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

      {!isShare && (
        <>
          <HStack
            background={({ theme }) => theme.backElement}
            border="6px"
            height="52px"
            self="none"
            padding="0 12px"
            spacing="9px"
            cursor="pointer"
          >
            <IconImg
              url={arrow}
              width="18px"
              height="18px"
              cursor="pointer"
            ></IconImg>
            <IconImg
              url={mountain}
              width="36px"
              height="36px"
              backsize="cover"
              border="3px"
              cursor="pointer"
            ></IconImg>
            <VStack spacing="3px" alignment="flex-start" cursor="pointer">
              <CaptionBold initial={{ opacity: 0.4 }} cursor="pointer">
                COLLECTION
              </CaptionBold>
              <BodyMedium cursor="pointer">Collection Name</BodyMedium>
            </VStack>
          </HStack>
          <Spacer></Spacer>
        </>
      )}

      {/* Share */}
      <HStack
        justify="flex-start"
        border="30px"
        padding="0 12px"
        height="52px"
        spacing="15px"
        self="none"
        cursor="pointer"
        background={({ theme }) => theme.backElement}
      >
        {!isShare && (
          <CaptionBold
            onClick={() => setIsShare(true)}
            initial={{ opacity: 0.6 }}
          >
            SHARE
          </CaptionBold>
        )}

        {isShare && (
          <HStack>
            <FacebookShareButton
              //   url={
              //     "https://www.xdsea.com" +
              //     webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")
              //   }
              quote={"Check out this NFT!"}
              hashtag={["#XDSea"]}
              description={"XDSea NFT Marketplace"}
              className="Demo__some-network__share-button"
            >
              <a>
                <IconImg
                  url={facebookSocial}
                  width="30px"
                  height="30px"
                ></IconImg>
              </a>
            </FacebookShareButton>
            <TwitterShareButton
              title={"Check out this NFT!"}
              //   url={
              //     "https://www.xdsea.com" +
              //     webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")
              //   }
              hashtags={["XDSea", "BuildItOnXDC"]}
            >
              <a>
                <IconImg
                  url={twitterSocial}
                  width="30px"
                  height="30px"
                ></IconImg>
              </a>
            </TwitterShareButton>
            <TelegramShareButton
              title={"Check out this NFT!"}
              //   url={
              //     "https://www.xdsea.com" +
              //     webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")
              //   }
            >
              <a>
                <IconImg
                  url={telegramSocial}
                  width="30px"
                  height="30px"
                ></IconImg>
              </a>
            </TelegramShareButton>
            <WhatsappShareButton
              title={"Check out this NFT!"}
              //   url={
              //     "https://www.xdsea.com" +
              //     webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")
              //   }
            >
              <a>
                <IconImg url={whatsSocial} width="30px" height="30px"></IconImg>
              </a>
            </WhatsappShareButton>
            {copied ? (
              <HStack
                background={({ theme }) => theme.faded}
                padding="3px 9px"
                border="6px"
              >
                <CaptionBoldShort>COPIED</CaptionBoldShort>
              </HStack>
            ) : (
              <a>
                <IconImg
                  onClick={copy}
                  url={linkSocial}
                  width="30px"
                  height="30px"
                ></IconImg>
              </a>
            )}

            {console.log(isShare)}
            {isShare && (
              <HStack onClick={() => setIsShare(false)}>
                <IconImg
                  url={close}
                  width="27px"
                  height="27px"
                  initial={{ opacity: 0.6 }}
                  cursor="pointer"
                ></IconImg>
              </HStack>
            )}
          </HStack>
        )}
      </HStack>
    </HStack>
  );
}

export { TopNFT };
