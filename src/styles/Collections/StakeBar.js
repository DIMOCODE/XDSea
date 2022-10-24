import React from "react";
import styled from "styled-components";
import { HStack, VStack, ZStack, ZItem } from "../Stacks";
import { CaptionBold, CaptionBoldShort } from "../TextStyles";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

function StakeBar(props) {
  const { advance } = props;

  const adjust = 10;

  return (
    <VStack width="100%" maxheight="15px">
      <ZStack width="100%" height="15px">
        <ZItem>
          <HStack
            width="100%"
            height="15px"
            background="rgba(255, 255, 255, 0.25)"
            border="30px"
          ></HStack>
        </ZItem>
        <ZItem>
          <HStack
            width={advance + "%"}
            height="15px"
            background={({ theme }) => theme.blue}
            border="30px"
          ></HStack>
        </ZItem>
      </ZStack>

      <AbsoluteKnot left={advance - adjust}>
        <VStack background="white" border="30px" width="36px" height="36px">
          <CaptionBoldShort textcolor="black">60%</CaptionBoldShort>
        </VStack>
      </AbsoluteKnot>
    </VStack>
  );
}

export { StakeBar };

const AbsoluteKnot = styled(motion.div)`
  position: absolute;
  top: -11px;
  left: ${(props) => props.left}%;
`;
