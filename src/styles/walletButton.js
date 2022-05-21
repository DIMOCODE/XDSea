import React, { useState } from "react";
import { HStack, IconImg, VStack, ZItem, ZStack } from "./Stacks";
import XDClogo from "../images/miniXdcLogo.png";
import copyIcon from "../images/copyIcon.png";
import disconnect from "../images/disconnect.png";
import styled from "styled-components";
import { BodyBold, BodyRegular, CaptionRegular } from "./TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import ButtonApp from "./Buttons";
import { LayoutGroup } from "framer-motion/dist/framer-motion";

function WalletButton(props) {
  const { status, wallet, logout } = props;
  const [isVisible, setIsVisible] = useState(false);
  const opacityAnim = {
    initial: {
      opacity: 1,
    },
    hover: {
      opacity: 0.3,
    },
  };
  const connectedWallet = {
    initial: {
      x: 10,
      opacity: 0,
    },
    hover: {
      x: 0,
      opacity: 1,
    },
  };
  const tooltipAnim = {
    initial: {
      opacity: 0,
      y: -9,
      rotateX: 80,
      scale: 0.96,
      transition: { type: "spring", stiffness: 100, delay: 0 },
    },
    hover: {
      opacity: 1,
      y: 10,
      rotateX: 0,
      scale: 1,
    },
  };

  const truncateAddress = (address) => {
    return address.substring(0, 7) + "..." + address.substring(38);
  };

  return (
    <LayoutGroup id="WalletButton">
      <AnimatePresence>
        <VStack
          maxwidth="180px"
          onClick={props.onClick}
          onTap={() => setIsVisible(true)}
          onHoverEnd={() => setIsVisible(false)}
          cursor={"pointer"}
        >
          <HStack
            height="49px"
            background={({ theme }) => theme.walletButton}
            border="9px"
            spacing="9px"
            padding="0px 12px"
            cursor="pointer"
          >
            <VStack minwidth="94px" spacing="0px" alignment="flex-start">
              {status ? (
                <>
                  <HStack
                    key="Connected"
                    variants={connectedWallet}
                    initial="initial"
                    animate="hover"
                    exit="initial"
                    justify="flex-start"
                    spacing="6px"
                    cursor={"pointer"}
                  >
                    <LedStatus
                      key="led"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.9,
                      }}
                    ></LedStatus>
                    <CaptionRegular textcolor={({ theme }) => theme.walletText}>
                      Connected
                    </CaptionRegular>
                  </HStack>
                  <ZStack key="Wallet" height="20px">
                    {isVisible && (
                      <ZItem>
                        <OptionsTooltip>
                          <VStack
                            key="ToolTip"
                            variants={tooltipAnim}
                            initial="initial"
                            animate="hover"
                            exit="initial"
                            alignment="flex-end"
                            spacing="6px"
                          >
                            <HStack
                              background={({ theme }) => theme.walletButton}
                              padding="9px 12px"
                              border="6px"
                            >
                              <BodyRegular
                                textcolor={({ theme }) => theme.walletText}
                              >
                                {wallet?.address}
                              </BodyRegular>
                              <IconImg
                                url={copyIcon}
                                width="18px"
                                height="18px"
                                cursor={"pointer"}
                                onClick={() => {navigator.clipboard.writeText(wallet?.address)}}
                              ></IconImg>
                            </HStack>
                            <ButtonApp
                              cursor="pointer"
                              height="39px"
                              width="171px"
                              text="Disconnect"
                              textcolor="white"
                              background={({ theme }) => theme.blue}
                              icon={disconnect}
                              iconWidth="18px"
                              iconHeight="18px"
                              onClick={logout}
                              btnStatus={0}
                            ></ButtonApp>
                          </VStack>
                        </OptionsTooltip>
                      </ZItem>
                    )}
                    <ZItem
                      key="TruncatedText"
                      animate={isVisible ? "hover" : "initial"}
                      variants={opacityAnim}
                      exit="initial"
                      cursor={"pointer"}
                    >
                      <BodyRegular textcolor={({ theme }) => theme.walletText}>
                        {truncateAddress(wallet?.address)}
                      </BodyRegular>
                    </ZItem>
                  </ZStack>
                </>
              ) : (
                <motion.div
                  key="Disconnected"
                  variants={connectedWallet}
                  initial="initial"
                  animate="hover"
                  exit="initial"
                >
                  <CaptionRegular textcolor={({ theme }) => theme.walletText}>
                    Connect
                  </CaptionRegular>
                  <BodyBold textcolor={({ theme }) => theme.walletText}>
                    XDC Wallet
                  </BodyBold>
                </motion.div>
              )}
            </VStack>
            <IconImg cursor={"pointer"} url={XDClogo} width="30px" height="30px"></IconImg>
          </HStack>
        </VStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { WalletButton };

const OptionsTooltip = styled(motion.div)`
  position: absolute;
  top: 21px;
  right: -51px;
`;

const LedStatus = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: #08ec3a;
`;
