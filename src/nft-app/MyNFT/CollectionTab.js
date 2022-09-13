import React from "react";

import newBlue from "../../images/newBlue.webp";
import { HStack, IconImg } from "../../styles/Stacks";
import { BodyRegular } from "../../styles/TextStyles";

function CollectionTab(props) {
  const { onClick, image, name } = props;

  return (
    <HStack
      self="none"
      background="white"
      height="48px"
      padding="0 15px 0 9px"
      border="30px"
      spacing="9px"
      cursor="pointer"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <IconImg
        url={image || newBlue}
        width="36px"
        height="36px"
        backsize="cover"
        border="36px"
        cursor="pointer"
      ></IconImg>
      <BodyRegular cursor="pointer">{name || "Collection Name"}</BodyRegular>
    </HStack>
  );
}

export { CollectionTab };
