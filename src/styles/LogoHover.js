import React from "react";
import { useState } from "react";
import { VStack, IconImg } from "./Stacks";
import XuppiLogo from "./../images/LogoXDSEA.png";
import curvedText from "./../images/curvedBold.png";
import {
  motion,
} from "framer-motion/dist/framer-motion";
import styled from "styled-components";

function LogoHover() {
  const scaleContainer = {
    initial: {
      scale: 1,
      x: 0,
      y: 0,
    },

    hover: {
      scale: 1.2,
      x: 15,
      y: -21,
    },
  };

  const rotateText = {
    initial: {
      opacity: 0,
      rotate: -210,
      transition: { type: "spring", stiffness: 60 },
    },

    hover: {
      opacity: 0.8,
      rotate: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  const [isVisible, setIsVisible] = useState(false);

  return (
    <VStack
      width="150px"
      height="150px"
      animate={isVisible ? "hover" : "initial"}
      variants={scaleContainer}
      onHoverStart={() => setIsVisible((isVisible) => !isVisible)}
      onHoverEnd={() => setIsVisible((isVisible) => !isVisible)}
    >
      <CurvedText
        initial={false}
        key="CurvedText"
        variants={rotateText}
        animate={isVisible ? "hover" : "initial"}
        exit={{ opacity: 0 }}
      >
        <IconImg url={curvedText} width="150px" height="150px"></IconImg>
      </CurvedText>
      <IconImg url={XuppiLogo} width="110px" height="110px"></IconImg>
    </VStack>
  );
}

export { LogoHover };

const CurvedText = styled(motion.div)`
  position: absolute;

  width: 150px;
  height: 150px;
`;
