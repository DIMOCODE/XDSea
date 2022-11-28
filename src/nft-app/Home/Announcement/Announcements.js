import React, { useState } from "react";
import useWindowSize from "../../../styles/useWindowSize";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import {
  HStack,
  IconImg,
  Separator,
  Spacer,
  VStack,
} from "../../../styles/Stacks";
import {
  BodyBold,
  BodyMedium,
  CaptionBoldShort,
  TitleBold18,
} from "../../../styles/TextStyles";
import speaker from "../../../images/speaker.png";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { TopBar } from "./TopBar";
import { Post } from "./Post";

function Announcements() {
  const size = useWindowSize();
  const [showModal, setShowModal] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.21,
      },
    },
  };

  const modal = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <HStack
        height="52px"
        background="#A6FF61"
        cursor="pointer"
        onClick={toggleModal}
      >
        <HStack width="1200px" cursor="pointer" padding="0 15px">
          <HStack spacing="6px" cursor="pointer">
            <IconImg
              url={speaker}
              width="15px"
              height="15px"
              backsize="cover"
              cursor="pointer"
            ></IconImg>
            {size.width > 440 && (
              <CaptionBoldShort cursor="pointer" textcolor="#193477">
                ANNOUNCEMENTS
              </CaptionBoldShort>
            )}
          </HStack>

          <HStack width="100%" cursor="pointer" whileTap={{ scale: 0.96 }}>
            {/* https://npm.io/package/react-fast-marquee */}
            <Marquee
              gradientColor={[166, 255, 97]}
              gradientWidth={90}
              speed={60}
            >
              <BodyBold cursor="pointer" textcolor="#193477">
                There is a new blockchain in our marketplace, welcome to Boba
                Network ❤️ click to know more ...
              </BodyBold>
            </Marquee>
          </HStack>
        </HStack>
      </HStack>
      <AnimatePresence>
        {showModal && (
          <Modal>
            <HStack
              background={({ theme }) => theme.faded60}
              width="100vw"
              height="100vh"
              key="main"
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              padding="69px 0 0 0"
            >
              <VStack
                maxwidth="600px"
                maxheight={size.width > 450 ? "690px" : "100%"}
                border="6px"
                background="#0D0C0C"
                justify="flex-start"
                overflowy="hidden"
                variants={modal}
                spacing="0"
              >
                <TopBar onClick={toggleModal}></TopBar>
                <VStack
                  overflowy="auto"
                  padding="0 0 60px 0"
                  justify="flex-start"
                >
                  <Post
                    date={"Published 10 mins ago"}
                    text="There is a new blockchain in our marketplace, welcome to Boba Network ❤️ Boba Network is a blockchain Layer-2 scaling solution and Hybrid Compute platform offering lightning fast transactions and fees up to 100x less than Layer-1."
                  ></Post>
                  <Separator></Separator>
                  <Post
                    date={"Published 10 mins ago"}
                    text="There is a new blockchain in our marketplace, welcome to Boba Network ❤️ Boba Network is a blockchain Layer-2 scaling solution and Hybrid Compute platform offering lightning fast transactions and fees up to 100x less than Layer-1."
                  ></Post>
                  <Separator></Separator>
                  <Post
                    date={"Published 10 mins ago"}
                    text="There is a new blockchain in our marketplace, welcome to Boba Network ❤️ Boba Network is a blockchain Layer-2 scaling solution and Hybrid Compute platform offering lightning fast transactions and fees up to 100x less than Layer-1."
                  ></Post>
                  <Separator></Separator>
                </VStack>
              </VStack>
            </HStack>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export { Announcements };

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  z-index: 1;
`;
