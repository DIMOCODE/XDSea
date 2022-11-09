import React from "react";
import { useState } from "react";
import { HStack, VStack, IconImg, Spacer } from "../Stacks";
import { TitleBold15 } from "../TextStyles";
import arrow from "../../images/arrowDown.png";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";

function CustomSelector() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <HStack
      background={({ theme }) => theme.faded}
      height="52px"
      border="6px"
      padding="0 21px"
      width="100%"
      cursor={"pointer"}
      onClick={() => setIsSelected(!isSelected)}
    >
      <TitleBold15 cursor={"pointer"}>Days</TitleBold15>
      <Spacer></Spacer>
      <IconImg
        cursor={"pointer"}
        url={arrow}
        width="15px"
        height="15px"
      ></IconImg>
      {isSelected && (
        <MenuSelector>
          <VStack
            background={({ theme }) => theme.backElement}
            padding="12px"
            border="6px"
            width="100%"
          >
            <HStack
              width="100%"
              height="52px"
              onClick={() => setIsSelected(false)}
              cursor={"pointer"}
              background={({ theme }) => theme.faded}
              border="6px"
            >
              <TitleBold15 cursor={"pointer"}>Option</TitleBold15>{" "}
            </HStack>
          </VStack>
        </MenuSelector>
      )}
    </HStack>
  );
}

export { CustomSelector };

const MenuSelector = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: -82px;
`;
