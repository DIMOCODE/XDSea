import React from "react";
import { HStack } from "../Stacks";
import { BodyRegular } from "../TextStyles";

function ButtonM(props) {
  const { onClick, title, background, textcolor } = props;

  return (
    <HStack
      background={background}
      width="100%"
      border="6px"
      height="42px"
      cursor="pointer"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      <BodyRegular cursor="pointer" textcolor={textcolor}>
        {title || "Title"}
      </BodyRegular>
    </HStack>
  );
}

export { ButtonM };
