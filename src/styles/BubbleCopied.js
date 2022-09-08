import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { HStack, IconImg, Spacer } from "./Stacks";
import { CaptionBoldShort } from "./TextStyles";
import { appStyle } from "./AppStyles";
import styled from "styled-components";
import checkOk from "../images/checkOkIcon.png";
import { motion } from "framer-motion/dist/framer-motion";
import { Tooltip } from "@mui/material";

function BubbleCopied(props) {
  const { logo, domain, isDomain, address, icon } = props;

  const [showAlertLink, setShowAlertLink] = useState(false);

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 6) + "..." + address.substring(38)
      : "undefined";
  };

  useEffect(() => {
    let timeout;
    if (showAlertLink) {
      timeout = setTimeout(() => setShowAlertLink(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [showAlertLink]);

  return (
    <>
      <HStack
        background={({ theme }) => theme.backElement}
        border="30px"
        spacing="6px"
        padding="6px 12px"
        whileTap={{ scale: 0.97 }}
        cursor="pointer"
        onClick={() => setShowAlertLink(true)}
      >
        <IconImg url={logo} width="21px" height="21px"></IconImg>
        <Spacer></Spacer>
        <Tooltip title={address}>
          <CaptionBoldShort textcolor={({ theme }) => theme.text}>
            {isDomain ? domain : truncateAddress(address)}
          </CaptionBoldShort>
        </Tooltip>
        <Spacer></Spacer>
        <IconImg 
          cursor="pointer" 
          onClick={() => {
            setShowAlertLink(true);
            navigator.clipboard.writeText(address);
          }} 
          url={icon} 
          width="21px" 
          height="21px"
        ></IconImg>
      </HStack>
      {showAlertLink && (
        <AbsoluteBubble initial={{ y: 0 }} animate={{ y: 5 }}>
          <HStack background={appStyle.colors.blue} height="36px" border="9px">
            <CaptionBoldShort textcolor={appStyle.colors.white}>
              Address Copied
            </CaptionBoldShort>
            <IconImg url={checkOk} width="18px" height="18px"></IconImg>
          </HStack>
        </AbsoluteBubble>
      )}
    </>
  );
}

export { BubbleCopied };

const AbsoluteBubble = styled(motion.div)`
  position: absolute;
  top: -21px;
  width: 100%;
`;
