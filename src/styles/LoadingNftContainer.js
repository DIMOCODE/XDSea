import React from "react";
import { HStack, IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import loaderLogo from "../images/logoLoading.png";
import curvedText from "../images/curvedText.png";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import { LoopLogo } from "./LoopLogo";

function LoadingNftContainer() {
  return (
    <VStack
      overflow="hidden"
      border="27px"
      background="rgba(153, 162, 175, 0.12)"
      spacing="0"
      width="100%"
      height="450px"
    >
      <LoopLogo></LoopLogo>
    </VStack>
  );
}

export { LoadingNftContainer };
