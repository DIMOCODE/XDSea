import React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { IconImg, VStack } from "./Stacks";

function CircleButton(props) {
  const { image, onClick } = props;

  return (
    <VStack
      maxwidth="48px"
      height="48px"
      border="48px"
      background={({ theme }) => theme.faded}
      cursor="pointer"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      blur="30px"
    >
      <IconImg
        url={image}
        width="21px"
        height="21px"
        cursor="pointer"
      ></IconImg>
    </VStack>
  );
}

export { CircleButton };
