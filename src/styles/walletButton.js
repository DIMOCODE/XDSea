import React from "react";
import Tooltip from '@mui/material/Tooltip'
import { HStack, IconImg, VStack } from "./Stacks";
import XDClogo from "../images/miniXdcLogo.png";

import { BodyBold, BodyRegular, CaptionRegular } from "./TextStyles";

function WalletButton(props) {
  const { status, wallet } = props;

  const truncateAddress = (address) => {
    return address.substring(0, 7) + "..." + address.substring(38)
  };

  return (
    <VStack maxwidth="160px" onClick={props.onClick}>
      <HStack
        height="49px"
        background={({ theme }) => theme.walletButton}
        border="9px"
        spacing="6px"
        padding="3px 12px"
        cursor="pointer"
      >
        <VStack minwidth="94px" spacing="0px" alignment="flex-start">
          {status
            ? <>
                <CaptionRegular textcolor={({ theme }) => theme.walletText}>
                  Connected
                </CaptionRegular>
                <Tooltip title={wallet?.address}>
                  <BodyRegular textcolor={({ theme }) => theme.walletText}>
                    {truncateAddress(wallet?.address)}
                  </BodyRegular>
                </Tooltip>
              </>
            : <>
                <CaptionRegular textcolor={({ theme }) => theme.walletText}>
                  Connect
                </CaptionRegular>
                <BodyBold textcolor={({ theme }) => theme.walletText}>
                  XDC Wallet
                </BodyBold>
              </>
          }

        </VStack>
        <IconImg url={XDClogo} width="30px" height="30px"></IconImg>
      </HStack>
    </VStack>
  );
}

export { WalletButton };
