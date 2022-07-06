import React from "react";
import { useState } from "react";
import {
  HStack,
  IconImg,
  Spacer,
  VStack,
  ZStack,
  ZItem,
} from "../../../styles/Stacks";
import styled from "styled-components";
import { BodyBold, BodyRegular, TitleBold18 } from "../../../styles/TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
// import check from "./Assets/check.png";
// import purchaise from "./Assets/purchaise.png";
// import imageNFT from "./Assets/imageNFT.png";
import ButtonApp from "../../../styles/Buttons";
import { appStyle } from "../../../styles/AppStyles";
import useWindowSize from "../../../styles/useWindowSize";

function ModalAds(props) {
  const { onClick, onClickCancel, imageAd } = props;

  const [isPurchaise, setIsPurchaise] = useState(false);
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
            textcolor={"#FAFAFA"}
            background={"#20222D"}
            height="39px"
            onClick={onClickCancel}
          ></ButtonApp>
          <ButtonApp
            width="150px"
            text="View NFT"
            textcolor={appStyle.colors.white}
            height="39px"
            onClick={onClick}
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
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 9999;
`;
