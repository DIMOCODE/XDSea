import React from "react";
import { HStack, IconImg } from "../Stacks";
import { BodyBold } from "../TextStyles";
import menuIcon from "../../images/menuIcon.png";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

function MobileMenu(props) {
  const { name, onClick, icon, position } = props;
  return (
    <HStack width="100%" style={{ position: "absolute", bottom: position }}>
      <HStack
        background={({ theme }) => theme.blackLinear}
        spacing="9px"
        padding="0 15px"
        height="42px"
        border="42px"
        self="none"
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
      >
        <IconImg url={icon} width="15px" height="15px"></IconImg>
        <BodyBold textcolor="white">{name || "Menu Name"}</BodyBold>
      </HStack>
    </HStack>
  );
}

export { MobileMenu };
