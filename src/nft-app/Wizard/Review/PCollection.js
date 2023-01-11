import React from "react";
import { HStack, VStack, Spacer } from "../../../styles/Stacks";
import {
  BodyMedium,
  BodyBold,
  CaptionBoldShort,
} from "../../../styles/TextStyles";

function PCollection(props) {
  return (
    <VStack alignment="flex-start" height="90px" width="100%">
      <BodyMedium>Collection</BodyMedium>
      <HStack
        height="52px"
        background="rgba(54, 102, 255, 0.21)"
        border="6px"
        width="100%"
        padding="0 18px"
      >
        <BodyBold textcolor={({ theme }) => theme.blueText}>
          NFTs on Pool
        </BodyBold>

        <Spacer></Spacer>
        <HStack
          border="6px"
          background={({ theme }) => theme.blueText}
          self="none"
          padding="9px"
        >
          <CaptionBoldShort textcolor="white">
            {props.amount + " items"}
          </CaptionBoldShort>
        </HStack>
      </HStack>
    </VStack>
  );
}

export { PCollection };
