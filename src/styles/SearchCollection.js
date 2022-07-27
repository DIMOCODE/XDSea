import React from "react";
import { HStack, VStack } from "./Stacks";
import search from "../../src/images/searchIcon.png";
import { InputStyled } from "../../src/styles/InputStyled";

function SearchCollection(props) {
  const { placeholder, result, onChange } = props;
  return (
    <HStack width="100%">
      <InputStyled
        type="text"
        placeholder={placeholder}
        background={({ theme }) => theme.backElement}
        icon={search}
        onChange={onChange}
        input={result}
        height="50px"
        iconHeight="30px"
        iconWidth="18px"
      ></InputStyled>
    </HStack>
  );
}

export { SearchCollection };
