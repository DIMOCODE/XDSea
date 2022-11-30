import React from "react";
import { VStack, IconImg, Spacer } from "../Stacks";
import { CaptionBoldShort, CaptionTiny } from "../TextStyles";
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
      maxheight="36px"
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
