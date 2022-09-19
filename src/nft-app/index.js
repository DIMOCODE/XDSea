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
  const size = useWindowSize();

  const [wallet, setWallet] = useState({});
  const [theme, setTheme] = useState("light");
  const [isDevMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [xdcPrice, setXdcPrice] = useState(0);

  /**
   * Toggle the theme from light to dark
   */
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  /**
   * Update the state with the wallet information
   *
   * @param {*} connectedWallet the wallet object
   */
  const handleWallet = (connectedWallet) => {
    setWallet(connectedWallet);
  };

  /**
   * Get the USD Price for XDC
   */
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
  };

  /**
   * React Hook to initialise Google Analytics and get the USD prices
   */
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    getXDCPrice();
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <HomeStack>
          {isDevMode ? (
            <DevMode>
              <HStack padding="15px 21px" spacing="9px">
                <IconImg url={alertWhite} width="21px" height="21px"></IconImg>
                <CaptionRegular textcolor="white">
                  <b>
                    This Developer Page is for feature testing purposes. All
                    transactions
                  </b>
                  &nbsp;made on the developer page
                  <b>
                    {" "}
                    are executed on the test network. They will not affect your
                    XDC balance.
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
                render={() => (
                  <Home
                    xdc={xdcPrice}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/discover/:mode"
                render={() => (
                  <Discover
                    xdc={xdcPrice}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/SearchPage"
                render={() => (
                  <SearchPage
                    xdc={xdcPrice}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/user/:userId"
                render={() => (
                  <MyNFT
                    redirect={NavigateTo}
                    showMenu={showMenu}
                    wallet={wallet}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/create-nft"
                render={() => (
                  <CreateNft
                    wallet={wallet}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/collection/:collectionNickName"
                render={() => (
                  <Collection
                    xdc={xdcPrice}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/nft/:nftaddress/:id"
                render={() => (
                  <NFTPage
                    wallet={wallet}
                    xdc={xdcPrice}
                    redirect={NavigateTo}
                    showMenu={showMenu}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/how-to-start"
                render={() => (
                  <HowToStart redirect={NavigateTo} showMenu={showMenu} />
                )}
              ></Route>
              <Route
                path="**"
                render={() => (
                  <Home redirect={NavigateTo} showMenu={showMenu} />
                )}
              ></Route>
            </Switch>
            <Footer
              style={{ zIndex: -400 }}
              redirect={NavigateTo}
            ></Footer>
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
  background: linear-gradient(
    180deg,
    #f1eff0 20.8%,
    #efeff1 32.39%,
    #dce0ef 51.62%,
    #c7d0d7 64.26%,
    #dce3e8 85.56%,
    #f8fbfd 100%
  );
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
