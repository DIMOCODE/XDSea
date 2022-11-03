import React from "react";
import { HStack, IconImg } from "../../../styles/Stacks";
import { TitleBold15 } from "../../../styles/TextStyles";

function TabToken(props) {
  const { image, name } = props;
  return (
    <HStack spacing="6px">
      <IconImg url={image} width="18px" height="18px"></IconImg>
      <TitleBold15>{name}</TitleBold15>
    </HStack>
  );
}

export { TabToken };
