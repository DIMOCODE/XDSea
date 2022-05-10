import React from "react";
import ButtonApp from "./styles/Buttons";
import { HStack, IconImg, VStack } from "./styles/Stacks";
import { BodyRegular, TitleBold15 } from "./styles/TextStyles";
import warning from "./images/alert.png";
import { appStyle } from "./styles/AppStyles";
import { Fade } from "@mui/material";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";

function ConfirmationModal(props) {
  const { actionModal, cancel, confirm } = props;
  return (
    <FadedBack>
      <VStack
        background={appStyle.colors.darkgrey60}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.3,
        }}
      >
        <VStack
          width="300px"
          maxheight="210px"
          background={({ theme }) => theme.backElement}
          border="15px"
          padding="15px"
          initial={{ opacity: 0, scale: 0.9, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: "spring",
            bounce: 0.4,
          }}
        >
          <VStack maxheight="150px" background="clear">
            <IconImg url={warning} width="30px" height="30px"></IconImg>
            <BodyRegular align="center">
              Are you sure, do you want to {actionModal}
            </BodyRegular>
          </VStack>

          <HStack>
            <ButtonApp
              width="100%"
              background={appStyle.colors.darkgrey10}
              text="Cancel"
              onClick={cancel}
            ></ButtonApp>
            <ButtonApp
              textcolor={appStyle.colors.white}
              width="100%"
              text="Confirm"
              onClick={confirm}
            ></ButtonApp>
          </HStack>
        </VStack>
      </VStack>
    </FadedBack>
  );
}
export { ConfirmationModal };

const FadedBack = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 100;
`;
