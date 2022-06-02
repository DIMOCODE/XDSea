import React from "react";
import { HStack, VStack } from "./Stacks";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";

function LoadingSpot(props) {
  const { width } = props;
  return (
    <LayoutGroup id="LoadingSpot">
      <AnimatePresence>
        <HStack
          border="12px"
          padding="18px"
          width={width}
          spacing="12px"
          background="rgba(153, 162, 175, 0.12)"
        >
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
          <VStack spacing="6px" maxheight="66px" alignment="flex-start">
            <TitleLoading
              key="Collection"
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
              key="elements"
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
        </HStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { LoadingSpot };

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
  width: 261px;
  height: 26px;
  border-radius: 6px;
  background: rgba(153, 162, 175, 0.21);
`;
