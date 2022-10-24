import React from "react";

import closeIcon from "../../images/closeIconRound.png";
import { IconImg } from "../Stacks";

function CloseIconBtn(props) {
  const { onClick } = props;

  return (
    <IconImg
      url={closeIcon}
      width="30px"
      height="30px"
      cursor="pointer"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    ></IconImg>
  );
}

export { CloseIconBtn };
