import React from "react";
import { HStack, IconImg, Spacer } from "../../styles/Stacks";
import xdsea from "../../images/minixdsealogo.png";
import { BodyBold, BodyRegular, CaptionRegular } from "../../styles/TextStyles";
import facebook from "../../images/facebookSocial.png";
import twitter from "../../images/twitterSocial.png";

function CreatorAndShare(props) {
  const { date } = props;
  return (
    <HStack width="100%" responsive={true}>
      {/* Creator and publish time  */}
      <HStack
        spacing="9px"
        background={({ theme }) => theme.faded30}
        height="42px"
        border="6px"
        padding="0 15px"
      >
        <IconImg
          url={xdsea}
          width="26px"
          height="26px"
          backsize="cover"
        ></IconImg>
        <BodyRegular>BY XDSEA TEAM</BodyRegular>
        <BodyRegular initial={{ opacity: 0.6 }}>{date}</BodyRegular>
      </HStack>

      <Spacer></Spacer>

      <HStack>
        <BodyBold>SHARE THIS BLOG</BodyBold>
        <HStack spacing="9px">
          <IconImg
            url={facebook}
            width="30px"
            height="30px"
            backsize="cover"
          ></IconImg>
          <IconImg
            url={twitter}
            width="30px"
            height="30px"
            backsize="cover"
          ></IconImg>
        </HStack>
      </HStack>
    </HStack>
  );
}

export { CreatorAndShare };
