import React, { useState } from "react";

import { useLocation } from "react-router-dom";
import linkSocial from "../images/linkBlack.png";
import whatsSocial from "../images/whatsSocial.png";
import telegramSocial from "../images/telegramSocial.png";
import twitterSocial from "../images/twitterSocial.png";
import facebookSocial from "../images/facebookSocial.png";
import { HStack, Spacer, IconImg, VStack } from "../styles/Stacks";

import mountain from "../images/mountain.jpg";
import close from "../images/crossIcon.png";
import check from "../images/checkBlue.png";
import chevronRight from "../images/chevronRight.png";
import useWindowSize from "../styles/useWindowSize";
import emptyState from "../images/emptyState.png";
import {
  BodyMedium,
  CaptionBoldShort,
  CaptionBold,
  TitleBold18,
} from "../styles/TextStyles";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";

const webLink = `https://www.xdsea.com/`;

function ShareModal(props) {
  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const webLocation = useLocation();
  const [copied, setCopied] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const { nftimage, onClick } = props;

  return (
    <Modal>
      <HStack height="100%">
        <VStack
          border="6px"
          height="auto"
          maxwidth="360px"
          padding="30px"
          background={({ theme }) => theme.backElement}
        >
          <IconImg
            url={nftimage || emptyState}
            width="90px"
            height="90px"
            border="6px"
            backsize="cover"
          ></IconImg>
          <TitleBold18>Share This </TitleBold18>
          <HStack>
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
                  width="52px"
                  height="52px"
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
                  width="52px"
                  height="52px"
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
                  width="52px"
                  height="52px"
                  cursor="pointer"
                ></IconImg>
              </a>
            </TelegramShareButton>
          </HStack>
          <HStack spacing="18px">
            <WhatsappShareButton
              title={"Check out this NFT!"}
              url={"https://www.xdsea.com" + webLocation.pathname}
            >
              <a>
                <IconImg
                  url={whatsSocial}
                  width="52px"
                  height="52px"
                  cursor="pointer"
                ></IconImg>
              </a>
            </WhatsappShareButton>

            {copied ? (
              <>
                <IconImg
                  url={check}
                  width="49px"
                  height="49px"
                  backsize="cover"
                ></IconImg>
              </>
            ) : (
              <a>
                <HStack
                  width="49px"
                  height="49px"
                  border="52px"
                  background={({ theme }) => theme.faded30}
                  onClick={copy}
                >
                  <IconImg
                    url={linkSocial}
                    width="24px"
                    height="24px"
                    cursor="pointer"
                  ></IconImg>
                </HStack>
              </a>
            )}

            <HStack
              width="49px"
              height="49px"
              border="52px"
              background={({ theme }) => theme.faded30}
              onClick={onClick}
              cursor="pointer"
            >
              <IconImg
                url={close}
                width="26px"
                height="26px"
                cursor="pointer"
              ></IconImg>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Modal>
  );
}
export { ShareModal };

const Modal = styled(motion.div)`
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
  z-index: 100;
`;
