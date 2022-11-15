import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { HStack, VStack, IconImg, Spacer } from "./Stacks";
import {
  CaptionBoldShort,
  CaptionSmallRegular,
  CaptionTiny,
} from "./TextStyles";
import { appStyle } from "./AppStyles";
import styled from "styled-components";
import checkOk from "../images/checkOkIcon.png";
import { motion } from "framer-motion/dist/framer-motion";
import { Tooltip } from "@mui/material";
import { truncateAddress } from "../common/common";
import doneIcon from "../images/doneIcon.png";

function BubbleCopied(props) {
  const { logo, address, icon, background, textColor, addressCreator } = props;

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
        background={background}
        border="30px"
        spacing="6px"
        padding="6px 15px"
        height="39px"
        whileTap={{ scale: 0.97 }}
        cursor="pointer"
        onClick={() => setShowAlertLink(true)}
      >
        <VStack spacing="0px" alignment="flex-start">
          <CaptionTiny textcolor={textColor} style={{ "margin-bottom": "0px" }}>
            WALLET
          </CaptionTiny>
          <Tooltip title={addressCreator}>
            {showAlertLink ? (
              <CaptionBoldShort style={{ "white-space": "nowrap" }}>
                Address Copied
              </CaptionBoldShort>
            ) : (
              <CaptionBoldShort textcolor={textColor}>
                {address}
              </CaptionBoldShort>
            )}
          </Tooltip>
        </VStack>
        <Spacer></Spacer>
        {showAlertLink ? (
          <IconImg url={doneIcon} width="15px" height="15px"></IconImg>
        ) : (
          <IconImg
            cursor="pointer"
            onClick={() => {
              setShowAlertLink(true);
              navigator.clipboard.writeText(addressCreator);
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
