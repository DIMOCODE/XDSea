import React from "react";
import { VStack, IconImg } from "./Stacks";
import { BodyBold, CaptionBoldShort, CaptionRegular } from "./TextStyles";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";

function Property(props) {
  const { Title, Property, Rarity, rarityIcon } = props;
  
  return (
    <VStack
      background={({ theme }) => theme.backElement}
      border="9px"
      minwidth="160px"
      maxwidth="160px"
      height="120px"
      spacing="6px"
    >
      <RarityIcon>
        <IconImg url={rarityIcon} width="18px" height="18px"></IconImg>
      </RarityIcon>
      <CaptionBoldShort textcolor={({ theme }) => theme.blue}>
        {Title || "Title"}
      </CaptionBoldShort>
      <BodyBold>{Property || "Property"}</BodyBold>
      <CaptionRegular>{Rarity || "Rarity"}% have this trait.</CaptionRegular>
    </VStack>
  );
}

export { Property };

const RarityIcon = styled(motion.div)`
  position: absolute;
  right: 9px;
  top: 9px;
`;
