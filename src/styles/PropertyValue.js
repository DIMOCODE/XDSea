import React from "react";
import { InputStyled } from "./InputStyled";
import { HStack, VStack } from "./Stacks";
import { TitleBold15 } from "./TextStyles";
import ButtonApp from "./Buttons";

function PropertyValue(props) {
  const { property, value, onClick } = props;
  return (
    <HStack>
      {/* Property Input with Label */}

      <InputStyled
        type="text"
        placeholder="Character"
        value={property}
      ></InputStyled>

      {/* Value Input with Label */}

      <InputStyled type="text" placeholder="Male" value={value}></InputStyled>

      <ButtonApp
        text="-"
        textcolor={({ theme }) => theme.text}
        background={({ theme }) => theme.backElement}
        height="39px"
        border="90px"
        onClick={onClick}
      ></ButtonApp>
    </HStack>
  );
}
export { PropertyValue };
