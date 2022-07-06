import React from "react";
import {
  HStack,
  IconImg,
  VStack,
} from "./styles/Stacks";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import ButtonApp from "./styles/Buttons";
import { appStyle } from "./styles/AppStyles";
import useWindowSize from "./styles/useWindowSize";

function ModalAds(props) {
  const { onClick, onClickCancel, imageAd } = props;

  const size = useWindowSize();

  return (
    <FixedScreen>
      <VStack
        border="15px"
        maxwidth={size.width < 768 ? "360px" : "510px"}
        height={size.width < 768 ? "360px" : "510px"}
      >
        <IconImg
          url={imageAd}
          width={size.width < 768 ? "360px" : "510px"}
          height={size.width < 768 ? "360px" : "510px"}
          border="15px"
        ></IconImg>
        <HStack>
          <ButtonApp
            width="150px"
            text="Close"
            textcolor={({ theme }) => theme.text}
            background={({ theme }) => theme.backElement}
            height="39px"
            onClick={onClickCancel}
            btnStatus={0}
          ></ButtonApp>
          <ButtonApp
            width="150px"
            text="View NFT"
            textcolor={appStyle.colors.white}
            height="39px"
            onClick={onClick}
            btnStatus={0}
          ></ButtonApp>
        </HStack>
      </VStack>
    </FixedScreen>
  );
}

export { ModalAds };

const FixedScreen = styled(motion.div)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.backgroundModal};
  width: 100%;
  height: 100%;
  z-index: 10;
`;
