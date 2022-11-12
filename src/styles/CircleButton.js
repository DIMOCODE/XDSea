import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { IconImg, VStack } from "./Stacks";

function CircleButton(props) {
  const { image, onClick, background } = props;

  return (
    <VStack
      maxwidth="42px"
      minwidth="42px"
      height="42px"
      border="48px"
      background={background}
      cursor="pointer"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      blur="30px"
    >
      <IconImg
        url={image}
        width="18px"
        height="18px"
        cursor="pointer"
      ></IconImg>
    </VStack>
  );
}

export { CircleButton };
