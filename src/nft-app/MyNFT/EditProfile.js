import React from "react";
import { HStack, IconImg } from "../../styles/Stacks";
import { BodyBold, BodyRegular } from "../../styles/TextStyles";

function EditProfile(props) {
  const { background, textcolor, image, onClick } = props;
  return (
    <HStack
      background={background}
      border="10px"
      cursor="pointer"
      minheight="39px"
      self="none"
      spacing="6px"
      padding="0 6px 0 9px"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      <BodyRegular textcolor={textcolor} cursor="pointer">
        Edit
      </BodyRegular>
      <IconImg
        cursor="pointer"
        url={image}
        width="24px"
        height="24px"
      ></IconImg>
    </HStack>
  );
}

export { EditProfile };
