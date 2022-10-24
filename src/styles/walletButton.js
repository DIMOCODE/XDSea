import React, { useState } from "react";
import { useEffect } from "react";
import { HStack, IconImg, VStack, ZItem, ZStack } from "./Stacks";
import XDClogo from "../images/xdcpayLogo.png";
import Metamask from "../images/metamaskIcon.png";
import copyIcon from "../images/copyIcon.png";
import checkIcon from "../images/checkOkIcon.png";
import infoIcon from "../images/infoIcon.png";
import disconnect from "../images/disconnect.png";
import dcentLogo from "../images/dcent.png";
import walletIcon from "../images/wallet.png";
import styled from "styled-components";
import {
  BodyBold,
  BodyRegular,
  CaptionRegular,
  CaptionBoldShort,
  BodyMedium,
} from "./TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import ButtonApp from "./Buttons";
import { LayoutGroup } from "framer-motion/dist/framer-motion";
import { fromXdc, isXdc, toXdc, truncateAddress } from "../common/common";
import { getXdcDomain } from "../constant";
import logoutIcon from "../images/shutdownWhite.png";

function WalletButton(props) {
  const {
    status,
    wallet,
    logout,
    walletAddress,
    isDomain,
    onClickMetamask,
    isMetamask,
    isXdcPay,
    isMobile,
    hasAlert,
    clickAlert,
    isDcent,
  } = props;

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

  const [showAlert, setShowAlert] = useState(false);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

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
          padding={isMobile ? "0 30px" : "0"}
        >
          <HStack
            height={"49px"}
            width={"100%"}
            background=" linear-gradient(1.75deg, #11101C 12.32%, #302F43 86.61%, #504E66 99.83%)"
            border="6px"
            spacing="9px"
            alignment="flex-start"
            padding={"6px 18px"}
          >
            {!status ? (
              <HStack spacing="6px">
                <IconImg
                  url={walletIcon}
                  width="26px"
                  height="26px"
                  onClick={clickAlert}
                ></IconImg>
              </HStack>
            ) : isMetamask ? (
              <HStack alignment={isMobile ? "flex-start" : "center"}>
                <IconImg
                  url={Metamask}
                  width="30px"
                  height="30px"
                ></IconImg>
              </HStack>
            ) : isXdcPay ? (
              <HStack alignment={isMobile ? "flex-start" : "center"}>
                <IconImg
                  url={XDClogo}
                  width="26px"
                  height="26px"
                ></IconImg>
              </HStack>
            ) : (
              <HStack alignment={isMobile ? "flex-start" : "center"}>
                <IconImg
                  url={dcentLogo}
                  width="26px"
                  height="26px"
                ></IconImg>
              </HStack>
            )}

            <VStack minwidth="0" spacing="0px" alignment="center">
              {status ? (
                <>
                  <HStack>
                    <VStack spacing="0px" alignment="flex-start">
                      <HStack
                        key="Connected"
                        variants={connectedWallet}
                        initial="initial"
                        animate="hover"
                        exit="initial"
                        justify="flex-start"
                        spacing="6px"
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

                      <BodyRegular textcolor={({ theme }) => theme.walletText}>
                        {isDomain
                          ? truncate(walletAddress, 10)
                          : truncateAddress(walletAddress)
                        }
                      </BodyRegular>
                    </VStack>
                    <HStack spacing="6px" cursor="pointer" onClick={logout}>
                      <CaptionBoldShort cursor="pointer" textcolor="white">
                        LOGOUT
                      </CaptionBoldShort>
                      <IconImg
                        url={logoutIcon}
                        width="21px"
                        height="21px"
                        cursor="pointer"
                      ></IconImg>
                    </HStack>
                  </HStack>
                </>
              ) : (
                <motion.div
                  key="Disconnected"
                  variants={connectedWallet}
                  initial="initial"
                  animate="hover"
                  exit="initial"
                >
                  <BodyMedium cursor="pointer" textcolor="white">Connect your Wallet</BodyMedium>
                </motion.div>
              )}
            </VStack>
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

const AlertStatus = styled(motion.div)`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 9px;
  height: 9px;
  border-radius: 6px;
  background: red;
`;
