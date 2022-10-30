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
import chevronRight from "../../images/chevronRight.png";
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
import { motion } from "framer-motion/dist/framer-motion";

const webLink = `https://www.xdsea.com/`;

// ${nftaddress}/${id}

function TopNFT(props) {
  const { collectionBanner, collectionName, collectionLogo, onClickCollection } = props;

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
    <HStack height="150px" style={{"margin-top": "-69px"}} backgroundimage={collectionBanner} padding="69px 15px 0 15px">
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
        style={{position: "absolute", left: "15px"}}
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
      >
        <motion.div>
          {isShare ? (
            <HStack>
              <IconImg
                url={chevronRight}
                width="30px"
                height="30px"
                onClick={() => {
                  setIsShare(false);
                }}
                cursor="pointer"
              ></IconImg>
              <FacebookShareButton
                url={"https://www.xdsea.com" + webLocation.pathname}
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
                    cursor="pointer"
                  ></IconImg>
                </a>
              </FacebookShareButton>
              <TwitterShareButton
                title={"Check out this NFT!"}
                url={"https://www.xdsea.com" + webLocation.pathname}
                hashtags={["XDSea", "BuildItOnXDC"]}
              >
                <a>
                  <IconImg
                    url={twitterSocial}
                    width="30px"
                    height="30px"
                    cursor="pointer"
                  ></IconImg>
                </a>
              </TwitterShareButton>
              <TelegramShareButton
                title={"Check out this NFT!"}
                url={"https://www.xdsea.com" + webLocation.pathname}
              >
                <a>
                  <IconImg
                    url={telegramSocial}
                    width="30px"
                    height="30px"
                    cursor="pointer"
                  ></IconImg>
                </a>
              </TelegramShareButton>
              <WhatsappShareButton
                title={"Check out this NFT!"}
                url={"https://www.xdsea.com" + webLocation.pathname}
              >
                <a>
                  <IconImg
                    url={whatsSocial}
                    width="30px"
                    height="30px"
                    cursor="pointer"
                  ></IconImg>
                </a>
              </WhatsappShareButton>

              {copied ? (
                <IconImg
                  url={"https://www.xdsea.com" + webLocation.pathname}
                  width="28px"
                  height="28px"
                ></IconImg>
              ) : (
                <a>
                  <IconImg
                    onClick={copy}
                    url={linkSocial}
                    width="30px"
                    height="30px"
                    cursor="pointer"
                  ></IconImg>
                </a>
              )}
            </HStack>
          ) : (
            <CaptionBoldShort
              onClick={() => {
                setIsShare(true);
              }}
              cursor="pointer"
            >
              SHARE
            </CaptionBoldShort>
          )}
        </motion.div>
      </HStack>
    </HStack>
  );
}

export { TopNFT };
