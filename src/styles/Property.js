import React from "react";
import { VStack, IconImg } from "./Stacks";
import { BodyBold, CaptionBoldShort, CaptionRegular } from "./TextStyles";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import gold from "../images/gold.png";
import silver from "../images/silver.png";
import copper from "../images/cupper.png";

function Property(props) {
  const { Title, Property, Rarity, width } = props;

  return (
    <VStack
      background={({ theme }) => theme.backElement}
      border="9px"
      // minwidth="160px"
      // maxwidth="160px"
      maxwidth={width}
      minwidth={width}
      height="120px"
      spacing="6px"
    >
      <RarityIcon>
        <IconImg
          url={
            Rarity <= 5.0
              ? gold
              : Rarity <= 10.0
              ? silver
              : Rarity <= 25.0
              ? copper
              : null
          }
          width="18px"
          height="18px"
        ></IconImg>
      </RarityIcon>
      <CaptionBoldShort align="center" textcolor={({ theme }) => theme.blue}>
        {Title || "Title"}
      </CaptionBoldShort>
      <BodyBold align="center">{Property || "Property"}</BodyBold>
      <CaptionRegular align="center">
        {Rarity || "Rarity"}% have this trait.
      </CaptionRegular>
    </VStack>
  );
}

export { Property };

const RarityIcon = styled(motion.div)`
  position: absolute;
  right: 9px;
  top: 9px;
`;
