import React from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import loaderLogo from "../images/logoLoading.png";
import curvedText from "../images/curveduploading.png";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";

function UploadLogo() {
  return (
    <LayoutGroup id="loopLogo">
      <AnimatePresence>
        <VStack>
          <LogoAnimation>
            <LogoXDSea>
              <IconImg
                key="logo"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.6 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1,
                  delay: 0.3,
                }}
                url={loaderLogo}
                width="90px"
                height="90px"
              ></IconImg>
            </LogoXDSea>
            <Spinner>
              <IconImg
                key="logo"
                initial={{ opacity: 1, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,

                  duration: 1,
                }}
                url={curvedText}
                width="138px"
                height="138px"
              ></IconImg>
            </Spinner>
          </LogoAnimation>
        </VStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { UploadLogo };

const LogoAnimation = styled(motion.div)`
  position: relative;

  height: 120px;
  width: 120px;
`;

const Spinner = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: -16px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
`;

const LogoXDSea = styled(motion.div)`
  position: absolute;
  top: 7px;

  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
`;
