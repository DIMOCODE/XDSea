import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyBold,
  CaptionRegular,
  TitleBold27,
  BodyRegular,
  CaptionBold,
  TitleBold18,
  TitleRegular18,
} from "../../styles/TextStyles";
import XDSealogo from "../../images/LogoXDSEA.png";
import { WalletButton } from "../../styles/walletButton";
import { isXdc, toXdc } from "../../common/common";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { appStyle } from "../../styles/AppStyles";
import "../../styles/App.css";
import closeIcon from "../../images/closeIcon.png";
import gif from "../../images/gifConnect.gif";
import XDClogo from "../../images/xdcpayLogo.png";
import XDClogoBW from "../../images/xdcpayLogoBW.png";
import Metamask from "../../images/metamaskIcon.png";
import MetamaskBW from "../../images/metamaskIconBW.png";
import dcentWallet from "../../images/dcent.png";
import dcentWalletBW from "../../images/dcentBW.png";
import { useClickAway } from "react-use";
import { Searchbar } from "../../styles/Searbar";
import { anonymousLogin, logout } from "../../API/access";
import { LS, LS_ROOT_KEY, getXdcDomain } from "../../constant";
import { Divider } from "@mui/material";
import useWindowSize from "../../styles/useWindowSize";
import howToStart from "../../images/HowToStart.png";
import discoverIcon from "../../images/DiscoverIcon.png";
import createNewIcon from "../../images/CreateNewIcon.png";
import iconMenu from "../../images/iconMenu.png";
import { TopBarButton } from "../../styles/Buttons/TopBarButton";
import { SlideMenuTabletButton } from "../../styles/Buttons/SlideMenuTabletButton";
import { WalletConnectButtons } from "../../styles/Buttons/WalletConnectButtons";

