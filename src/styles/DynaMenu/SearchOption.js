import React from "react";
import backW from "../../images/backW.png";
import { InputStyled } from "../InputStyled";
import { HStack, IconImg } from "../Stacks";

function SearchOption(props) {
  const { onClick } = props;

  return (
    <HStack spacing="6px" padding="0 9px" self="none">
      <IconImg
        url={backW}
        width="30px"
        height="30px"
        onClick={onClick}
        cursor="pointer"
      ></IconImg>

      <InputStyled
        placeholder="Search"
        background="transparent"
        textcolor="white"
        border="6px 30px 30px 6px"
      ></InputStyled>
    </HStack>
  );
}

export { SearchOption };
