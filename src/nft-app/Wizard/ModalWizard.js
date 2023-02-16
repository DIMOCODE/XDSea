import React from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyBold, BodyMedium } from "../../styles/TextStyles";
import { ActionButtons } from "./ActionButtons";
import styled from "styled-components";
import alert from "../../images/AlertState.gif";

function ModalWizard(props) {
  return (
    <AnimatePresence>
      <Modal>
        <HStack
          key="main"
          width="100%"
          height="100%"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.2 } }}
          transition={{ delay: 0.2 }}
          background={({ theme }) => theme.faded90}
        >
          <AnimatePresence>
            <VStack
              initial={{ y: "15%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "50%", opacity: 0, transition: { delay: 0 } }}
              transition={{ delay: 0.3 }}
              maxwidth="320px"
              height="auto"
              background="white"
              border="9px"
              padding="21px"
            >
              <IconImg url={alert} width="69px" height="69px"></IconImg>
              <BodyMedium align="center">
                Unsaved changes will be lost. OK to close, Cancel to stay.Are
                you sure you want to close the wizard?
              </BodyMedium>
              <ActionButtons
                grayBtn="Cancel"
                onClickGray={props.clickCancel}
                onClickBlue={props.clickOk}
                blueBtn="Close Wizard"
              ></ActionButtons>
            </VStack>
          </AnimatePresence>
        </HStack>
      </Modal>
    </AnimatePresence>
  );
}

export { ModalWizard };

const Modal = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
`;
