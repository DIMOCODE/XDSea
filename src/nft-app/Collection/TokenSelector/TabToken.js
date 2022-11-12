import React from "react";
import { HStack, IconImg } from "../../../styles/Stacks";
import { TitleBold18 } from "../../../styles/TextStyles";

function TabToken(props) {
  const { image, name } = props;
  return (
    <HStack
      spacing="6px"
      background={({ theme }) => theme.faded}
      padding="0 15px"
      border="30px"
      height="39px"
      cursor="pointer"
      whileTap={{ scale: 0.96 }}
    >
      <IconImg
        url={image}
        cursor="pointer"
        width="18px"
        height="18px"
      ></IconImg>

      <TitleBold18 cursor="pointer">{name}</TitleBold18>
    </HStack>
  );
}

export { TabToken };
