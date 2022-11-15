import React, { useState } from "react";

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
import { HStack, IconImg } from "../../styles/Stacks";
import { CaptionBoldShort } from "../../styles/TextStyles";

function ShareBar(props) {
  const { url, onClickCopied } = props;
  const [copied, setCopied] = useState(false);

  return (
    <HStack
      justify="flex-start"
      border="30px"
      padding="0 15px"
      spacing="15px"
      height="42px"
      background={({ theme }) => theme.backElement}
    >
      <CaptionBoldShort>SHARE</CaptionBoldShort>

      <FacebookShareButton
        url={url}
        quote={"Check out this Creator on XDSea!"}
        hashtag={["#XDSea"]}
        description={"XDSea"}
        className="Demo__some-network__share-button"
      >
        <a>
          <IconImg url={facebookSocial} width="30px" height="30px"></IconImg>
        </a>
      </FacebookShareButton>
      <TwitterShareButton
        title={"Check out this Creator on XDSea!"}
        url={url}
        hashtags={["XDSea", "BuildItOnXDC"]}
      >
        <a>
          <IconImg url={twitterSocial} width="30px" height="30px"></IconImg>
        </a>
      </TwitterShareButton>
      <TelegramShareButton title={"Check out this Creator on XDSea!"} url={url}>
        <a>
          <IconImg url={telegramSocial} width="30px" height="30px"></IconImg>
        </a>
      </TelegramShareButton>
      <WhatsappShareButton title={"Check out this Creator on XDSea!"} url={url}>
        <a>
          <IconImg url={whatsSocial} width="30px" height="30px"></IconImg>
        </a>
      </WhatsappShareButton>

      {copied ? (
        <IconImg url={copiedLink} width="28px" height="28px"></IconImg>
      ) : (
        <a>
          <IconImg
            onClick={onClickCopied}
            url={linkSocial}
            width="30px"
            height="30px"
          ></IconImg>
        </a>
      )}
    </HStack>
  );
}

export { ShareBar };
