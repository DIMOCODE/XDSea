import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  HStack,
  IconImg,
  Spacer,
  VStack,
  ZItem,
  ZStack,
} from "../../styles/Stacks";
import ButtonApp from "../../styles/Buttons";
import {
  BodyBold,
  CaptionRegular,
  TitleBold21,
  TitleBold27,
  BodyRegular,
  CaptionBold,
  TitleBold18,
  BodyMedium,
  TitleRegular21,
  TitleRegular18,
} from "../../styles/TextStyles";
import { XdcConnect, Disconnect } from "xdc-connect";
import XDSealogo from "../../images/LogoXDSEA.png";
import mountain from "../../images/mountain.jpg";
import { WalletButton } from "../../styles/walletButton";
import { SwitchButton } from "../../styles/SwitchButton";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { UserMenuButton } from "./UserMenuButton";
import { appStyle } from "../../styles/AppStyles";
import "../../styles/App.css";
import chevronRight from "../../images/chevronRight.png";
import closeIcon from "../../images/closeIcon.png";
import twitter from "../../images/twitterFaded.png";
import instagram from "../../images/instagramFaded.png";
import mail from "../../images/mailFaded.png";
import gif from "../../images/gifConnect.gif";
import search from "../../images/searchIcon.png";
import XDClogo from "../../images/xdcpayLogo.png";
import XDClogoBW from "../../images/xdcpayLogoBW.png";
import Metamask from "../../images/metamaskIcon.png";
import MetamaskBW from "../../images/metamaskIconBW.png";
import dcentWallet from "../../images/dcent.png";
import dcentWalletBW from "../../images/dcentBW.png";
import { useClickAway } from "react-use";
import { Searchbar } from "../../styles/Searbar";
import { anonymousLogin, logout } from "../../API/access";
import { LS, LS_ROOT_KEY } from "../../constant";
import { Divider, Icon } from "@mui/material";
import useWindowSize from "../../styles/useWindowSize";
import howToStart from "../../images/HowToStart.png";
import discoverIcon from "../../images/DiscoverIcon.png";
import createNewIcon from "../../images/CreateNewIcon.png";
import { createNFT } from "../../API/NFT";
import iconMenu from "../../images/iconMenu.png";
import zIndex from "@mui/material/styles/zIndex";

