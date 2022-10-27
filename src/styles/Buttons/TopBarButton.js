import React from "react";
import { HStack } from "../Stacks";
import { BodyMedium } from "../TextStyles";

function TopBarButton(props) {
  const { background, onClick, text, textcolor } = props;

  return (
    <HStack
      background={background}
      self="auto"
      height="42px"
      width="99px"
      border="6px"
      minwidth="300px"
      whileTap={{ scale: 0.9 }}
      cursor="pointer"
      onClick={onClick}
    >
      <BodyMedium cursor="pointer" textcolor={textcolor}>
        {text}
      </BodyMedium>
    </HStack>
  );
}

export { TopBarButton };
