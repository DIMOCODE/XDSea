import React from "react";
import back from "../../images/backB.png";
import { HStack, VStack, IconImg } from "../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold27,
  BodyMedium,
} from "../../styles/TextStyles";

function TopBarStake(props) {
  const { collection } = props;

  return (
    <HStack responsive={true} padding="30px 0">
      <HStack justify="flex-start">
        <HStack
          background={({ theme }) => theme.faded}
          border="6px"
          self="none"
          height="42px"
          padding="0 12px"
          cursor="pointer"
          whileTap={{ scale: 0.96 }}
        >
          <IconImg
            cursor="pointer"
            url={back}
            width="15px"
            height="15px"
          ></IconImg>{" "}
          <BodyMedium cursor="pointer">Back</BodyMedium>
        </HStack>
      </HStack>

      <VStack spacing="3px" padding="0 30px">
        <CaptionBoldShort initial={{ opacity: 0.6 }}>
          COLLECTION
        </CaptionBoldShort>
        <TitleBold27 align="center">{collection}</TitleBold27>
      </VStack>

      <HStack width="91px"></HStack>
    </HStack>
  );
}

export { TopBarStake };
