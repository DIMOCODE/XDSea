import React from "react";
import { HStack } from "../Stacks";
import { BodyRegular } from "../TextStyles";

function ButtonM(props) {
  const {
    onClick,
    title,
    background,
    textcolor,
    height,
    width,
    border,
    disabled,
  } = props;

  return (
    <HStack
      background={background}
      width={width || "100%"}
      border={border || "9px"}
      height={height || "42px"}
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? 0.5 : 1}
      whileTap={{ scale: 0.96 }}
      onClick={disabled ? () => {} : onClick}
    >
      <BodyRegular
        cursor={disabled ? "not-allowed" : "pointer"}
        textcolor={textcolor}
      >
        {title || "Title"}
      </BodyRegular>
    </HStack>
  );
}

export { ButtonM };
