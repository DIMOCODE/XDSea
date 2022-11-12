import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import styled from "styled-components";
import {
  AnimatePresence,
  motion,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import mountain from "../../images/mountain.jpg";
import {
  BodyRegular,
  BodyBold,
  TitleBold18,
  TitleBold21,
} from "../../styles/TextStyles";
import { ButtonM } from "../../styles/Buttons/ButtonM.js";
import { EarningRate } from "../../nft-app/Staking/EarningRate.js";
import { PendingClaimed } from "../../nft-app/Staking/PendingClaimed.js";
import star from "../../images/starColor.png";
import useWindowSize from "../../styles/useWindowSize";
import { useClickAway } from "react-use";
import { useRef } from "react";

function StakeModal() {
  const size = useWindowSize();
  const ref = useRef(null);
  //   useClickAway(ref, () => setAddRemoveModal(false));

  return (
    <FixedModal>
      <HStack padding="60px 21px 0 21px " height="100%">
        <VStack
          background={({ theme }) => theme.backElement}
          maxwidth="600px"
          height="auto"
          padding="26px"
          border="6px"
          ref={ref}
        >
          <HStack responsive={true}>
            <VStack width="100%" alignment="center">
              <TitleBold18>NFT Name</TitleBold18>
              <IconImg
                url={mountain}
                width={size.width < 426 ? "180px" : "260px"}
                height={size.width < 426 ? "180px" : "260px"}
                border="6px"
                backsize="cover"
              ></IconImg>
            </VStack>

            <VStack width="100%" alignment="flex-start">
              <VStack spacing="9px" width="100%">
                <EarningRate onlyOneToken={false}></EarningRate>
                <PendingClaimed></PendingClaimed>
              </VStack>

              <HStack spacing="9px">
                {/* Close Button */}
                <ButtonM
                  height="42px"
                  background={({ theme }) => theme.fadedBlue}
                  title="Close"
                ></ButtonM>

                {/* Stake Button */}
                <HStack
                  background={({ theme }) => theme.blue}
                  width={"100%"}
                  border={"6px"}
                  height={"42px"}
                  cursor="pointer"
                  spacing="6px"
                  whileTap={{ scale: 0.96 }}
                >
                  <BodyRegular cursor="pointer" textcolor={"white"}>
                    Stake
                  </BodyRegular>
                  <IconImg url={star} width="15px" height="15px"></IconImg>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </FixedModal>
  );
}

export { StakeModal };

const FixedModal = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;
