import React from "react";
import { IconImg, VStack, HStack, Spacer } from "../../styles/Stacks";
import { Tooltip } from "@mui/material";
import {
  CaptionBold,
  CaptionBoldShort,
  TitleBold18,
  BodyRegular,
} from "../../styles/TextStyles";
import verified from "../../images/verified.png";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { CollectionStats } from "./CollectionStats";
import { LoopBars } from "../../styles/LoopBars";
import { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import copiedLink from "../../images/oklink.png";
import chevronRight from "../../images/chevronRight.png";
import { CircleButton } from "../../styles/CircleButton";
import instagram from "../../images/instagramColor.png";
import twitter from "../../images/twitterColor.png";
import link from "../../images/webColor.png";
import discord from "../../images/discordColor.png";

function BannerMobile(props) {
  const {
    collectionImage,
    onClickCreator,
    tooltip,
    addressCreator,
    isVerified,
    collectionName,
    collectionNickName,
    owners,
    nftCount,
    floorPrice,
    volumeTrade,
    collectionDescription,
    twitterUrl,
    instagramUrl,
    discordUrl,
    websiteUrl,
  } = props;

  const [isShare, setIsShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const webLink = `https://www.xdsea.com/collection/${collectionNickName}`;

  /**
   * Copy the current location URL to the clipboard
   */
  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <VStack padding="90px 12px 0 12px" alignment="flex-start">
      <HStack>
        <IconImg
          url={collectionImage}
          width="69px"
          height="69px"
          border="9px"
          bordersize="3px"
          bordercolor="white"
          backsize="cover"
          style={{
            boxShadow: "0px 3px 9px 0px rgba(0, 0, 0, 0.3)",
          }}
        ></IconImg>

        <CreatorAbsolute>
          <HStack
            onClick={onClickCreator}
            border="0 6px 6px 0"
            padding="6px 9px"
            height="42px"
            style={{
              boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
            }}
            cursor={"pointer"}
            background={({ theme }) => theme.backElement}
          >
            <VStack spacing="0px" alignment="flex-start" cursor={"pointer"}>
              <CaptionBold textcolor={({ theme }) => theme.text}>
                CREATOR
              </CaptionBold>
              <HStack spacing="6px">
                <Tooltip title={tooltip}>
                  <CaptionBold textcolor={({ theme }) => theme.text}>
                    {addressCreator}
                  </CaptionBold>
                </Tooltip>

                {isVerified ? (
                  <IconImg
                    cursor={"pointer"}
                    url={verified}
                    width="15px"
                    height="15px"
                  ></IconImg>
                ) : null}
              </HStack>
            </VStack>
          </HStack>
        </CreatorAbsolute>

        <Spacer></Spacer>
        <HStack
          justify="flex-start"
          border="30px"
          padding="0 25px"
          spacing="15px"
          height="42px"
          self="none"
          background={({ theme }) => theme.backElement}
          style={{
            marginBottom: "3px",
            zIndex: "1"
          }}
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
                ></IconImg>
                <FacebookShareButton
                  url={webLink}
                  quote={"Check out this NFT Collection!"}
                  hashtag={["#XDSea"]}
                  description={"XDSea"}
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
                  title={"Check out this NFT Collection!"}
                  url={webLink}
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
                  title={"Check out this NFT Collection!"}
                  url={webLink}
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
                  title={"Check out this NFT Collection!"}
                  url={webLink}
                >
                  <a>
                    <IconImg
                      url={whatsSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                </WhatsappShareButton>

                {copied ? (
                  <IconImg
                    url={copiedLink}
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
                    ></IconImg>
                  </a>
                )}
              </HStack>
            ) : (
              <CaptionBoldShort 
                onClick={() => {
                  setIsShare(true);
                }}
              >SHARE</CaptionBoldShort>
            )}
          </motion.div>
        </HStack>
      </HStack>

      {/* Collection Name */}
      <VStack
        background={({ theme }) => theme.walletButton}
        padding="6px 15px"
        border="9px"
        spacing="3px"
        style={{
          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
        }}
        alignment="flex-start"
      >
        <CaptionBold initial={{ opacity: 0.6 }} textcolor="white">
          COLLECTION
        </CaptionBold>

        <TitleBold18 align="center" textcolor={({ theme }) => theme.walletText}>
          {collectionName}
        </TitleBold18>
      </VStack>
      <CollectionStats
        owners={owners}
        nftsCount={nftCount}
        floorPrice={floorPrice}
        volumeTrade={volumeTrade}
        width="100%"
      ></CollectionStats>

      {/* Collection Description */}
      <VStack
        padding="15px 60px"
        maxwidth="1200px"
        background={({ theme }) => theme.backElement}
        border="6px"
      >
        {collectionDescription !== undefined ? (
          <BodyRegular
            textcolor={({ theme }) => theme.text}
            align="flex-start"
          >
            {collectionDescription}
          </BodyRegular>
        ) : (
          <VStack maxwidth="1200px">
            <LoopBars width="340px"></LoopBars>
            <LoopBars width="300px"></LoopBars>
          </VStack>
        )}
        {/* Collection Social Links */}
        <HStack>
          {twitterUrl ? (
            <a
              href={twitterUrl}
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                borderRadius: 9,
              }}
            >
              <CircleButton
                image={twitter}
                background={"#FFFFFF"}
              ></CircleButton>
            </a>
          ) : (
            <></>
          )}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                borderRadius: 9,
              }}
            >
              <CircleButton
                image={instagram}
                background={"#FFFFFF"}
              ></CircleButton>
            </a>
          ) : (
            <></>
          )}
          {discordUrl ? (
            <a
              href={discordUrl}
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                borderRadius: 9,
              }}
            >
              <CircleButton
                image={discord}
                background={"#FFFFFF"}
              ></CircleButton>
            </a>
          ) : (
            <></>
          )}
          {websiteUrl ? (
            <a
              href={websiteUrl}
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                borderRadius: 9,
              }}
            >
              <CircleButton
                image={link}
                background={"#FFFFFF"}
              ></CircleButton>
            </a>
          ) : (
            <></>
          )}
        </HStack>
      </VStack>
    </VStack>
  );
}

export { BannerMobile };

const CreatorAbsolute = styled(motion.div)`
  position: absolute;
  top: 12px;
  left: 69px;
`;
