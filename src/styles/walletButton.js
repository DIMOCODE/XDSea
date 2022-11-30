import React, { useState } from "react";
import { useEffect } from "react";
import { HStack, IconImg, VStack } from "./Stacks";
import XDClogo from "../images/xdcpayLogo.png";
import Metamask from "../images/metamaskIcon.png";
import dcentLogo from "../images/dcent.png";
import walletIcon from "../images/wallet.png";
import styled from "styled-components";
import { BodyRegular, CaptionRegular, BodyMedium } from "./TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import { LayoutGroup } from "framer-motion/dist/framer-motion";

import { LogoutButton } from "./Buttons/LogoutButton";
import { WalletAddress } from "./Text/WalletAddress";

function WalletButton(props) {
  const {
    status,
    logout,
    walletAddress,
    isMetamask,
    isXdcPay,
    isMobile,
    clickAlert,
  } = props;

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

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => setShowAlert(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);

  return (
    <LayoutGroup id="WalletButton">
      <AnimatePresence>
        <VStack
          width="100%"
          onClick={!status ? clickAlert : () => {}}
          cursor={!status ? "pointer" : "default"}
          spacing="12px"
          padding={"0"}
        >
          <HStack
            height={"49px"}
            width={"100%"}
            background="linear-gradient(1.75deg, #11101C 54.32%, #302F43 86.61%, #504E66 99.83%)"
            border="6px"
            spacing="12px"
            alignment="flex-start"
            padding={"6px 12px"}
          >
            {/* The logo of the wallet used for connection */}
            {!status ? (
              <HStack alignment={"center"}>
                <IconImg
                  url={walletIcon}
                  width="26px"
                  height="26px"
                  onClick={clickAlert}
                ></IconImg>
              </HStack>
            ) : isMetamask ? (
              <HStack alignment={"center"}>
                <IconImg url={Metamask} width="26px" height="26px"></IconImg>
              </HStack>
            ) : isXdcPay ? (
              <HStack alignment={"center"}>
                <IconImg url={XDClogo} width="26px" height="26px"></IconImg>
              </HStack>
            ) : (
              <HStack alignment={"center"}>
                <IconImg url={dcentLogo} width="26px" height="26px"></IconImg>
              </HStack>
            )}

            <VStack alignment="center">
              {!status ? (
                <motion.div
                  key="Disconnected"
                  variants={connectedWallet}
                  initial="initial"
                  animate="hover"
                  exit="initial"
                >
                  <BodyMedium cursor="pointer" textcolor="white">
                    Connect your Wallet
                  </BodyMedium>
                </motion.div>
              ) : (
                <>
                  <HStack self="none">
                    <VStack spacing="0px" alignment="flex-start">
                      <HStack
                        key="Connected"
                        variants={connectedWallet}
                        initial="initial"
                        animate="hover"
                        exit="initial"
                        justify="flex-start"
                        spacing="6px"
                        width="100%"
                      >
                        <CaptionRegular
                          textcolor={({ theme }) => theme.walletText}
                        >
                          Connected
                        </CaptionRegular>
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
                      </HStack>

                      <WalletAddress
                        walletAddress={walletAddress}
                        width="100%"
                        isMobile={isMobile}
                      ></WalletAddress>
                    </VStack>

                    <LogoutButton onClick={logout}></LogoutButton>
                  </HStack>
                </>
              )}
            </VStack>
          </HStack>
        </VStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { WalletButton };

const LedStatus = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: #08ec3a;
`;
