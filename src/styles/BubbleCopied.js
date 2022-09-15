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
import { truncateAddress } from "../common/common";
import doneIcon from "../images/doneIcon.png";

function BubbleCopied(props) {
  const { logo, address, icon } = props;

  const [showAlertLink, setShowAlertLink] = useState(false);

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
        spacing="9px"
        padding="6px 18px"
        height="48px"
        whileTap={{ scale: 0.97 }}
        cursor="pointer"
        onClick={() => setShowAlertLink(true)}
      >
        <IconImg url={logo} width="21px" height="21px"></IconImg>
        <Spacer></Spacer>
        <Tooltip title={address}>
          {showAlertLink ? (
            <CaptionBoldShort>Address Copied</CaptionBoldShort>
          ) : (
            <CaptionBoldShort textcolor={({ theme }) => theme.text}>
              {truncateAddress(address)}
            </CaptionBoldShort>
          )}
        </Tooltip>
        <Spacer></Spacer>
        {showAlertLink ? (
          <IconImg url={doneIcon} width="18px" height="18px"></IconImg>
        ) : (
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
        )}
      </HStack>
    </>
  );
}

export { BubbleCopied };

const AbsoluteBubble = styled(motion.div)`
  position: absolute;
  top: -21px;
  width: 100%;
`;
