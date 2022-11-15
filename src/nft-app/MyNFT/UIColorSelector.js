import React, { useState } from "react";
import { HStack, Spacer } from "../../styles/Stacks";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";

import { AnimatePresence, LayoutGroup } from "framer-motion/dist/framer-motion";
import { CaptionBoldShort } from "../../styles/TextStyles";

function UIColorSelector(props) {
  const [isDarkUI, setIsDarkUI] = useState(false);
  const { onClickDark, onClickClean, width, widthTab } = props;

  return (
    <HStack width="100%" justify="flex-end">
      <HStack
        background="rgba(0, 0, 0, 0.21)"
        height="42px"
        width={width || "240px"}
        spacing="0px"
        border="6px"
        blur="30px"
        overflowx="hidden"
      >
        <Selector>
          <AnimatePresence initial="false">
            <HStack width="100%" justify={isDarkUI ? "flex-start" : "flex-end"}>
              <HStack
                height="42px"
                width={widthTab || "50%"}
                background="rgba(0, 0, 0, 0.52)"
                border="6px"
                cursor="pointer"
                layout
              ></HStack>
            </HStack>
          </AnimatePresence>
        </Selector>

        <HStack
          width="100%"
          cursor="pointer"
          onClick={onClickDark}
          whileTap={() => setIsDarkUI(true)}
        >
          <CaptionBoldShort cursor="pointer" textcolor="white">
            DARK UI
          </CaptionBoldShort>
        </HStack>
        <HStack
          width="100%"
          onClick={onClickClean}
          whileTap={() => setIsDarkUI(false)}
          cursor="pointer"
        >
          <CaptionBoldShort textcolor="white" cursor="pointer">
            CLEAN UI
          </CaptionBoldShort>
        </HStack>
      </HStack>
    </HStack>
  );
}

export { UIColorSelector };

const Selector = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 42px;
`;
