import React from "react";
import backW from "../../images/backW.png";
import closeW from "../../images/crossWhite.png";
import { HStack, IconImg } from "../Stacks";
import { BodyRegular } from "../TextStyles";

function StakeBtn(props) {
  const { onClick } = props;

  return (
    <HStack
      onClick={onClick}
      spacing="6px"
      padding="0 21px 0 12px"
      self="none"
      cursor="pointer"
    >
      <IconImg
        url={closeW}
        width="21px"
        height="21px"
        cursor="pointer"
      ></IconImg>

      <BodyRegular cursor="pointer" textcolor="white">
        Close Stake
      </BodyRegular>
    </HStack>
  );
}

export { StakeBtn };
