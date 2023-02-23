import React from "react";

import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import styled from "styled-components";

function NFTValue(props) {
  return (
    <HStack width="100%">
      <VStack
        background={({ theme }) => theme.faded30}
        backgroundimage={props.image}
        border="6px"
        maxwidth="76px"
        height="76px"
      ></VStack>

      <VStack spacing="3px" width="100%" alignment="flex-start">
        <BodyMedium>{props.name}</BodyMedium>
        <Input
          type={"number"}
          placeholder={"000"}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </VStack>
    </HStack>
  );
}

export { NFTValue };

const Input = styled.input`
  background: ${({ theme }) => theme.faded30};
  border: 2px solid rgba(0, 0, 0, 0);
  height: 52px;
  width: 100%;
  padding: 9px;
  border-radius: 9px;
  outline: 0;
  text-align: center;

  &:focus {
    outline: none;
    border: 2px solid #1f42f8;
  }
`;
