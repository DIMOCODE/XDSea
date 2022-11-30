import React from "react";
import { useState } from "react";
import { IconImg, VStack, HStack, Spacer } from "../../../styles/Stacks";
import { BodyRegular, TitleBold15 } from "../../../styles/TextStyles";
import file from "../../../images/fileIcon.png";
import { UploadButton } from "./UploadButton";

import { InputStyled } from "../../../styles/InputStyled";
import { CustomSelector } from "../../../styles/Buttons/CustomSelector";

function UploadBlock() {
  return (
    <VStack
      width="100%"
      background={({ theme }) => theme.backElement}
      border="6px"
      padding="39px 21px"
    >
      <HStack>
        {/* NFT List */}
        <VStack alignment="flex-start" width="100%" spacing="9px">
          <HStack>
            <TitleBold15> NFT List</TitleBold15>
            <BodyRegular> (CSV Format) </BodyRegular>
            <Spacer></Spacer>
          </HStack>

          <UploadButton></UploadButton>
        </VStack>

        {/* BackValue */}
        <VStack alignment="flex-start" width="100%" spacing="9px">
          <HStack>
            <TitleBold15> Back Value</TitleBold15>
            <BodyRegular> (CSV Format) </BodyRegular>
            <Spacer></Spacer>
          </HStack>

          <UploadButton></UploadButton>
        </VStack>
      </HStack>

      <HStack>
        {/* Lock Period */}
        <VStack alignment="flex-start" width="50%" spacing="9px">
          <TitleBold15> Lock Period</TitleBold15>
          <HStack>
            <HStack width="90px">
              <InputStyled
                fontsize="18px"
                type="number"
                background={({ theme }) => theme.faded30}
                width="90px"
                height="52px"
                iconWidth="1px"
                padding="0 12px"
                weight="bold"
                placeholder="0"
                textalign="center"
                textplace="rgba(0, 0, 0, 0.3)"
              ></InputStyled>
            </HStack>
            <CustomSelector></CustomSelector>
          </HStack>
        </VStack>

        <Spacer></Spacer>
      </HStack>
    </VStack>
  );
}

export { UploadBlock };
