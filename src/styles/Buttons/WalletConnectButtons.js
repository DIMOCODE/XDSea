import React from "react";
import { HStack, IconImg } from "../Stacks";
import { BodyRegular } from "../TextStyles";

function WalletConnectButtons(props) {
  const { isEnabled, onClick, enabledIcon, disabledIcon, walletName } = props;

  return (
    <HStack
      cursor="pointer"
      background="rgb(0,0,0,0.3)"
      padding="9px"
      border="6px"
      whileTap={{
        scale: isEnabled ? 0.98 : 1,
      }}
      onClick={onClick}
    >
      <IconImg
        cursor="pointer"
        url={isEnabled ? enabledIcon : disabledIcon}
        width="30px"
        height="30px"
      ></IconImg>
      <BodyRegular cursor="pointer" textcolor={isEnabled ? "white" : "grey"}>
        {walletName}
      </BodyRegular>
    </HStack>
  );
}

export { WalletConnectButtons };
