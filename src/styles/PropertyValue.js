import React from "react";
import { InputStyled } from "./InputStyled";
import { HStack, VStack } from "./Stacks";
import { TitleBold15 } from "./TextStyles";
import ButtonApp from "./Buttons";
import styled from "styled-components";

function PropertyValue(props) {
  const {
    property,
    value,
    onClick,
    onChangeProperty,
    onChangeValue,
    propertyKey,
  } = props;
  return (
    <VStack
      minwidth="168px"
      maxwidth="168px"
      maxheight="126px"
      minheight="126px"
      background={({ theme }) => theme.backElement}
      border="15px"
      spacing="0px"
    >
      {/* Property Input with Label */}

      <InputStyled
        propertyKey={propertyKey}
        type="text"
        placeholder="Character"
        value={property}
        onChange={onChangeProperty}
        textalign="center"
        padding="0px"
        fontsize="12px"
        texttransform="uppercase"
        height="26px"
      ></InputStyled>

      {/* Value Input with Label */}

      <InputStyled
        propertyKey={propertyKey}
        type="text"
        placeholder="Male"
        value={value}
        onChange={onChangeValue}
        textalign="center"
        padding="0px"
        height="26px"
      ></InputStyled>
    </VStack>
  );
}
export { PropertyValue };
