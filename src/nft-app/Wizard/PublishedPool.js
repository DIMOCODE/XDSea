import React from "react";
import { HStack, VStack } from "../../styles/Stacks";
import stakeIcon from "../../images/stakingPool.png";
import { BodyBold, BodyMedium } from "../../styles/TextStyles";

function PublishedPool() {
  return (
    <HStack
      width="100%"
      background="white"
      height="111px"
      padding="0 30px"
      spacing="18px"
    >
      <VStack
        backgroundimage={stakeIcon}
        maxwidth="52px"
        height="59px"
      ></VStack>
      <VStack
        width="100%"
        spacing="6px"
        alignment="flex-start"
        whileTap={{ scale: "0.99" }}
        cursor="pointer"
      >
        <BodyBold cursor="pointer">Your Staking Pool</BodyBold>
        <BodyMedium cursor="pointer">Created 19 Dec 2022</BodyMedium>
      </VStack>
    </HStack>
  );
}

export { PublishedPool };
