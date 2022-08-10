import React, { 
  useState, 
  useEffect, 
  useRef 
} from "react";
import { 
  useLocation 
} from "react-router-dom";
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
} from "../../styles/TextStyles";
import { XdcConnect, Disconnect } from "xdc-connect";
import XDSealogo from "../../images/LogoXDSEA.png";
import { WalletButton } from "../../styles/walletButton";
import { SwitchButton } from "../../styles/SwitchButton";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion/dist/framer-motion";
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
import Metamask from "../../images/metamaskIcon.png";
import dcentWallet from "../../images/dcent.png";
import { useClickAway } from "react-use";
import { Searchbar } from "../../styles/Searbar";
import { anonymousLogin, logout } from "../../API/access";
import { 
  LS, 
  LS_ROOT_KEY 
} from "../../constant";
import { 
  Divider, 
  Icon 
} from "@mui/material";

function TopBar(props) {
  const { 
    device, 
    themeToggler, 
    devMode, 
    onWalletChange 
  } = props;
  const location = useLocation();
  const ref = useRef(null);

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

  const variant1 = {
    open: { 
      rotate: 0, 
      y: 0 
    },
    closed: { 
      rotate: 45, 
      y: 6 
    },
  };
  const variant2 = {
    open: { 
      rotate: 0, 
      y: 0 
    },
    closed: { 
      rotate: -45, 
      y: -6 
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
          });
          setIsMetamask(true);
          setShowMetamask(false);
          setShowError(0);
        } else if (window.ethereum.chainId === undefined) {
          setShowError(3);
        } else {
          setShowError(4);
        }
      } catch (err) {
        setShowError(2);
      }
    } else {
      setShowError(1);
    }
  };

  /**
   * Connect XDCPay wallet
   */
  const connectXDCPay = async () => {
    if (window.ethereum) {
      try {
        if (
          (window.ethereum.publicConfigStore._state.networkVersion === "50" ||
            window.ethereum.publicConfigStore._state.networkVersion === "51") &&
          window.ethereum.publicConfigStore._state.selectedAddress !== undefined
        ) {
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
          setShowMetamask(false);
          setShowError(0);
        }
      } catch (err) {
        setShowError(2);
      }
    } else {
      setShowError(5);
    }
  };

  /**
   * Connect D'CENT wallet
   */
  const connectDcent = async () => {
    if (window.ethereum) {
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
          });
          setIsDcent(true);
          setShowError(0);
        } else if (window.ethereum.chainId === undefined) {
          setShowError(3);
        } else {
          setShowError(4);
        }
      } catch (err) {
        setShowError(2);
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
    setIsDcent(false);
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
      <HStack height="90px" width="100%" justify="center">
        {(() => {
          switch (deviceSize) {
            case "phone":
              return (
                <AnimatePresence initial={false}>
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
                        height="420px"
                        border="0 0 15px 15px"
                      >
                        <VStack
                          alignment="flex-start"
                          width="180px"
                          spacing="21px"
                          style={{ zIndex: -100 }}
                        >
                          <TitleBold21
                            onClick={() => props.redirect("")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Home
                          </TitleBold21>
                          <TitleBold21
                            onClick={() => props.redirect("Discover")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Discover
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => props.redirect("HowToStart")}
                          >
                            How to Start
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => props.redirect("CreateNFT")}
                          >
                            Create an NFT
                          </TitleBold21>
                        </VStack>

                        <VStack style={{ zIndex: -100 }}>
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
                            isMobile={true}
                            hasAlert={showError > 0}
                            clickAlert={() => setShowInfo(true)}
                          ></WalletButton>
                        </VStack>
                        <Spacer></Spacer>
                        <HStack style={{ zIndex: -100 }}>
                          <SwitchButton
                            clickOnSwitch={themeToggler}
                          ></SwitchButton>
                          {wallet?.connected ? (
                            <UserMenuButton wallet={wallet} redirect={props.redirect}></UserMenuButton>
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

                  {searchPhone ? (
                    <HStack width="100%" padding=" 0 12px">
                      <Searchbar
                        placeholder="Search for NFTs and Collections"
                        top="46px"
                        left="-12px"
                        width="100vw"
                        widthInput="70%"
                        isPhone={true}
                        switchBarStatus={handleBarStatus}
                      ></Searchbar>
                      <VStack
                        maxwidth="46px"
                        height="46px"
                        border="12px"
                        background={({ theme }) => theme.faded}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchPhone(!searchPhone)}
                      >
                        <IconImg
                          url={chevronRight}
                          width="21px"
                          height="21px"
                          cursor={"pointer"}
                        ></IconImg>
                      </VStack>
                    </HStack>
                  ) : (
                    <HStack
                      width="100%"
                      padding="0 12px"
                      style={{ position: "relative" }}
                    >
                      <HStack onClick={() => props.redirect("")} cursor={"pointer"}>
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
                          {devMode ? (
                            <BodyBold textcolor={({ theme }) => theme.blue}>
                              βeta v1.6.3
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
                        onClick={() => setSearchPhone(!searchPhone)}
                      >
                        <IconImg
                          url={search}
                          width="26px"
                          height="26px"
                          cursor={"pointer"}
                        ></IconImg>
                      </VStack>

                      <VStack
                        maxwidth="46px"
                        height="46px"
                        border="12px"
                        background={({ theme }) => theme.faded}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowMenu(!showMenu)}
                        ref={ref}
                      >
                        <svg
                          width="26"
                          height="26"
                          viewBox="-2 0 26 26"
                          fill={"#5C6976"}
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
                      </VStack>
                    </HStack>
                  )}
                </AnimatePresence>
              );
            case "tablet":
              return (
                <AnimatePresence initial={false}>
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
                        <VStack
                          alignment="flex-end"
                          width="180px"
                          spacing="21px"
                        >
                          <TitleBold21
                            onClick={() => props.redirect("")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Home
                          </TitleBold21>
                          <TitleBold21
                            onClick={() => props.redirect("Discover")}
                            textcolor={({ theme }) => theme.text}
                          >
                            Discover
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => props.redirect("HowToStart")}
                          >
                            How to Start
                          </TitleBold21>
                          <TitleBold21
                            textcolor={({ theme }) => theme.text}
                            onClick={() => props.redirect("CreateNFT")}
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
                    <HStack onClick={() => props.redirect("")} cursor={"pointer"}>
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
                        {devMode ? (
                          <BodyBold textcolor={({ theme }) => theme.blue}>
                            βeta v1.6.3
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

                    {/* Search  */}
                    <Searchbar
                      placeholder="Search for NFTs and Collections"
                      top="58px"
                      left="0px"
                      widthInput="50%"
                      width="68%"
                      switchBarStatus={handleBarStatus}
                    ></Searchbar>
                    <Spacer></Spacer>

                    <VStack maxwidth="180px">
                      <ZStack>
                        <ZItem>
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
                            clickAlert={() => setShowInfo(true)}
                          ></WalletButton>
                        </ZItem>
                      </ZStack>
                    </VStack>

                    <SwitchButton clickOnSwitch={themeToggler}></SwitchButton>
                    {wallet?.connected ? (
                      <UserMenuButton wallet={wallet} redirect={props.redirect}></UserMenuButton>
                    ) : null}

                    <VStack
                      minwidth="46px"
                      height="46px"
                      border="12px"
                      background={({ theme }) => theme.faded}
                      whileTap={{ scale: 0.9 }}
                      onTapStart={() => setShowMenu(!showMenu)}
                      ref={ref}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="-2 0 26 26"
                        fill={"#5C6976"}
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
                    </VStack>
                  </HStack>
                </AnimatePresence>
              );
            case "computer":
              return (
                <>
                  <HStack width="1200px">
                    <HStack onClick={() => props.redirect("")} cursor={"pointer"}>
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
                        width="80px"
                      >
                        <BodyBold textcolor={({ theme }) => theme.text}>
                          XDSea
                        </BodyBold>
                        {devMode ? (
                          <BodyBold textcolor={({ theme }) => theme.blue}>
                            βeta v1.6.3
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
                    {/* Search  */}
                    {location.pathname === "/SearchPage" ? null : (
                      <Searchbar
                        top="54px"
                        left="0px"
                        placeholder="Search for NFTs and Collections"
                        widthInput={isSearch ? "741px" : "310px"}
                        width="741px"
                        switchBarStatus={handleBarStatus}
                      ></Searchbar>
                    )}

                    <AnimatePresence>
                      {!isSearch && (
                        <HStack
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          spacing="3px"
                        >
                          <ButtonApp
                            background="rgba(255, 255, 255, 0)"
                            textcolor={({ theme }) => theme.text}
                            text="Discover"
                            cursor="pointer"
                            onClick={() => props.redirect("Discover")}
                            btnStatus={0}
                          ></ButtonApp>
                          <ButtonApp
                            background="rgba(255, 255, 255, 0)"
                            textcolor={({ theme }) => theme.text}
                            text="How To Start"
                            cursor="pointer"
                            onClick={() => props.redirect("HowToStart")}
                            btnStatus={0}
                            width="150px"
                            padding="0px"
                          ></ButtonApp>
                          <ButtonApp
                            background="rgba(255, 255, 255, 0)"
                            textcolor={({ theme }) => theme.blue}
                            text="Create an NFT"
                            cursor="pointer"
                            onClick={() => props.redirect("CreateNFT")}
                            btnStatus={0}
                            width="150px"
                            padding="0px"
                          ></ButtonApp>
                        </HStack>
                      )}
                    </AnimatePresence>

                    <Spacer></Spacer>
                    <VStack maxwidth="180px">
                      <ZStack>
                        <ZItem>
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
                            clickAlert={() => setShowInfo(true)}
                          ></WalletButton>
                        </ZItem>
                      </ZStack>
                    </VStack>

                    <SwitchButton clickOnSwitch={themeToggler}></SwitchButton>
                    {wallet?.connected ? (
                      <UserMenuButton wallet={wallet} redirect={props.redirect}></UserMenuButton>
                    ) : null}
                  </HStack>
                </>
              );
          }
        })()}
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
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        connectXDCPay();
                        setIsXdcPay(true);
                        setShowInfo(false);
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={XDClogo}
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular cursor="pointer" textcolor="white">
                        XDC Pay
                      </BodyRegular>
                    </HStack>
                    {/* Metamask   */}
                    <HStack
                      cursor="pointer"
                      background="rgb(0,0,0,0.3)"
                      padding="9px"
                      border="6px"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowMetamask(true);
                        setWalletOptions(false);
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={Metamask}
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular cursor="pointer" textcolor="white">
                        Metamask
                      </BodyRegular>
                    </HStack>
                    {/* Dcent Wallet  */}
                    <HStack
                      cursor="pointer"
                      background="rgb(0,0,0,0.3)"
                      padding="9px"
                      border="6px"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        connectDcent();
                        setIsDcent(true);
                        setShowInfo(false);
                      }}
                    >
                      <IconImg
                        cursor="pointer"
                        url={dcentWallet}
                        width="30px"
                        height="30px"
                      ></IconImg>
                      <BodyRegular cursor="pointer" textcolor="white">
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
                        Metamask is not detected. Install the official wallet to
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
                        XDCPay is not detected. Install the official wallet to
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
                        DCent Wallet is not detected. Install the official
                        wallet application to connect with our marketplace
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
                    width={deviceSize === "phone" ? "100%" : "560px"}
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

                      <Spacer></Spacer>
                      <HStack
                        whileHover={{ opacity: 0.8 }}
                        whileTap={{ scale: 0.98 }}
                        background="blue"
                        minheight="39px"
                        border="9px"
                        cursor="pointer"
                        onClick={() => {
                          connectMetamask();
                          setShowInfo(false);
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
                            Install Metamask
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
                      {showError === 3 && (
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
                            Use XDCPay Button
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
                      {showError === 5 && (
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
                            Install XDCPay
                          </BodyBold>
                        </HStack>
                      )}
                      {showError === 6 && (
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
                            Use Dcent Wallet Application
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
