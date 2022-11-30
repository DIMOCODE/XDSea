import React from "react";
import backW from "../../images/backW.png";
import crossW from "../../images/crossWhite.png";
import { InputStyled } from "../InputStyled";
import { HStack, IconImg } from "../Stacks";

function SearchOption(props) {
  const { onClickBack, onChange, placeholder, onClickCancel } = props;

  return (
    <HStack spacing="6px" padding="0 9px" self="none">
      <IconImg
        url={backW}
        width="30px"
        height="30px"
        onClick={onClickBack}
        cursor="pointer"
      ></IconImg>

      <InputStyled
        placeholder={placeholder === "" ? "Search" : placeholder}
        background="transparent"
        textcolor="white"
        border="6px 30px 30px 6px"
        inputId="SearchbarDynaMenu"
        onChange={onChange}
      ></InputStyled>

      {placeholder !== "" && (
        <IconImg
          url={crossW}
          width="30px"
          height="30px"
          onClick={onClickCancel}
          cursor="pointer"
        ></IconImg>
      )}
    </HStack>
  );
}

export { SearchOption };
