import React from "react";
import { HStack, IconImg } from "../Stacks";
import { BodyRegular } from "../TextStyles";

function BtnMenu(props) {
  const { icon, iconw, iconh, name, background, border, onClick } = props;

  return (
    <HStack
      spacing="6px"
      cursor="pointer"
      whileTap={{ scale: 0.96 }}
      background={background}
      border={border}
      padding="0 18px"
      onClick={onClick}
    >
      <BodyRegular textcolor="white" cursor="pointer">
        {name}
      </BodyRegular>
      <IconImg cursor="pointer" url={icon} width="18px" height="18px"></IconImg>
    </HStack>
  );
}

export { BtnMenu };
