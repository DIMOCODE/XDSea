import React, { useState, useRef } from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import sortIcon from "../../../images/sortIcon.svg";
import styled from "styled-components";

import { useClickAway } from "react-use";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

function SelectorItem(props) {
  return (
    <HStack whileHover={{ background: "white" }} height="36px" border="6px">
      <BodyMedium> {props.name} </BodyMedium>
    </HStack>
  );
}

function TimeSelector() {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const handleActive = () => {
    setIsActive(true);
  };

  useClickAway(ref, () => {
    setIsActive(false);
  });

  return (
    <VStack
      border="9px"
      bordersize="2px"
      whileHover={{ borderColor: "#1f42f8" }}
      background={({ theme }) => theme.faded30}
      width="100%"
      onClick={handleActive}
    >
      <BodyMedium>HOUR</BodyMedium>
      <IconImg
        url={sortIcon}
        width="21px"
        height="21px"
        style={{ position: "absolute", top: "14px", right: "12px" }}
      ></IconImg>

      <AnimatePresence>
        {isActive && (
          <Selector
            key="selector"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <VStack
              ref={ref}
              background="#E5E5E5"
              width="100%"
              padding="12px"
              border="9px"
              spacing="0px"
              style={{
                boxShadow: " 0px 11px 12px 0px rgba(0, 0, 0, 0.1)",
              }}
            >
              <SelectorItem name="HOUR"></SelectorItem>
              <SelectorItem name="DAY"></SelectorItem>
              <SelectorItem name="WEEK"></SelectorItem>
              <SelectorItem name="MONTH"></SelectorItem>
              <SelectorItem name="YEAR"></SelectorItem>
            </VStack>
          </Selector>
        )}
      </AnimatePresence>
    </VStack>
  );
}

export { TimeSelector };

const Selector = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: 1px;
`;
