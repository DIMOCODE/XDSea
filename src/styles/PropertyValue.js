import React from "react";
import { InputStyled } from "./InputStyled";
import { HStack, VStack } from "./Stacks";
import { TitleBold15 } from "./TextStyles";
import ButtonApp from "./Buttons";

function PropertyValue(props) {
  const { property, value, onClick, onChangeProperty, onChangeValue, propertyKey } = props;
  return (
    <HStack>
      {/* Property Input with Label */}

      <InputStyled
        propertyKey={propertyKey}
        type="text"
        placeholder="Character"
        value={property}
        onChange={onChangeProperty}
      ></InputStyled>

      {/* Value Input with Label */}

      <InputStyled 
        propertyKey={propertyKey}
        type="text" 
        placeholder="Male" 
        value={value} 
        onChange={onChangeValue}
      ></InputStyled>
    </HStack>
  );
}
export { PropertyValue };
