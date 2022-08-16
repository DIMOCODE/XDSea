import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../GlobalStyle";
import { lightTheme, darkTheme } from "../themes";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { Home } from "./Home";
import { Discover } from "./Discover";
import MyNFT from "./MyNFT";
import { CreateNft } from "./CreateNft";
import Collection from "./Collection";
import NFTPage from "./NFTPage";
import { ModalAds } from "../ModalAds";
import { HowToStart } from "../HowToStart";
import alertWhite from "../images/alertWhite.png";
import { nftaddress } from "../config";
import { HStack, IconImg } from "../styles/Stacks";
import { CaptionRegular } from "../styles/TextStyles";
import useWindowSize from "../styles/useWindowSize";
import { sizeWidth } from "@mui/system";
import ReactGA from "react-ga";
import { SearchPage } from "./Search/SearchPage";
import { createRequest } from "../API";
import { HTTP_METHODS } from "../constant";
const TRACKING_ID = "UA-105859386-2"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const NFTApp = () => {
  const history = useHistory();
  const [wallet, setWallet] = useState({});
  const [theme, setTheme] = useState("light");
  const [isModalAds, setIsModalAds] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [isDevMode] = useState(false);
  const size = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);
  const [xdcPrice, setXdcPrice] = useState(0);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const handleWallet = (connectedWallet) => {
    setWallet(connectedWallet);
  };

  const getXDCPrice = async () => {
    const price = await (
      await createRequest(HTTP_METHODS.get, "ping/xdcPrice", null, null)
    ).data;
    setXdcPrice(price);
  };

  /**
   * Redirect the user to a specific path
   * 
   * @param {string} route path to redirect to
   */
   const NavigateTo = (route) => {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    getXDCPrice();
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <HomeStack>
          {isModalAds ? (
            <ModalAds
              // imageAd={randomNumber === 0 ? starwarsYoda : starwarsVader}
              onClickCancel={() => setIsModalAds(!isModalAds)}
              onClick={() => {
                randomNumber === 0
                  ? NavigateTo(`/nft/${nftaddress}/1793`)
                  : NavigateTo(`/nft/${nftaddress}/1792`);
              }}
            ></ModalAds>
          ) : null}
          {isDevMode ? (
            <DevMode>
              <HStack padding="15px 21px" spacing="9px">
                <IconImg
                  url={alertWhite}
                  width="21px"
                  height="21px"
                ></IconImg>
                <CaptionRegular textcolor="white">
                  <b>
                    This Developer Page is for feature testing purposes. All
                    transactions
                  </b>
                  &nbsp;made on the developer page
                  <b>
                    {" "}
                    are executed on the test network. They will not affect
                    your XDC balance.
                  </b>
                </CaptionRegular>
              </HStack>
            </DevMode>
          ) : null}

          {/* This is the main TopBar of the website */}
          <TopBar
            device={
              size.width > 1024
                ? "computer"
                : size.width > 768
                ? "tablet"
                : size.width > 425
                ? "phone"
                : "phone"
            }
            onWalletChange={handleWallet}
            devMode={!isDevMode}
            themeToggler={themeToggler}
            redirect={NavigateTo}
            showMenu={showMenu}
          ></TopBar>

          {/* This is where all the content of the site is rendering */}

          <ScrollView>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Home xdc={xdcPrice} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/discover"
                render={() => <Discover xdc={xdcPrice} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/SearchPage"
                render={() => <SearchPage xdc={xdcPrice} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/UserProfile/:userId"
                render={() => <MyNFT redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/CreateNFT"
                render={() => <CreateNft wallet={wallet} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/collection/:collectionNickName"
                render={() => <Collection xdc={xdcPrice} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route
                exact
                path="/nft/:nftaddress/:id"
                render={() => <NFTPage wallet={wallet} xdc={xdcPrice} redirect={NavigateTo} showMenu={showMenu} />}
              ></Route>
              <Route exact path="/HowToStart" render={ () => <HowToStart redirect={NavigateTo} showMenu={showMenu} />}></Route>
              <Route path="**" render={() => <Home redirect={NavigateTo} showMenu={showMenu} />}></Route>
            </Switch>
            <Footer redirect={NavigateTo} ></Footer>
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
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.background};
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
