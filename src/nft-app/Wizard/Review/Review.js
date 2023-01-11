import React from "react";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { HStack, VStack, Spacer } from "../../../styles/Stacks";
import {
  BodyBold,
  BodyMedium,
  CaptionBoldShort,
  TitleBold30,
} from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";

function Review() {
  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="600px">
        <VStack alignment="flex-start" spacing="6px" width="100%">
          <TitleBold30>Review</TitleBold30>
          <BodyMedium>Double check your staking pool settings</BodyMedium>
        </VStack>

        {/* NFT Collection Address */}
        <VStack alignment="flex-start" height="90px" width="100%">
          <BodyMedium>NFT Collection Address</BodyMedium>
          <HStack
            height="52px"
            background={({ theme }) => theme.faded30}
            border="6px"
            width="100%"
          >
            <BodyBold>0x8900388008588030985760957</BodyBold>
          </HStack>
        </VStack>

        {/* NFT Collection Address */}
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
              <CaptionBoldShort textcolor="white">340 items</CaptionBoldShort>
            </HStack>
          </HStack>
        </VStack>

        {/* Reward Token, Rate and Frequency */}
        <VStack alignment="flex-start" height="120px" width="100%">
          <BodyMedium>Reward Token, Rate & Frequency</BodyMedium>

          <HStack
            height="62px"
            background={({ theme }) => theme.faded30}
            border="6px"
            width="100%"
            padding="0 21px"
          >
            <VStack
              maxwidth="42px"
              height="42px"
              background="gray"
              border="42px"
            ></VStack>

            <VStack spacing="3px" width="100%">
              <CaptionBoldShort>Name</CaptionBoldShort>
              <BodyMedium>XDC</BodyMedium>
            </VStack>
            <VStack spacing="3px" width="100%">
              <CaptionBoldShort>Reward Rate</CaptionBoldShort>
              <BodyMedium>300</BodyMedium>
            </VStack>
            <VStack spacing="3px" width="100%">
              <CaptionBoldShort>Frequency</CaptionBoldShort>
              <BodyMedium>3 Days</BodyMedium>
            </VStack>
          </HStack>
        </VStack>

        {/* BackedValue and Lock in Period */}
        <HStack>
          <VStack width="100%" spacing="9px" alignment="flex-start">
            <BodyMedium>Backed Value</BodyMedium>
            <HStack
              height="52px"
              background="rgba(54, 102, 255, 0.21)"
              border="6px"
              width="100%"
              padding="0 18px"
            >
              <BodyBold textcolor={({ theme }) => theme.blueText}>
                340 Value Locked
              </BodyBold>
            </HStack>
          </VStack>

          <VStack width="100%" spacing="9px" alignment="flex-start">
            <BodyMedium>Lock in Period</BodyMedium>

            <HStack
              height="52px"
              background={({ theme }) => theme.faded30}
              border="6px"
              width="100%"
            >
              <BodyBold>3 Weeks</BodyBold>
            </HStack>
          </VStack>
        </HStack>

        <ButtonM
          title="Publish Stakin Pool"
          background={({ theme }) => theme.blue}
          textcolor="white"
          height="52px"
        ></ButtonM>
      </VStack>
    </HStack>
  );
}

export { Review };
