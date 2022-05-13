import React, { createContext, useEffect, useMemo, useState } from "react";
import { Link, Route, Switch, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { ThemeProvider } from "styled-components";
import { XdcConnect, Disconnect } from "xdc-connect";

import { GlobalStyles } from "../GlobalStyle";
import { lightTheme, darkTheme } from "../themes";
import { isXdc, fromXdc } from "../common/common";
import ScrollToTop from "../common/scrollToTop";

import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { Home } from "./Home";
import { Discover } from "./Discover";
import MyNFT from "./MyNFT";
// import { UserProfile } from "./UserProfile";
import { CreateNft } from "./CreateNft";
import Collection from "./Collection";
import NFTPage from "./NFTPage";
// import { CreateCollection } from "./CreateCollection";
// import { Settings } from "./Settings";
import { Modal } from "./Modal";
// import { Notification } from "./Notification";

import { ModalAds } from "../ModalAds";
import { HowToStart } from "../HowToStart";
import starwarsYoda from "../images/Yoda4.gif";
import starwarsVader from "../images/Vader1.gif";
import alertWhite from "../images/alertWhite.png";

import { nftaddress } from "../config";
import { HStack, IconImg } from "../styles/Stacks";
import { BodyRegular, CaptionRegular } from "../styles/TextStyles";
const NFTApp = () => {
  const location = useLocation();
  const navigation = useMemo(() => {
    return [
      {
        name: "Discover",
        href: "/discover",
        current: location.pathname === "/discover",
      },
      {
        name: "My NFTs",
        href: "/my-nfts",
        current: location.pathname === "/my-nfts",
      },
      {
        name: "Create an NFT",
        href: "/mint-item",
        current: location.pathname === "/mint-item",
      },
    ];
  }, [location.pathname]);

  const history = useHistory();

  const [wallet, setWallet] = useState({});
  const [theme, setTheme] = useState("light");
  const [isModal, setIsModal] = useState(false);
  const [isModalAds, setIsModalAds] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [isDevMode, setIsDevMode] = useState(true);
  // const [isNotification, setIsNotification] = useState(false);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 2));
  });

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />

        <HomeStack>
          {/* {isModal
                        ? <Modal onClickCancel = {() => setIsModal(!isModal)}></Modal>
                        : null
                    } */}

          {isModalAds ? (
            <ModalAds
              imageAd={randomNumber === 0 ? starwarsYoda : starwarsVader}
              onClickCancel={() => setIsModalAds(!isModalAds)}
              onClick={() => {
                randomNumber === 0
                  ? history.push(`/nft/${nftaddress}/1793`)
                  : history.push(`/nft/${nftaddress}/1792`);
              }}
            ></ModalAds>
          ) : null}

          {/* Devmode bottombar */}
          {isDevMode ? (
            <DevMode>
              <HStack padding="15px 21px" spacing="9px">
                <IconImg url={alertWhite} width="21px" height="21px"></IconImg>
                <CaptionRegular textcolor="white">
                  <b>
                    This Developer Page is for feature testing purposes. All
                    transactions
                  </b>
                  &nbsp; made on the developer page
                  <b> are executed on the main network, please be careful.</b>
                </CaptionRegular>
              </HStack>
            </DevMode>
          ) : null}

          <TopBar devMode={isDevMode} themeToggler={themeToggler}></TopBar>

          <ScrollView>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/discover" component={Discover}></Route>
              <Route
                exact
                path="/UserProfile/:urlAddress"
                component={MyNFT}
              ></Route>
              <Route exact path="/CreateNFT" component={CreateNft}></Route>
              <Route
                exact
                path="/collection/:collectionName"
                component={Collection}
              ></Route>
              <Route
                exact
                path="/nft/:nftaddress/:id"
                component={NFTPage}
              ></Route>
              {/* <Route
                    exact
                    path="/CreateCollection"
                    component={CreateCollection}
                ></Route> */}
              {/* <Route exact path="/Settings" component={Settings}></Route> */}
              <Route exact path="/HowToStart" component={HowToStart}></Route>

              <Route path="**" component={Home}></Route>
            </Switch>
            <Footer></Footer>
          </ScrollView>
        </HomeStack>
      </>
    </ThemeProvider>
  );
};

export default NFTApp;

const HomeStack = styled(motion.div)`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
`;

const ScrollView = styled(motion.div)`
  width: 100%;

  padding: 0px;
  margin: 0px;
`;

const DevMode = styled(motion.div)`
  background: linear-gradient(180deg, #044dc4 0%, #192ea6 100%);

  border-radius: 30px;
  position: fixed;
  z-index: 10;
  bottom: 15px;
`;
