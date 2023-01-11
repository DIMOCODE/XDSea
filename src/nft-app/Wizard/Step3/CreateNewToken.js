import React from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import styled from "styled-components";
import imageSelector from "../../../images/ImageSelector.svg";
import { ActionButtons } from "../ActionButtons";

function CreateNewToken(props) {
  return (
    <VStack width="100%" maxheight="420px">
      <VStack spacing="9px">
        <IconImg url={imageSelector} width="90px" height="90px"></IconImg>
        <BodyMedium>Upload Token</BodyMedium>
      </VStack>

      <VStack height="90px" width="100%" alignment="flex-start">
        <BodyMedium>Token Contact Address</BodyMedium>
        <Input placeholder={"Contract Address"} />
      </VStack>

      <HStack>
        <VStack height="90px" alignment="flex-start">
          <BodyMedium>Token Name</BodyMedium>
          <Input placeholder={"Ej. XDC"} />
        </VStack>

        <VStack height="90px" alignment="flex-start">
          <BodyMedium>Hex Color Token</BodyMedium>
          <Input placeholder={"#1f42f8"} />
        </VStack>
      </HStack>

      <ActionButtons
        grayBtn="Cancel"
        onClickGray={props.onClickCancel}
        blueBtn="Create Token"
        onClickBlue={props.onClickCreate}
      ></ActionButtons>
    </VStack>
  );
}

export { CreateNewToken };

const Input = styled.input`
  background: ${({ theme }) => theme.faded30};
  border: 2px solid rgba(0, 0, 0, 0);
  height: 52px;
  width: 100%;
  padding: 9px 9px 9px 21px;
  border-radius: 9px;
  outline: 0;
  text-align: center;

  &:focus {
    outline: none;
    border: 2px solid #1f42f8;
  }
`;