function TopBar(props) {
  const { device, themeToggler, devMode, onWalletChange } = props;
  const location = useLocation();
  const ref = useRef(null);
  const size = useWindowSize();

  const [wallet, setWallet] = useState({});
  const [deviceSize, setDeviceSize] = useState("");
  const [showMenu, setShowMenu] = useState(props.showMenu);
  const [showMetamask, setShowMetamask] = useState(false);
  const [isMetamask, setIsMetamask] = useState(false);
  const [isDcent, setIsDcent] = useState(false);
  const [isXdcPay, setIsXdcPay] = useState(false);
  const [showError, setShowError] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [walletOptions, setWalletOptions] = useState(true);
  const [searchPhone, setSearchPhone] = useState(false);
  const [user, setUser] = useState(null);

  const variant1 = {
    open: {
      rotate: 0,
      y: 0,
    },
    closed: {
      rotate: 45,
      y: 6,
    },
  };
  const variant2 = {
    open: {
      rotate: 0,
      y: 0,
    },
    closed: {
      rotate: -45,
      y: -6,
    },
  };

  /**
   * Change the searchbar design
   *
   * @param {boolean} status the status of the searchbar
   */
  function handleBarStatus(status) {
    setIsSearch(status);
  }

  /**
   * Connect Metamask wallet
   */
  const connectMetamask = async () => {
    if (window.ethereum) {
      if(window.ethereum.isMetaMask && window.ethereum.chainId !== undefined) {
        try {
          if (window.ethereum.chainId === "0x32") {
            const res = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            const { data } = await anonymousLogin(res[0]);
            LS.set(LS_ROOT_KEY, data);
            setWallet({
              connected: true,
              address: res[0],
            });
            onWalletChange({
              connected: true,
              address: res[0],
            });
            window.ethereum.on("accountsChanged", (accounts) => {
              setWallet({
                connected: false,
                address: accounts[0],
              });
              onWalletChange({
                connected: false,
                address: accounts[0],
              });
              logout();
              setWalletOptions(true);
            });
            getUser();
            setIsMetamask(true);
            setShowMetamask(false);
            setShowError(0);
            setShowInfo(false);
          } else {
            setShowError(4);
          }
        } catch (err) {
          setShowError(2);
        }
      }
      else {
        setShowError(1);
      }
    } else {
      setShowError(1);
    }
  };

  /**
   * Connect XDCPay wallet
   */
  const connectXDCPay = async () => {
    try{
      if (
        (window.ethereum.publicConfigStore._state.networkVersion === "50" ||
          window.ethereum.publicConfigStore._state.networkVersion === "51") &&
        window.ethereum.publicConfigStore._state.selectedAddress !== undefined
      ) {
        try {
            const address =
              window.ethereum.publicConfigStore._state.selectedAddress;
            const { data } = await anonymousLogin(address);
            LS.set(LS_ROOT_KEY, data);
            setWallet({
              connected: true,
              address: address,
            });
            onWalletChange({
              connected: true,
              address: address,
            });
            getUser();
            setShowMetamask(false);
            setShowError(0);
            setShowInfo(false);
        } catch (err) {
          setShowError(2);
        }
      }
    } catch (err) {
      setShowError(5);
    }
  };

  /**
   * Connect D'CENT wallet
   */
  const connectDcent = async () => {
    if (window.ethereum) {
      if(window.ethereum.isDcentWallet && window.ethereum.chainId !== undefined) {
        try {
          if (window.ethereum.chainId === "0x32") {
            const res = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            const { data } = await anonymousLogin(res[0]);
            LS.set(LS_ROOT_KEY, data);
            setWallet({
              connected: true,
              address: res[0],
            });
            onWalletChange({
              connected: true,
              address: res[0],
            });
            window.ethereum.on("accountsChanged", (accounts) => {
              setWallet({
                connected: false,
                address: accounts[0],
              });
              onWalletChange({
                connected: false,
                address: accounts[0],
              });
              logout();
              setWalletOptions(true);
            });
            getUser();
            setIsDcent(true);
            setShowError(0);
            setShowInfo(false);
          } else {
            setShowError(4);
          }
        } catch (err) {
          setShowError(2);
        }
      }
      else {
        setShowError(6);
      }
    } else {
      setShowError(6);
    }
  };

  /**
   * Disconnect the Metamask wallet
   */
  const disconnectMetamask = async () => {
    const res = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWallet({
      connected: false,
      address: res[0],
    });
    onWalletChange({
      connected: false,
      address: res[0],
    });
    logout();
    setWalletOptions(true);
    setShowMenu(!showMenu);
    setIsMetamask(false);
  };

  /**
   * Disconnect the XDCPay wallet
   */
  const disconnectXdcPay = async () => {
    setWallet({
      connected: false,
      address: wallet.address,
    });
    onWalletChange({
      connected: false,
      address: wallet.address,
    });
    logout();
    setWalletOptions(true);
    setShowMenu(!showMenu);
    setIsXdcPay(false);
  };

  /**
   * Disconnect the D'CENT wallet
   */
  const disconnectDcent = async () => {
    const res = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWallet({
      connected: false,
      address: res[0],
    });
    onWalletChange({
      connected: false,
      address: res[0],
    });
    logout();
    setWalletOptions(true);
    setShowMenu(!showMenu);
    setIsDcent(false);
  };

  const getUser = async () => {
    const userData = await LS.get(LS_ROOT_KEY).user;
    setUser(userData);
  };

  /**
   * Close the drop down menu when the outside is clicked
   */
  useClickAway(ref, () => {
    setShowMenu(false);
  });

  /**
   * React Hook to re-render the component when the window size changes
   */
  useEffect(() => {
    setDeviceSize(device);
    return () => {
      setShowMenu(false);
    };
  }, [device]);

  return (
    <ContentBar>
      {/* Top bar organized by Phone Tablet and Computer, each case of the switch have the content of the bar */}
      <HStack height="69px" width="100%" justify="center" blur="30px">
        <>
          <HStack
            width={
              size.width > 728 ? "1200px" : size.width > 424 ? "1024px" : "100%"
            }
            padding="0 6px "
          >
            {/* Logo */}
            <HStack
              spacing="9px"
              onClick={() => props.redirect("")}
              cursor={"pointer"}
            >
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
                width="80px"
              >
                <BodyRegular animate={{ opacity: 1 }} textcolor="#FCD868">
                  BETA
                </BodyRegular>
                {devMode ? (
                  <BodyBold textcolor="#FFFFFF">Basilisk</BodyBold>
                ) : (
                  <HStack
                    background=" linear-gradient(90.5deg, #FFF5B3 -30.32%, #FCD868 15.14%, #FBC34B 85.07%, #FF7A00 109.52%)"
                    border="6px"
                    padding="3px 6px"
                    cursor={"pointer"}
                  >
                    <CaptionRegular textcolor="#7A4405">
                      Developer
                    </CaptionRegular>
                  </HStack>
                )}
              </VStack>
            </HStack>
            <Spacer></Spacer>

            {/* Search with Discover and Create hidden on mobile */}

            {size.width > 425 ? (
              <HStack spacing="9px">
                {location.pathname === "/SearchPage" ? null : (
                  <Searchbar
                    top="54px"
                    left={"-0px"}
                    placeholder="Search for NFTs and Collections"
                    // widthInput={isSearch ? "741px" : "310px"}
                    widthInput={size.width > 768 ? "520px" : "290px"}
                    width="630px"
                    switchBarStatus={handleBarStatus}
                  ></Searchbar>
                )}

                <HStack
                  background={({ theme }) => theme.backElement}
                  self="none"
                  height="42px"
                  width="99px"
                  padding="0"
                  border="6px"
                  whiteTap={{ scale: 0.9 }}
                  cursor="pointer"
                  onClick={() => props.redirect("discover/collections")}
                >
                  <BodyMedium cursor="pointer">Discover</BodyMedium>
                </HStack>

                <HStack
                  background={
                    "linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                  }
                  self="none"
                  height="42px"
                  width="99px"
                  padding="0px"
                  border="6px"
                  minwidth="300px"
                  whiteTap={{ scale: 0.9 }}
                  cursor="pointer"
                  onClick={() => props.redirect("create-nft")}
                >
                  <BodyMedium cursor="pointer" textcolor="white">
                    Create NFT
                  </BodyMedium>
                </HStack>
              </HStack>
            ) : null}

            <Spacer></Spacer>

            <HStack ref={ref}>
              {wallet?.connected ? (
                <HStack self="none" minwith="52px" height="52px">
                  <IconImg
                    url={user?.urlProfile}
                    width="52px"
                    height="52px"
                    border="42px"
                    bordersize="3px"
                    bordercolor="white"
                    backsize="cover"
                    whileTap={{ scale: 0.96 }}
                    onTapStart={() => setShowMenu(!showMenu)}
                    cursor="pointer"
                  ></IconImg>
                  {/* <RedBubble>
                      <VStack
                        background="red"
                        width="26px"
                        height="26px"
                        border="9px"
                      >
                        <CaptionBold textcolor="white">1</CaptionBold>
                      </VStack>
                    </RedBubble> */}
                </HStack>
              ) : (
                <VStack
                  minwith="52px"
                  height="52px"
                  padding="17px"
                  background="rgba(0,0,0,0.3)"
                  border="52px"
                  onTapStart={() => setShowMenu(!showMenu)}
                  whileTap={{ scale: 0.96 }}
                >
                  <IconImg url={iconMenu} width="18px" height="18px"></IconImg>
                </VStack>
              )}

              <AnimatePresence initial={false}>
                {showMenu && (
                  <SlideMenuTablet
                    key="slidemenu"
                    initial={{ opacity: 1, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: "spring", damping: 10 }}
                    top={size.width > 425 ? "76px" : "69px"}
                  >
                    <VStack
                      background={({ theme }) => theme.backElement}
                      width={size.width > 425 ? "360px" : "100vw"}
                      padding="21px 30px"
                      height={size.width > 425 ? "auto" : "94vh"}
                      border={size.width > 425 ? "9px" : "0"}
                      alignment="flex-start"
                      spacing="15px"
                      style={{
                        boxShadow: " 0px 11px 12px 0px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <HStack minheight="42px">
                        <WalletButton
                          logout={
                            isMetamask
                              ? disconnectMetamask
                              : isXdcPay
                              ? disconnectXdcPay
                              : disconnectDcent
                          }
                          status={wallet?.connected}
                          wallet={wallet}
                          onClickMetamask={() => setShowMetamask(true)}
                          isMetamask={isMetamask}
                          isDcent={isDcent}
                          isXdcPay={isXdcPay}
                          hasAlert={showError > 0}
                          clickAlert={() => {
                            setShowInfo(true);
                          }}
                        ></WalletButton>
                      </HStack>

                      {size.width < 426 && (
                        <HStack style={{ zIndex: 1 }}>
                          <Searchbar
                            placeholder="Search for NFTs and Collections"
                            top="46px"
                            left="0px"
                            widthInput={size.width - 60 + "px"}
                            backcolor="rgba(0,0,0,0.1)"
                            textcolor={({ theme }) => theme.text}
                            isPhone={true}
                            switchBarStatus={handleBarStatus}
                            style={{ zIndex: 1 }}
                          ></Searchbar>
                        </HStack>
                      )}

                      <VStack
                        alignment="flex-end"
                        width="100%"
                        spacing="12px"
                        style={{ zIndex: 0 }}
                        justify="flex-start"
                        padding="30px 0 0 0"
                      >
                        <HStack height="30px">
                          <TitleRegular18 textcolor="rgba(0,0,0,0.3)">
                            MENU
                          </TitleRegular18>
                          <Spacer></Spacer>
                        </HStack>
                        {wallet?.connected ? (
                          <>
                            <HStack
                              minheight="42px"
                              cursor="pointer"
                              onClick={() => {
                                setShowMenu(!showMenu);
                                props.redirect(`user/${user?._id}`);
                              }}
                            >
                              <TitleRegular18
                                textcolor={({ theme }) => theme.text}
                              >
                                User Profile
                              </TitleRegular18>
                              <Spacer></Spacer>

                              <IconImg
                                url={user?.urlProfile}
                                width="35px"
                                height="35px"
                                border="42px"
                                bordersize="3px"
                                bordercolor="white"
                                backsize="cover"
                                whileTap={{ scale: 0.96 }}
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                            <HStack
                              background="rgba(0,0,0, 0.15)"
                              minheight="1px"
                              width="100%"
                            ></HStack>
                          </>
                        ) : null}

                        <HStack
                          minheight="42px"
                          cursor="pointer"
                          onClick={() => {
                            setShowMenu(!showMenu);
                            props.redirect("how-to-start");
                          }}
                        >
                          <TitleRegular18 textcolor={({ theme }) => theme.text}>
                            How To Start
                          </TitleRegular18>
                          <Spacer></Spacer>

                          <IconImg
                            cursor="pointer"
                            url={howToStart}
                            width="35px"
                            height="39px"
                          ></IconImg>
                        </HStack>

                        <HStack
                          background="rgba(0,0,0, 0.15)"
                          minheight="1px"
                          width="100%"
                        ></HStack>

                        <HStack
                          minheight="42px"
                          cursor="pointer"
                          onClick={() => {
                            setShowMenu(!showMenu);
                            props.redirect("discover/collections");
                          }}
                        >
                          <TitleRegular18 textcolor={({ theme }) => theme.text}>
                            Discover
                          </TitleRegular18>
                          <Spacer></Spacer>

                          <IconImg
                            cursor="pointer"
                            url={discoverIcon}
                            width="35px"
                            height="35px"
                          ></IconImg>
                        </HStack>

                        <HStack
                          background="rgba(0,0,0, 0.15)"
                          minheight="1px"
                          width="100%"
                        ></HStack>

                        <HStack
                          minheight="42px"
                          cursor="pointer"
                          onClick={() => {
                            setShowMenu(!showMenu);
                            props.redirect("create-nft");
                          }}
                        >
                          <TitleRegular18 textcolor={({ theme }) => theme.text}>
                            Create An NFT
                          </TitleRegular18>
                          <Spacer></Spacer>

                          <IconImg
                            cursor="pointer"
                            url={createNewIcon}
                            width="35px"
                            height="35px"
                          ></IconImg>
                        </HStack>
                      </VStack>
                      <Spacer></Spacer>
                    </VStack>
                  </SlideMenuTablet>
                )}
              </AnimatePresence>
            </HStack>
          </HStack>
        </>
      </HStack>

      {showInfo ? (
        <AnimatePresence>
          <MetamaskSteps
            key="metamaskModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <VStack width="100%" height="100%" blur="60px">
              {walletOptions ? (
                <VStack
                  self="none"
                  background="rgb(0,0,0,0.3)"
                  padding="15px"
                  border="15px"
                  maxheight="640px"
                  maxwidth="390px"
                  alignment="flex-start"
                >
                  <HStack>
                    <TitleBold27 textcolor="white">Connect Wallet</TitleBold27>
                    <Spacer></Spacer>
                    <IconImg
                      url={closeIcon}
                      width="21px"
                      height="21px"
                      onClick={() => setShowInfo(false)}
                    ></IconImg>
                  </HStack>
                  <BodyRegular align="center" textcolor="white">
                    Please select a wallet provider
                  </BodyRegular>

                  <Divider></Divider>

                  <VStack spacing="9px" width="100%">
                    {/* XDC pay  */}
                    <HStack
                      cursor="pointer"
                      background="rgb(0,0,0,0.3)"
                      padding="9px"
                      border="6px"
                      whileTap={{
                        scale:
                          ((window.ethereum?.publicConfigStore?._state?.networkVersion === "50" ||
                            window.ethereum?.publicConfigStore?._state?.networkVersion === "51") &&
                          window.ethereum?.publicConfigStore?._state?.selectedAddress !== undefined)
                            ? 0.98
                            : 1
                      }}
                      onClick={() => {
                        setShowError(0);
                        connectXDCPay();
                        setIsXdcPay(true);
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={
                          ((window.ethereum?.publicConfigStore?._state?.networkVersion === "50" ||
                            window.ethereum?.publicConfigStore?._state?.networkVersion === "51") &&
                          window.ethereum?.publicConfigStore?._state?.selectedAddress !== undefined)
                            ? XDClogo
                            : XDClogoBW
                        }
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular
                        cursor="pointer"
                        textcolor={
                          ((window.ethereum?.publicConfigStore?._state?.networkVersion === "50" ||
                            window.ethereum?.publicConfigStore?._state?.networkVersion === "51") &&
                          window.ethereum?.publicConfigStore?._state?.selectedAddress !== undefined)
                            ? "white"
                            : "grey"
                        }
                      >
                        XDC Pay
                      </BodyRegular>
                    </HStack>
                    {/* Metamask   */}
                    <HStack
                      cursor="pointer"
                      background="rgb(0,0,0,0.3)"
                      padding="9px"
                      border="6px"
                      whileTap={{ scale: window.ethereum?.isMetaMask && window.ethereum.chainId !== undefined
                        ? 0.98
                        : 1 
                      }}
                      onClick={() => {
                        setShowMetamask(true);
                        setWalletOptions(false);
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={window.ethereum?.isMetaMask && window.ethereum.chainId !== undefined
                          ? Metamask
                          : MetamaskBW
                        }
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular cursor="pointer" textcolor={
                        window.ethereum?.isMetaMask && window.ethereum.chainId !== undefined
                          ? "white"
                          : "grey"
                        }>
                        Metamask
                      </BodyRegular>
                    </HStack>
                    {/* Dcent Wallet  */}
                    <HStack
                      cursor="pointer"
                      background="rgb(0,0,0,0.3)"
                      padding="9px"
                      border="6px"
                      whileTap={{ scale: window.ethereum?.isDcentWallet && window.ethereum.chainId !== undefined
                        ? 0.98
                        : 1 
                      }}
                      onClick={() => {
                        setShowError(0);
                        connectDcent();
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={window.ethereum?.isDcentWallet && window.ethereum.chainId !== undefined
                          ? dcentWallet
                          : dcentWalletBW
                        }
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular cursor="pointer" textcolor={
                        window.ethereum?.isDcentWallet && window.ethereum.chainId !== undefined
                        ? "white"
                        : "grey"
                      }>
                        Dcent Wallet
                      </BodyRegular>
                    </HStack>
                  </VStack>

                  <CaptionRegular align="flex-start" textcolor="white">
                    In order to only use XDCPay, please uninstall or disable
                    Metamask from your browser
                  </CaptionRegular>

                  <CaptionRegular align="flex-start" textcolor="white">
                    In order to only use Metamask, please configure Metamask to
                    connect to the XDC network
                  </CaptionRegular>

                  <CaptionRegular align="flex-start" textcolor="white">
                    In order to only use D'Cent, please connect to the XDC
                    network on your D'Cent mobile app browser
                  </CaptionRegular>

                  <Spacer></Spacer>
                  <CaptionBold textcolor="white">RECENT ALERTS</CaptionBold>
                  {showError === 0 && (
                    <HStack
                      border="9px"
                      padding="18px"
                      background={appStyle.colors.darkgrey30}
                      cursor="pointer"
                    >
                      <BodyRegular align="center" textcolor="white">
                        No recent alerts
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 2 && (
                    <HStack
                      border="9px"
                      padding="18px"
                      background={appStyle.colors.softRed}
                      cursor="pointer"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkRed}
                      >
                        Connection Error. Check your wallet connection and try
                        again.
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 1 && (
                    <HStack
                      border="9px"
                      background={appStyle.colors.yellow}
                      cursor="pointer"
                      padding="18px"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkYellow}
                      >
                        Metamask is not detected. Install the <a style={{"text-decoration": "underline", "color": appStyle.colors.darkYellow}} href="https://metamask.io/download/">official wallet</a> to
                        connect with our marketplace
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 3 && (
                    <HStack
                      border="9px"
                      background={appStyle.colors.yellow}
                      cursor="pointer"
                      padding="18px"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkYellow}
                      >
                        It appears you are trying to connect using XDCPay.
                        Connect to XDCPay using the XDC icon button.
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 4 && (
                    <HStack
                      border="9px"
                      padding="18px"
                      background={appStyle.colors.softRed}
                      cursor="pointer"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkRed}
                      >
                        Metamask is not connected to the right network. Change
                        the Metamask network to the configured XDC network.
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 5 && (
                    <HStack
                      border="9px"
                      background={appStyle.colors.yellow}
                      cursor="pointer"
                      padding="18px"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkYellow}
                      >
                        XDCPay is not detected. Install the <a style={{"text-decoration": "underline", "color": appStyle.colors.darkYellow}} href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo">official wallet</a> to
                        connect with our marketplace
                      </BodyRegular>
                    </HStack>
                  )}
                  {showError === 6 && (
                    <HStack
                      border="9px"
                      background={appStyle.colors.yellow}
                      cursor="pointer"
                      padding="18px"
                    >
                      <BodyRegular
                        align="center"
                        textcolor={appStyle.colors.darkYellow}
                      >
                        DCent Wallet is not detected. Install the <a style={{"text-decoration": "underline", "color": appStyle.colors.darkYellow}} href="https://play.google.com/store/apps/details?id=com.kr.iotrust.dcent.wallet&hl=en_NZ&gl=US">official
                        wallet application</a> to connect with our marketplace
                      </BodyRegular>
                    </HStack>
                  )}
                </VStack>
              ) : null}

              {/* Metamask Information Modal */}
              {showMetamask ? (
                <VStack width="100%" height="100%" border="15px">
                  <HStack
                    self="none"
                    background={({ theme }) => theme.walletButton}
                    maxWidth={size.width < 426 ? "100%" : "560px"}
                    padding="15px"
                    border="15px"
                    responsive={true}
                  >
                    {deviceSize === "phone" ? null : (
                      <IconImg
                        url={gif}
                        width="280px"
                        height="420px"
                        backsize="cover"
                        border="9px"
                      ></IconImg>
                    )}

                    <VStack height="420px">
                      <HStack>
                        <Spacer></Spacer>
                        <IconImg
                          url={closeIcon}
                          width="21px"
                          height="21px"
                          onClick={() => {
                            setShowMetamask(false);
                            setWalletOptions(true);
                          }}
                        ></IconImg>
                      </HStack>
                      <VStack alignment="flex-start">
                        <HStack spacing="9px">
                          <IconImg
                            url={Metamask}
                            width="49px"
                            height="49px"
                            backsize="cover"
                            border="9px"
                          ></IconImg>
                          <TitleBold18
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Add XinFin Network to Metamask
                          </TitleBold18>
                        </HStack>
                        <Spacer></Spacer>

                        <HStack justify="flex-start">
                          <CaptionRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Network Name:
                          </CaptionRegular>
                          <BodyRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Xinfin Mainnet
                          </BodyRegular>
                        </HStack>

                        <HStack justify="flex-start">
                          <CaptionRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            URL:
                          </CaptionRegular>
                          <BodyRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            https://erpc.xinfin.network
                          </BodyRegular>
                        </HStack>

                        <HStack justify="flex-start">
                          <CaptionRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Chain ID:
                          </CaptionRegular>
                          <BodyRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            50
                          </BodyRegular>
                        </HStack>

                        <HStack justify="flex-start">
                          <CaptionRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Currency Symbol:
                          </CaptionRegular>
                          <BodyRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            XDC
                          </BodyRegular>
                        </HStack>

                        <VStack alignment="flex-start" spacing="3px">
                          <CaptionRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            Block Explorer URL:
                          </CaptionRegular>
                          <BodyRegular
                            textcolor={({ theme }) => theme.walletText}
                          >
                            https://explorer.xinfin.network
                          </BodyRegular>
                        </VStack>
                      </VStack>
                      {deviceSize === "phone"
                        ? <IconImg
                          url={gif}
                          width="240px"
                          height="360px"
                          backsize="contain"
                          border="9px"
                        ></IconImg>
                        : null
                      }
                      

                      <Spacer></Spacer>
                      <HStack
                        whileHover={{ opacity: 0.8 }}
                        whileTap={{ scale: 0.98 }}
                        background="blue"
                        minheight="39px"
                        border="9px"
                        cursor="pointer"
                        onClick={() => {
                          setShowError(0);
                          connectMetamask();
                        }}
                      >
                        <BodyBold cursor="pointer" textcolor="white">
                          Connect Metamask
                        </BodyBold>
                      </HStack>

                      {showError === 0 && null}
                      {showError === 1 && (
                        <HStack
                          whileHover={{ opacity: 0.8 }}
                          whileTap={{ scale: 0.98 }}
                          minheight="39px"
                          border="9px"
                          bordersize="1px"
                          bordercolor={appStyle.colors.yellow}
                          background={appStyle.colors.yellow}
                          cursor="pointer"
                        >
                          <BodyBold textcolor={appStyle.colors.darkYellow}>
                          <a href="https://metamask.io/download/">Install Metamask</a>
                          </BodyBold>
                        </HStack>
                      )}
                      {showError === 2 && (
                        <HStack
                          whileHover={{ opacity: 0.8 }}
                          whileTap={{ scale: 0.98 }}
                          minheight="39px"
                          border="9px"
                          bordersize="1px"
                          background={appStyle.colors.softRed}
                          cursor="pointer"
                        >
                          <BodyBold textcolor={appStyle.colors.darkRed}>
                            Connection Error
                          </BodyBold>
                        </HStack>
                      )}
                      {showError === 4 && (
                        <HStack
                          whileHover={{ opacity: 0.8 }}
                          whileTap={{ scale: 0.98 }}
                          minheight="39px"
                          border="9px"
                          bordersize="1px"
                          background={appStyle.colors.softRed}
                          cursor="pointer"
                        >
                          <BodyBold textcolor={appStyle.colors.darkRed}>
                            Connect to XDC Mainnet
                          </BodyBold>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                </VStack>
              ) : null}
            </VStack>
          </MetamaskSteps>
        </AnimatePresence>
      ) : null}
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
  background: ${({ theme }) => theme.topbar};
  width: 100%;
  z-index: 10;
`;

const SlideMenu = styled(motion.div)`
  position: fixed;
  top: 60px;
  right: 10px;
  z-index: 1;
`;

const SlideMenuTablet = styled(motion.div)`
  position: fixed;
  top: ${(props) => props.top};
  right: -6px;
  width: auto;
  height: auto;
  z-index: 30;
  overflowy: auto;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;

const Connect = styled(motion.div)`
  position: relative;
  // left: -16px;
`;

const MetamaskSteps = styled(motion.div)`
  position: absolute;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;

const RedBubble = styled(motion.div)`
  position: absolute;
  right: -6px;
  top: 0px;
`;
