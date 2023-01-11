import React from "react";
import { VStack, HStack } from "../../../styles/Stacks";
import { BodyBold, BodyMedium } from "../../../styles/TextStyles";

function PCollectionAddress(props) {
  return (
    <VStack alignment="flex-start" height="90px" width="100%">
      <BodyMedium>NFT Collection Address</BodyMedium>
      <HStack
        height="52px"
        background={({ theme }) => theme.faded30}
        border="6px"
        width="100%"
      >
        <BodyBold>{props.contract}</BodyBold>
      </HStack>
    </VStack>
  );
}

export { PCollectionAddress };
