import React from "react";

import crossW from "../../images/crossWhite.png";
import { HStack, IconImg } from "../Stacks";

function CloseIconBtn(props) {
  const { onClick } = props;

  return (
    <HStack
      onClick={onClick}
      background="rgba(255,255,255,0.1)"
      width="36px"
      height="36px"
      border="30px"
      whileTap={{ scale: 0.96 }}
    >
      <IconImg
        url={crossW}
        width="18px"
        height="18px"
        cursor="pointer"
        whileTap={{ scale: 0.96 }}
      ></IconImg>
    </HStack>
  );
}

export { CloseIconBtn };
