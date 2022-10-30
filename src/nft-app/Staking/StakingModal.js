import React from "react";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack, IconImg } from "../../styles/Stacks";
import { TitleBold18, TitleBold21 } from "../../styles/TextStyles";
import { EarningRate } from "./EarningRate";
import { PendingClaimed } from "./PendingClaimed";
import styled from "styled-components";
import jojo from "../../images/exampleJojo.png";
import useWindowSize from "../../styles/useWindowSize";

function StakingModal(props) {
  const size = useWindowSize();

  const { oneToken } = props;

  return (
    <Modal>
      <VStack>
        <HStack
          responsive="true"
          background={({ theme }) => theme.backElement}
          border="6px"
          padding="30px 21px"
          self="none"
          height={size.width > 423 ? "auto" : "100vh"}
          spacing="21px"
        >
          <VStack justify="flex-end">
            <IconImg
              url={jojo}
              width={size.width > 423 ? "390px" : "260px"}
              height={size.width > 423 ? "390px" : "260px"}
              border="9px"
            ></IconImg>
          </VStack>

          <VStack width="370px" spacing="21px">
            <TitleBold21 textcolor="black">SeriousJojo 003</TitleBold21>
            <EarningRate onlyOneToken={oneToken}></EarningRate>
            <PendingClaimed onlyOneToken={oneToken}></PendingClaimed>
            <HStack>
              <ButtonM
                background={({ theme }) => theme.faded30}
                title="Cancel"
              ></ButtonM>
              <ButtonM
                title="Claim"
                textcolor="white"
                background={({ theme }) => theme.blue}
              ></ButtonM>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </Modal>
  );
}

export { StakingModal };

const Modal = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  top: 0px;
  width: 100vw;
  height: 100vh;
`;
