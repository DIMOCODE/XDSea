import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../styles/TextStyles";
import star from "../../images/stakeStar.png";

function ListBtn(props) {
  const { onClick } = props;

  return (
    <HStack
      height="52px"
      width="100%"
      background="black"
      padding="0 15px"
      border="6px"
      whileTap={{ scale: 0.96 }}
      spacing="9px"
      cursor="pointer"
      onClick={onClick}
    >
      <BodyMedium cursor="pointer" textcolor="white">
        List
      </BodyMedium>
      <IconImg cursor="pointer" url={star} width="18px" height="18px"></IconImg>
    </HStack>
  );
}

export { ListBtn };
