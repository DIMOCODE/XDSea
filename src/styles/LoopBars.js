import React from "react";
import { HStack } from "./Stacks";
import loaderLogo from "../images/logoLoadingXuppi.png";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";

function LoopBars(props) {
  const { width } = props;
  return (
    <LayoutGroup id="loopBars">
      <AnimatePresence>
        <HStack>
          <HStack
            background="rgba(153, 162, 175, 0.3)"
            key="bars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.3,
            }}
            url={loaderLogo}
            width={width}
            minheight="20px"
            border="6px"
          >
            <Bar>Loading</Bar>
          </HStack>
        </HStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { LoopBars };

const Bar = styled(motion.div)`
  background: transparent;
  color: transparent;
`;
