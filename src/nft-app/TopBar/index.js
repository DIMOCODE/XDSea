import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { XdcConnect, Disconnect } from "xdc-connect";
import {
  HStack,
  IconImg,
  Spacer,
  VStack,
  ZItem,
  ZStack,
} from "../../styles/Stacks";
import ButtonApp from "../../styles/Buttons";
import { BodyBold, CaptionRegular, TitleBold21 } from "../../styles/TextStyles";
import XDSealogo from "../../images/LogoXDSEA.png";
import { WalletButton } from "../../styles/walletButton";
import { fromXdc, isXdc } from "../../common/common";
import { SwitchButton } from "../../styles/SwitchButton";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { UserMenuButton } from "./UserMenuButton";
import { appStyle } from "../../styles/AppStyles";
import "../../styles/App.css";

import twitter from "../../images/twitterFaded.png";
import instagram from "../../images/instagramFaded.png";
import mail from "../../images/mailFaded.png";
import menuContext from "../../context/menuContext";

function TopBar(props) {
  const { device, themeToggler, devMode, onWalletChange } = props;
  const history = useHistory();
  const [wallet, setWallet] = useState({});
  const [deviceSize, setDeviceSize] = useState("");
  const [showMenu, setShowMenu] = useContext(menuContext);
  const menucolor = ({ theme }) => theme.menu;

  useEffect(() => {
    setDeviceSize(device);
    return () => {
      setShowMenu({});
    };
  }, [device]);

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  const variant1 = {
    open: { rotate: 0, y: 0 },
    closed: { rotate: 45, y: 6 },
  };

  const variant2 = {
    open: { rotate: 0, y: 0 },
    closed: { rotate: -45, y: -6 },
  };

  return (
    <ContentBar>
      <HStack height="90px" width="100%" justify="center">
        {(() => {
          switch (deviceSize) {
            case "phone":
              return (
                <AnimatePresence>
                  {showMenu && (
                    <SlideMenu
                      key="slidemenu"
                      initial={{ opacity: 1, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ type: "spring", damping: 10 }}
                    >
                      <VStack
                        background={({ theme }) => theme.backElement}
                        width="375px"
                        padding="60px 30px"
                        height="360px"
                        border="0 0 15px 15px"
                      >
                        {/* <HStack background="pink">
                        <IconImg
                          url={XDSealogo}
                          width="66px"
                          height="66px"
                          cursor={"pointer"}
                        ></IconImg>
                        <Spacer></Spacer>
                      </HStack> */}

                        <VStack
                          alignment="flex-start"
                          width="180px"
                          spacing="21px"
                        >
                          <TitleBold21
                            onClick={() => NavigateTo("")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Home
                          </TitleBold21>
                          <TitleBold21
                            onClick={() => NavigateTo("Discover")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Discover
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => NavigateTo("HowToStart")}
                          >
                            How to Start
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => NavigateTo("CreateNFT")}
                          >
                            Create an NFT
                          </TitleBold21>
                        </VStack>

                        <VStack>
                          <Connect>
                            <XdcConnect
                              btnClass={`walletConnect ${
                                wallet?.connected ? "hide" : ""
                              }`}
                              onConnect={(wallet) => {
                                setWallet(wallet);
                                onWalletChange(wallet);
                              }}
                              onAddressChange={(wallet) => {
                                setWallet(wallet);
                                onWalletChange(wallet);
                              }}
                              onDisconnect={(wallet) => {
                                setWallet(wallet);
                                onWalletChange(wallet);
                              }}
                            />
                          </Connect>

                          <WalletButton
                            logout={Disconnect}
                            status={wallet?.connected}
                            wallet={wallet}
                          ></WalletButton>
                        </VStack>

                        <HStack>
                          <SwitchButton
                            clickOnSwitch={themeToggler}
                          ></SwitchButton>
                          {wallet?.connected ? (
                            <UserMenuButton
                              clickOnUser={() =>
                                NavigateTo(
                                  `UserProfile/${
                                    isXdc(wallet?.address)
                                      ? fromXdc(wallet?.address)
                                      : wallet?.address
                                  }`
                                )
                              }
                              wallet={wallet}
                            ></UserMenuButton>
                          ) : null}

                          <a href="https://www.instagram.com/xdsea.nft/">
                            <IconImg
                              url={instagram}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                          <a href="https://twitter.com/XDSeaNFT">
                            <IconImg
                              url={twitter}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                          <a href="mailto:support@xdsea.com">
                            <IconImg
                              url={mail}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                        </HStack>
                      </VStack>
                    </SlideMenu>
                  )}
                  <HStack
                    width="100%"
                    padding="0 26px"
                    style={{ position: "relative" }}
                  >
                    <HStack onClick={() => NavigateTo("")} cursor={"pointer"}>
                      <IconImg
                        url={XDSealogo}
                        width="52px"
                        height="52px"
                        cursor={"pointer"}
                      ></IconImg>
                      <VStack
                        cursor={"pointer"}
                        spacing="1px"
                        alignment="flex-start"
                      >
                        <BodyBold textcolor={({ theme }) => theme.text}>
                          XDSea
                        </BodyBold>
                        {!devMode ? (
                          <BodyBold textcolor={({ theme }) => theme.blue}>
                            βeta v1.6.1
                          </BodyBold>
                        ) : (
                          <HStack
                            background="linear-gradient(180deg, #044DC4 0%, #192EA6 100%)"
                            border="6px"
                            padding="3px 6px"
                            cursor={"pointer"}
                          >
                            <CaptionRegular textcolor={appStyle.colors.white}>
                              Developer
                            </CaptionRegular>
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                    <Spacer></Spacer>

                    <VStack
                      maxwidth="46px"
                      height="46px"
                      border="12px"
                      background={({ theme }) => theme.faded}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu((prevCheck) => !prevCheck)}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="-2 0 26 26"
                        fill={"#5C6976"}
                        // fill={({ theme }) => theme.menubars}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <motion.path
                          animate={showMenu ? "open" : "closed"}
                          variants={variant1}
                          d="M2.16108 19.8381C1.18477 18.8618 1.18477 17.2789 2.16108 16.3025L16.3032 2.16041C17.2795 1.1841 18.8624 1.1841 19.8387 2.16041V2.16041C20.8151 3.13672 20.8151 4.71963 19.8387 5.69594L5.69661 19.8381C4.7203 20.8144 3.13739 20.8144 2.16108 19.8381V19.8381Z"
                        />
                        <motion.path
                          animate={showMenu ? "open" : "closed"}
                          variants={variant2}
                          d="M2.16143 2.16035C3.13774 1.18403 4.72066 1.18403 5.69697 2.16035L19.8391 16.3025C20.8154 17.2788 20.8154 18.8617 19.8391 19.838V19.838C18.8628 20.8143 17.2799 20.8143 16.3036 19.838L2.16143 5.69588C1.18512 4.71957 1.18512 3.13666 2.16143 2.16035V2.16035Z"
                        />
                      </svg>

                      {/* <svg
                        width="26"
                        height="16"
                        viewBox="0 0 26 16"
                        fill={({ theme }) => theme.menubars}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <motion.path
                          animate={{ rotate: 45 }}
                          d="M0.5 2.5C0.5 1.11929 1.61929 0 3 0H23C24.3807 0 25.5 1.11929 25.5 2.5V2.5C25.5 3.88071 24.3807 5 23 5H3C1.61929 5 0.5 3.88071 0.5 2.5V2.5Z"
                          fill={({ theme }) => theme.menubars}
                        />
                        <motion.path
                          d="M0.5 13.5C0.5 12.1193 1.61929 11 3 11H23C24.3807 11 25.5 12.1193 25.5 13.5V13.5C25.5 14.8807 24.3807 16 23 16H3C1.61929 16 0.5 14.8807 0.5 13.5V13.5Z"
                          fill={({ theme }) => theme.menubars}
                        />
                      </svg> */}
                    </VStack>
                  </HStack>
                </AnimatePresence>
              );
            case "tablet":
              return (
                <AnimatePresence>
                  {showMenu && (
                    <SlideMenuTablet
                      key="slidemenu"
                      initial={{ opacity: 1, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ type: "spring", damping: 10 }}
                    >
                      <VStack
                        background={({ theme }) => theme.backElement}
                        width="300px"
                        padding="60px 30px"
                        height="300px"
                        border="0 0 15px 15px"
                      >
                        {/* <HStack background="pink">
                    <IconImg
                      url={XDSealogo}
                      width="66px"
                      height="66px"
                      cursor={"pointer"}
                    ></IconImg>
                    <Spacer></Spacer>
                  </HStack> */}

                        <VStack
                          alignment="flex-end"
                          width="180px"
                          spacing="21px"
                        >
                          <TitleBold21
                            onClick={() => NavigateTo("")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Home
                          </TitleBold21>
                          <TitleBold21
                            onClick={() => NavigateTo("Discover")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Discover
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => NavigateTo("HowToStart")}
                          >
                            How to Start
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => NavigateTo("CreateNFT")}
                          >
                            Create an NFT
                          </TitleBold21>
                        </VStack>

                        <HStack>
                          <a href="https://www.instagram.com/xdsea.nft/">
                            <IconImg
                              url={instagram}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                          <a href="https://twitter.com/XDSeaNFT">
                            <IconImg
                              url={twitter}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                          <a href="mailto:support@xdsea.com">
                            <IconImg
                              url={mail}
                              width="49px"
                              height="49px"
                              cursor="pointer"
                            ></IconImg>
                          </a>
                        </HStack>
                      </VStack>
                    </SlideMenuTablet>
                  )}
                  <HStack
                    width="100%"
                    padding="0 26px"
                    style={{ position: "relative" }}
                  >
                    <HStack onClick={() => NavigateTo("")} cursor={"pointer"}>
                      <IconImg
                        url={XDSealogo}
                        width="52px"
                        height="52px"
                        cursor={"pointer"}
                      ></IconImg>
                      <VStack
                        cursor={"pointer"}
                        spacing="1px"
                        alignment="flex-start"
                      >
                        <BodyBold textcolor={({ theme }) => theme.text}>
                          XDSea
                        </BodyBold>
                        {!devMode ? (
                          <BodyBold textcolor={({ theme }) => theme.blue}>
                            βeta v1.6.0
                          </BodyBold>
                        ) : (
                          <HStack
                            background="linear-gradient(180deg, #044DC4 0%, #192EA6 100%)"
                            border="6px"
                            padding="3px 6px"
                            cursor={"pointer"}
                          >
                            <CaptionRegular textcolor={appStyle.colors.white}>
                              Developer
                            </CaptionRegular>
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                    <Spacer></Spacer>

                    <VStack maxwidth="156px">
                      <Connect>
                        <XdcConnect
                          btnClass={`walletConnect ${
                            wallet?.connected ? "hide" : ""
                          }`}
                          onConnect={(wallet) => {
                            setWallet(wallet);
                            onWalletChange(wallet);
                          }}
                          onAddressChange={(wallet) => {
                            setWallet(wallet);
                            onWalletChange(wallet);
                          }}
                          onDisconnect={(wallet) => {
                            setWallet(wallet);
                            onWalletChange(wallet);
                          }}
                        />
                      </Connect>

                      <WalletButton
                        logout={Disconnect}
                        status={wallet?.connected}
                        wallet={wallet}
                      ></WalletButton>
                    </VStack>

                    <SwitchButton clickOnSwitch={themeToggler}></SwitchButton>
                    {wallet?.connected ? (
                      <UserMenuButton
                        clickOnUser={() =>
                          NavigateTo(
                            `UserProfile/${
                              isXdc(wallet?.address)
                                ? fromXdc(wallet?.address)
                                : wallet?.address
                            }`
                          )
                        }
                        wallet={wallet}
                      ></UserMenuButton>
                    ) : null}

                    <VStack
                      maxwidth="46px"
                      height="46px"
                      border="12px"
                      background={({ theme }) => theme.faded}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu((prevCheck) => !prevCheck)}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="-2 0 26 26"
                        fill={"#5C6976"}
                        // fill={({ theme }) => theme.menubars}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <motion.path
                          animate={showMenu ? "open" : "closed"}
                          variants={variant1}
                          d="M2.16108 19.8381C1.18477 18.8618 1.18477 17.2789 2.16108 16.3025L16.3032 2.16041C17.2795 1.1841 18.8624 1.1841 19.8387 2.16041V2.16041C20.8151 3.13672 20.8151 4.71963 19.8387 5.69594L5.69661 19.8381C4.7203 20.8144 3.13739 20.8144 2.16108 19.8381V19.8381Z"
                        />
                        <motion.path
                          animate={showMenu ? "open" : "closed"}
                          variants={variant2}
                          d="M2.16143 2.16035C3.13774 1.18403 4.72066 1.18403 5.69697 2.16035L19.8391 16.3025C20.8154 17.2788 20.8154 18.8617 19.8391 19.838V19.838C18.8628 20.8143 17.2799 20.8143 16.3036 19.838L2.16143 5.69588C1.18512 4.71957 1.18512 3.13666 2.16143 2.16035V2.16035Z"
                        />
                      </svg>

                      {/* <svg
                    width="26"
                    height="16"
                    viewBox="0 0 26 16"
                    fill={({ theme }) => theme.menubars}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      animate={{ rotate: 45 }}
                      d="M0.5 2.5C0.5 1.11929 1.61929 0 3 0H23C24.3807 0 25.5 1.11929 25.5 2.5V2.5C25.5 3.88071 24.3807 5 23 5H3C1.61929 5 0.5 3.88071 0.5 2.5V2.5Z"
                      fill={({ theme }) => theme.menubars}
                    />
                    <motion.path
                      d="M0.5 13.5C0.5 12.1193 1.61929 11 3 11H23C24.3807 11 25.5 12.1193 25.5 13.5V13.5C25.5 14.8807 24.3807 16 23 16H3C1.61929 16 0.5 14.8807 0.5 13.5V13.5Z"
                      fill={({ theme }) => theme.menubars}
                    />
                  </svg> */}
                    </VStack>
                  </HStack>
                </AnimatePresence>
              );
            case "computer":
              return (
                <>
                  <HStack width="1200px">
                    <HStack onClick={() => NavigateTo("")} cursor={"pointer"}>
                      <IconImg
                        url={XDSealogo}
                        width="66px"
                        height="66px"
                        cursor={"pointer"}
                      ></IconImg>
                      <VStack
                        cursor={"pointer"}
                        spacing="1px"
                        alignment="flex-start"
                      >
                        <BodyBold textcolor={({ theme }) => theme.text}>
                          XDSea
                        </BodyBold>
                        {!devMode ? (
                          <BodyBold textcolor={({ theme }) => theme.blue}>
                            βeta v1.6.1
                          </BodyBold>
                        ) : (
                          <HStack
                            background="linear-gradient(180deg, #044DC4 0%, #192EA6 100%)"
                            border="6px"
                            padding="3px 6px"
                            cursor={"pointer"}
                          >
                            <CaptionRegular textcolor={appStyle.colors.white}>
                              Developer
                            </CaptionRegular>
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                    <Spacer></Spacer>
                    <ButtonApp
                      background="rgba(255, 255, 255, 0)"
                      textcolor={({ theme }) => theme.text}
                      text="Home"
                      cursor="pointer"
                      onClick={() => NavigateTo("")}
                      btnStatus={0}
                    ></ButtonApp>
                    <ButtonApp
                      background="rgba(255, 255, 255, 0)"
                      textcolor={({ theme }) => theme.text}
                      text="Discover"
                      cursor="pointer"
                      onClick={() => NavigateTo("Discover")}
                      btnStatus={0}
                    ></ButtonApp>
                    <ButtonApp
                      background="rgba(255, 255, 255, 0)"
                      textcolor={({ theme }) => theme.text}
                      text="How To Start"
                      cursor="pointer"
                      onClick={() => NavigateTo("HowToStart")}
                      btnStatus={0}
                    ></ButtonApp>
                    <ButtonApp
                      background="rgba(255, 255, 255, 0)"
                      textcolor={({ theme }) => theme.blue}
                      text="Create an NFT"
                      cursor="pointer"
                      onClick={() => NavigateTo("CreateNFT")}
                      btnStatus={0}
                    ></ButtonApp>
                    <Spacer></Spacer>
                    <XdcConnect
                      btnClass={`walletConnect ${
                        wallet?.connected ? "hide" : ""
                      }`}
                      onConnect={(wallet) => {
                        setWallet(wallet);
                        onWalletChange(wallet);
                      }}
                      onAddressChange={(wallet) => {
                        setWallet(wallet);
                        onWalletChange(wallet);
                      }}
                      onDisconnect={(wallet) => {
                        setWallet(wallet);
                        onWalletChange(wallet);
                      }}
                    />

                    <WalletButton
                      logout={Disconnect}
                      status={wallet?.connected}
                      wallet={wallet}
                    ></WalletButton>

                    <SwitchButton clickOnSwitch={themeToggler}></SwitchButton>
                    {wallet?.connected ? (
                      <UserMenuButton
                        clickOnUser={() =>
                          NavigateTo(
                            `UserProfile/${
                              isXdc(wallet?.address)
                                ? fromXdc(wallet?.address)
                                : wallet?.address
                            }`
                          )
                        }
                        wallet={wallet}
                      ></UserMenuButton>
                    ) : null}
                  </HStack>
                </>
              );
          }
        })()}
      </HStack>
    </ContentBar>
  );
}
export { TopBar };

const ContentBar = styled(motion.div)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.backElement};
  width: 100%;
  z-index: 10;
`;

const SlideMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  z-index: 1;
`;

const SlideMenuTablet = styled(motion.div)`
  position: fixed;
  top: 80px;
  right: 0px;
  z-index: 1;
`;

const Connect = styled(motion.div)`
  position: absolute;
  left: -16px;
`;
