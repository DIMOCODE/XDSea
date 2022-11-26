import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../styles/TextStyles";
import star from "../../images/stakeStar.png";

function StakeBtn(props) {
  const { onClick, claimButton } = props;

  return (
    <HStack
      height="52px"
      width="100%"
      background={({ theme }) => theme.blue}
      padding="0 15px"
      border="6px"
      whileTap={{ scale: 0.96 }}
      spacing="9px"
      cursor="pointer"
      onClick={onClick}
    >
      <BodyMedium cursor="pointer" textcolor="white">
        {claimButton ? "Claim" : "Stake"}
      </BodyMedium>
      <IconImg cursor="pointer" url={star} width="18px" height="18px"></IconImg>
    </HStack>
  );
}

export { StakeBtn };
