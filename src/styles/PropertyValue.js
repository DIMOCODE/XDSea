import React from "react";
import { InputStyled } from "./InputStyled";
import { VStack } from "./Stacks";

function PropertyValue(props) {
  const {
    property,
    value,
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
        textplace={"rgba(0,0,0,0.6)"}
      ></InputStyled>
      <InputStyled
        propertyKey={propertyKey}
        type="text"
        placeholder="Male"
        value={value}
        onChange={onChangeValue}
        textalign="center"
        padding="0px"
        height="26px"
        textplace={"rgba(0,0,0,0.6)"}
      ></InputStyled>
    </VStack>
  );
}
export { PropertyValue };
