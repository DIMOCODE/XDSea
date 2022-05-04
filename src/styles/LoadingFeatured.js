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

function LoadingFeatured() {
  return (
    <LayoutGroup id="LoadingFeatured">
      <AnimatePresence>
        <ZStack>
          <ZItem>
            <VStack
              background="rgba(153, 162, 175, 0.09)"
              width="100%"
              padding="15px"
            >
              <HStack>
                <Spacer></Spacer>
                <UserLoading
                  key="user"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.6,
                  }}
                ></UserLoading>
              </HStack>
              <Spacer></Spacer>

              <VStack spacing="6px" maxheight="66px">
                <Spacer></Spacer>
                <TitleLoading
                  key="title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.6,
                    delay: 0.6,
                  }}
                ></TitleLoading>
                <SubtitleLoading
                  key="subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.6,
                    delay: 0.9,
                  }}
                ></SubtitleLoading>
              </VStack>
            </VStack>
          </ZItem>
          <ZItem>
            <LoopLogo></LoopLogo>
          </ZItem>
        </ZStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { LoadingFeatured };

const UserLoading = styled(motion.div)`
  width: 54px;
  height: 54px;
  border-radius: 120px;
  background: rgba(153, 162, 175, 0.21);
`;

const TitleLoading = styled(motion.div)`
  width: 150px;
  height: 26px;
  border-radius: 6px;
  background: rgba(153, 162, 175, 0.21);
`;

const SubtitleLoading = styled(motion.div)`
  width: 210px;
  height: 26px;
  border-radius: 6px;
  background: rgba(153, 162, 175, 0.21);
`;
