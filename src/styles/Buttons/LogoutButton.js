import React from "react";
import { VStack, IconImg } from "../Stacks";
import { CaptionTiny } from "../TextStyles";
import logoutIcon from "../../images/shutdownWhite.png";

function LogoutButton(props) {
  const { onClick } = props;

  return (
    <VStack
      maxwidth={"50px"}
      spacing="3px"
      cursor="pointer"
      onClick={onClick}
      alignment="center"
    >
      <IconImg
        url={logoutIcon}
        width="16px"
        height="16px"
        cursor="pointer"
      ></IconImg>
      <CaptionTiny cursor="pointer" textcolor="white">
        LOGOUT
      </CaptionTiny>
    </VStack>
  );
}

export { LogoutButton };