function TopBar(props) {
  const { device, themeToggler, devMode, onWalletChange, getUser, user } =
    props;
  const location = useLocation();
  const ref = useRef(null);
  const size = useWindowSize();

  const [wallet, setWallet] = useState({});
  const [deviceSize, setDeviceSize] = useState("");
  const [showMenu, setShowMenu] = useState(props.showMenu);
  const [isMetamask, setIsMetamask] = useState(false);
  const [isDcent, setIsDcent] = useState(false);
  const [isXdcPay, setIsXdcPay] = useState(false);
  const [showError, setShowError] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  /**
   * Connect Metamask wallet
   */
  const connectMetamask = async () => {
    if (window.ethereum) {
      if (
        window.ethereum.isMetaMask &&
        window.ethereum?.isDcentWallet === undefined &&
        window.ethereum.chainId !== undefined
      ) {
        try {
          if (window.ethereum.chainId !== "0x32") {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x32" }],
              });
            } catch (error) {
              var code = error.data?.originalError?.code;
              if (code === undefined) {
                code = error.code;
              }
              if (code === 4902) {
                try {
                  await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainName: "XinFin Network Mainnet",
                        chainId: "0x32",
                        nativeCurrency: {
                          symbol: "XDC",
                          decimals: 18,
                        },
                        rpcUrls: ["https://rpc.xinfin.network/"],
                        blockExplorerUrls: ["https://explorer.xinfin.network/"],
                      },
                    ],
                  });
                } catch (addError) {
                  setShowError(4);
                  return;
                }
              } else {
                setShowError(4);
                return;
              }
            }
          }
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
          setWalletAddress(await getXdcDomainAddress(res[0]));
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
          getUser();
          setIsMetamask(true);
          setShowError(0);
          setShowInfo(false);
        } catch (err) {
          setShowError(2);
        }
      } else {
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
    try {
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
          setWalletAddress(await getXdcDomainAddress(address));
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
      if (
        window.ethereum.isDcentWallet &&
        window.ethereum.chainId !== undefined
      ) {
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
            setWalletAddress(await getXdcDomainAddress(res[0]));
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
      } else {
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
    setShowMenu(!showMenu);
    setIsDcent(false);
  };

  /**
   * Get the XDC domain name in use by the wallet address
   *
   * @param {string} address
   * @returns the XDC default domain name
   */
  const getXdcDomainAddress = async (address) => {
    const xdcDomainName = isXdc(address)
      ? await getXdcDomain(address)
      : await getXdcDomain(toXdc(address));
    return xdcDomainName === ""
      ? isXdc(address)
        ? address.toLowerCase()
        : toXdc(address.toLowerCase())
      : xdcDomainName;
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
      {/* Top bar organized by Phone, Tablet and Computer */}
      <HStack height="69px" width="100%" justify="center" blur="30px">
        <>
          <HStack width={size.width > 1200 ? "1200px" : "100%"} padding="0 6px">
            {/* Logo and Beta version info */}
            <HStack spacing="9px">
              <IconImg
                url={XDSealogo}
                width="52px"
                height="52px"
                cursor={"pointer"}
                onClick={() => props.redirect("")}
              ></IconImg>
              <VStack spacing="1px" alignment="flex-start">
                <BodyRegular textcolor="#FCD868">BETA</BodyRegular>
                <BodyBold textcolor="#FFFFFF">Basilisk</BodyBold>
              </VStack>
            </HStack>

            <Spacer></Spacer>

            {/* Search with Discover and Create NFT buttons for large sizes */}
            {size.width > 532 ? (
              <HStack spacing="9px">
                {location.pathname === "/SearchPage" ? null : (
                  <Searchbar
                    placeholder="Search for NFTs and Collections"
                    widthInput={size.width > 1024 ? "520px" : "290px"}
                    top={"46px"}
                  ></Searchbar>
                )}

                {size.width > 768 && (
                  <>
                    <TopBarButton
                      background={({ theme }) => theme.backElement}
                      onClick={() => props.redirect("discover/collections")}
                      text="Discover"
                    />

                    <TopBarButton
                      background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                      onClick={() => props.redirect("create-nft")}
                      text="Create NFT"
                      textcolor="white"
                    />
                  </>
                )}
              </HStack>
            ) : null}

            <Spacer></Spacer>

            <HStack ref={ref}>
              {/* Options button shows profile picture when wallet connected */}
              {wallet?.connected ? (
                <HStack self="auto" height="52px">
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
                {showMenu &&
                  (size.width > 532 ? (
                    <SlideMenuTablet
                      key="slidemenu"
                      initial={{ opacity: 1, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", damping: 10 }}
                      top={"76px"}
                    >
                      {/* Options menu for larger screens */}
                      <VStack
                        background={({ theme }) => theme.backElement}
                        width={"360px"}
                        padding="21px 30px"
                        height={"auto"}
                        border={"9px"}
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
                            walletAddress={walletAddress}
                            isMetamask={isMetamask}
                            isXdcPay={isXdcPay}
                            clickAlert={() => {
                              setShowInfo(true);
                            }}
                          ></WalletButton>
                        </HStack>

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
                            <SlideMenuTabletButton
                              showMenu={showMenu}
                              setShowMenu={setShowMenu}
                              redirect={() => {
                                props.redirect(`user/${user?.nickName}`);
                              }}
                              title={"User Profile"}
                              icon={user?.urlProfile}
                              isDivider={true}
                            ></SlideMenuTabletButton>
                          ) : null}

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("how-to-start");
                            }}
                            title={"How To Start"}
                            icon={howToStart}
                            isDivider={true}
                          ></SlideMenuTabletButton>

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("discover/collections");
                            }}
                            title={"Discover"}
                            icon={discoverIcon}
                            isDivider={true}
                          ></SlideMenuTabletButton>

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("create-nft");
                            }}
                            title={"Create An NFT"}
                            icon={createNewIcon}
                          ></SlideMenuTabletButton>
                        </VStack>
                        <Spacer></Spacer>
                      </VStack>
                    </SlideMenuTablet>
                  ) : (
                    <SlideMenuTablet
                      key="slidemenu"
                      initial={{ opacity: 1, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", damping: 10 }}
                      top={"69px"}
                    >
                      {/* Options menu for smallers screens */}
                      <VStack
                        background={({ theme }) => theme.backElement}
                        width={"100vw"}
                        padding="21px 30px"
                        height={"94vh"}
                        border={"0"}
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
                            walletAddress={walletAddress}
                            isMetamask={isMetamask}
                            isMobile={true}
                            isXdcPay={isXdcPay}
                            clickAlert={() => {
                              setShowInfo(true);
                            }}
                          ></WalletButton>
                        </HStack>

                        {size.width < 533 && (
                          <HStack style={{ zIndex: 1 }}>
                            <Searchbar
                              placeholder="Search for NFTs and Collections"
                              top="46px"
                              left="0px"
                              widthInput={size.width - 60 + "px"}
                              backcolor="rgba(0,0,0,0.1)"
                              textcolor={"rgba(0,0,0,0.6)"}
                              textplace={"rgba(0,0,0,0.6)"}
                              isPhone={true}
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
                            <SlideMenuTabletButton
                              showMenu={showMenu}
                              setShowMenu={setShowMenu}
                              redirect={() => {
                                props.redirect(`user/${user?.nickName}`);
                              }}
                              title={"User Profile"}
                              icon={user?.urlProfile}
                              isDivider={true}
                            ></SlideMenuTabletButton>
                          ) : null}

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("how-to-start");
                            }}
                            title={"How To Start"}
                            icon={howToStart}
                            isDivider={true}
                          ></SlideMenuTabletButton>

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("discover/collections");
                            }}
                            title={"Discover"}
                            icon={discoverIcon}
                            isDivider={true}
                          ></SlideMenuTabletButton>

                          <SlideMenuTabletButton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            redirect={() => {
                              props.redirect("create-nft");
                            }}
                            title={"Create An NFT"}
                            icon={createNewIcon}
                          ></SlideMenuTabletButton>
                        </VStack>
                        <Spacer></Spacer>
                      </VStack>
                    </SlideMenuTablet>
                  ))}
              </AnimatePresence>
            </HStack>
          </HStack>
        </>
      </HStack>

      {/* Show the wallet connection options */}
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
              <HStack
                self="none"
                background={({ theme }) => theme.walletButton}
                maxwidth={"560px"}
                maxheight="640px"
                padding="15px"
                border="15px"
                alignment="flex-start"
                responsive={true}
              >
                {showError === 4 ? (
                  <HStack
                    self="none"
                    background={({ theme }) => theme.walletButton}
                    border="15px"
                    responsive={true}
                  >
                    {deviceSize === "phone" ? null : (
                      <IconImg
                        url={gif}
                        width="390px"
                        height="580px"
                        backsize="cover"
                        border="9px"
                      ></IconImg>
                    )}
                  </HStack>
                ) : null}
                <VStack self="none" alignment="flex-start">
                  {/* Title and subtitle */}
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

                  {/* List of wallet options */}
                  <VStack spacing="9px" width="100%" maxwidth="390px">
                    {/* XDCPay */}
                    <WalletConnectButtons
                      isEnabled={
                        (window.ethereum?.publicConfigStore?._state
                          ?.networkVersion === "50" ||
                          window.ethereum?.publicConfigStore?._state
                            ?.networkVersion === "51") &&
                        window.ethereum?.publicConfigStore?._state
                          ?.selectedAddress !== undefined
                      }
                      onClick={() => {
                        setShowError(0);
                        connectXDCPay();
                        setIsXdcPay(true);
                      }}
                      enabledIcon={XDClogo}
                      disabledIcon={XDClogoBW}
                      walletName={"XDCPay"}
                    ></WalletConnectButtons>
                    {/* Metamask */}
                    <WalletConnectButtons
                      isEnabled={
                        window.ethereum?.isMetaMask &&
                        window.ethereum?.isDcentWallet === undefined &&
                        window.ethereum.chainId !== undefined
                      }
                      onClick={() => {
                        setShowError(0);
                        connectMetamask();
                      }}
                      enabledIcon={Metamask}
                      disabledIcon={MetamaskBW}
                      walletName={"Metamask"}
                    ></WalletConnectButtons>
                    {/* D'Cent */}
                    <WalletConnectButtons
                      isEnabled={
                        window.ethereum?.isDcentWallet &&
                        window.ethereum.chainId !== undefined
                      }
                      onClick={() => {
                        setShowError(0);
                        connectDcent();
                      }}
                      enabledIcon={dcentWallet}
                      disabledIcon={dcentWalletBW}
                      walletName={"D'Cent"}
                    ></WalletConnectButtons>
                    {/* XDCPay Notice */}
                    {(window.ethereum?.publicConfigStore?._state
                      ?.networkVersion === "50" ||
                      window.ethereum?.publicConfigStore?._state
                        ?.networkVersion === "51") &&
                      window.ethereum?.publicConfigStore?._state
                        ?.selectedAddress !== undefined && (
                        <CaptionRegular textcolor="white">
                          In order to use XDCPay, please uninstall or disable
                          Metamask.
                        </CaptionRegular>
                      )}
                    {/* Metamask Notice */}
                    {window.ethereum?.isMetaMask &&
                      window.ethereum?.isDcentWallet === undefined &&
                      window.ethereum.chainId !== undefined && (
                        <>
                          <CaptionRegular textcolor="white">
                            In order to use Metamask, please make sure that
                            XDCPay is uninstalled or disabled.
                          </CaptionRegular>
                          <Divider></Divider>
                          {showError === 4 && (
                            <>
                              <TitleBold18 textcolor="white">
                                Add XinFin Network to Metamask
                              </TitleBold18>
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
                              <HStack justify="flex-start">
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
                              </HStack>
                              <Divider></Divider>
                            </>
                          )}
                        </>
                      )}
                    {/* D'Cent Notice */}
                    {window.ethereum?.isDcentWallet &&
                      window.ethereum.chainId !== undefined && (
                        <CaptionRegular textcolor="white">
                          In order to use D'Cent, please connect to the XDC
                          network on your D'Cent mobile app browser.
                        </CaptionRegular>
                      )}
                    {/* Alert Window */}
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
                          Metamask is not detected. Install the{" "}
                          <a
                            style={{
                              "text-decoration": "underline",
                              color: appStyle.colors.darkYellow,
                            }}
                            href="https://metamask.io/download/"
                          >
                            official wallet
                          </a>{" "}
                          to connect to the marketplace.
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
                          Metamask failed to connect to the right network.
                          Please change the Metamask network to the configured
                          XDC network manually.
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
                          XDCPay is not detected. Install the{" "}
                          <a
                            style={{
                              "text-decoration": "underline",
                              color: appStyle.colors.darkYellow,
                            }}
                            href="https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo"
                          >
                            official wallet
                          </a>{" "}
                          to connect with our marketplace
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
                          DCent Wallet is not detected. Install the{" "}
                          <a
                            style={{
                              "text-decoration": "underline",
                              color: appStyle.colors.darkYellow,
                            }}
                            href="https://play.google.com/store/apps/details?id=com.kr.iotrust.dcent.wallet&hl=en_NZ&gl=US"
                          >
                            official wallet application
                          </a>{" "}
                          to connect with our marketplace
                        </BodyRegular>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </HStack>
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

const MetamaskSteps = styled(motion.div)`
  position: absolute;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;
