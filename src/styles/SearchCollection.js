import React from "react";
import { HStack, VStack } from "./Stacks";
import search from "../../src/images/searchIcon.png";
import { InputStyled } from "../../src/styles/InputStyled";

function SearchCollection(props) {
  const { inputId, placeholder, result, onChange, onKeyPress, onClickIcon } = props;
  return (
    <HStack width="100%">
      <InputStyled
        inputId={inputId}
        type="text"
        placeholder={placeholder}
        background={({ theme }) => theme.backElement}
        icon={search}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onClickIcon = {onClickIcon}
        iconClickable={true}
        input={result}
        height="50px"
        iconHeight="30px"
        iconWidth="18px"
        textplace={"rgba(0,0,0,0.6)"}
      ></InputStyled>
    </HStack>
  );
}

export { SearchCollection };
