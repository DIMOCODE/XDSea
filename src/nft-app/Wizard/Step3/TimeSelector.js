import React, { useState, useRef, useEffect } from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import sortIcon from "../../../images/sortIcon.svg";
import styled from "styled-components";

import { useClickAway } from "react-use";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

function SelectorItem(props) {
  return (
    <HStack
      onClick={props.onClick}
      whileHover={{ background: "white" }}
      height="36px"
      border="6px"
      cursor="pointer"
    >
      <BodyMedium cursor="pointer"> {props.name} </BodyMedium>
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
    hideSelector();
  });

  const [selectedValue, setSelectedValue] = useState("HOUR");

  const handleSelect = (value) => {
    setSelectedValue(value);
    hideSelector();
  };

  const hideSelector = () => {
    setIsActive(false);
  };

  return (
    <VStack
      border="9px"
      bordersize="2px"
      whileHover={{ borderColor: "#1f42f8" }}
      background={({ theme }) => theme.faded30}
      width="100%"
      onClick={handleActive}
    >
      <BodyMedium>{selectedValue}</BodyMedium>
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
              <SelectorItem
                name="HOUR"
                onClick={() => handleSelect("HOUR")}
              ></SelectorItem>
              <SelectorItem
                name="DAY"
                onClick={() => handleSelect("DAY")}
              ></SelectorItem>
              <SelectorItem
                name="WEEK"
                onClick={() => handleSelect("WEEK")}
              ></SelectorItem>
              <SelectorItem
                name="MONTH"
                onClick={() => handleSelect("MONTH")}
              ></SelectorItem>
              <SelectorItem
                name="YEAR"
                onClick={() => handleSelect("YEAR")}
              ></SelectorItem>
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
