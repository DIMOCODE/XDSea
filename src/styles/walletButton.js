import React, { useState } from "react";
import { useEffect } from "react";
import { HStack, IconImg, VStack, ZItem, ZStack } from "./Stacks";
import XDClogo from "../images/xdcpayLogo.png";
import Metamask from "../images/metamaskIcon.png";
import copyIcon from "../images/copyIcon.png";
import checkIcon from "../images/checkOkIcon.png";
import disconnect from "../images/disconnect.png";
import styled from "styled-components";
import {
  BodyBold,
  BodyRegular,
  CaptionRegular,
  CaptionBoldShort,
} from "./TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import ButtonApp from "./Buttons";
import { LayoutGroup } from "framer-motion/dist/framer-motion";
import { fromXdc, isXdc } from "../common/common";

function WalletButton(props) {
  const { status, wallet, logout, onClickMetamask } = props;

  const [isMetamask, setIsMetamask] = useState(true);

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
  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => setShowAlert(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);

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
            <VStack minwidth="0" spacing="0px" alignment="flex-start">
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
                              onClick={() => setShowAlert(true)}
                              width="432px"
                            >
                              <BodyRegular
                                textcolor={({ theme }) => theme.walletText}
                              >
                                {isMetamask
                                  ? "Metamask Address"
                                  : showAlert
                                  ? "Address Copied"
                                  : isXdc(wallet?.address)
                                  ? fromXdc(wallet?.address)
                                  : wallet?.address}
                              </BodyRegular>
                              <IconImg
                                url={showAlert ? checkIcon : copyIcon}
                                width="18px"
                                height="18px"
                                cursor={"pointer"}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    isXdc(wallet?.address)
                                      ? fromXdc(wallet?.address)
                                      : wallet?.address
                                  );
                                }}
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
                        {isMetamask
                          ? "Metahs7shsdjhd"
                          : truncateAddress(
                              isXdc(wallet?.address)
                                ? fromXdc(wallet?.address)
                                : wallet?.address
                            )}
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
                  <CaptionRegular
                    animate={{ opacity: 0.3 }}
                    textcolor={({ theme }) => theme.walletText}
                  >
                    Connect
                  </CaptionRegular>
                  <CaptionBoldShort textcolor={({ theme }) => theme.walletText}>
                    Wallet
                  </CaptionBoldShort>
                </motion.div>
              )}
            </VStack>

            {!status ? (
              <>
                <a>
                  <IconImg
                    cursor={"pointer"}
                    url={XDClogo}
                    width="26px"
                    height="26px"
                  ></IconImg>
                </a>

                <a>
                  <IconImg
                    cursor={"pointer"}
                    url={Metamask}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </>
            ) : isMetamask ? (
              <a>
                <IconImg
                  cursor={"pointer"}
                  url={Metamask}
                  width="30px"
                  height="30px"
                  onClick={onClickMetamask}
                ></IconImg>
              </a>
            ) : (
              <a>
                <IconImg
                  cursor={"pointer"}
                  url={XDClogo}
                  width="26px"
                  height="26px"
                ></IconImg>
              </a>
            )}
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
