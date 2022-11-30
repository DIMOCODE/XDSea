import React from "react";
import { VStack } from "./Stacks";
import { LoopLogo } from "./LoopLogo";
import { motion } from "framer-motion/dist/framer-motion";

function LoadingNftContainer(props) {
  const { scale } = props;

  return (
    <VStack
      overflow="hidden"
      border="9px"
      background="rgba(153, 162, 175, 0.12)"
      spacing="0"
      width="100%"
      height="100%"
    >
      <motion.div animate={{ scale: scale || 1 }}>
        <LoopLogo></LoopLogo>
      </motion.div>
    </VStack>
  );
}

export { LoadingNftContainer };
