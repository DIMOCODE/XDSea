import React from "react";

import crossW from "../../images/crossWhite.png";
import { IconImg } from "../Stacks";

function CloseIconBtn(props) {
  const { onClick } = props;

  return (
    <IconImg
      url={crossW}
      width="30px"
      height="30px"
      cursor="pointer"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    ></IconImg>
  );
}

export { CloseIconBtn };
