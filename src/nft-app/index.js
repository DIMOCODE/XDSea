import React, { createContext, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { ThemeProvider } from "styled-components";
import { XdcConnect, Disconnect } from "xdc-connect";

import { GlobalStyles } from "../GlobalStyle";
import { lightTheme, darkTheme } from "../themes";
import { isXdc, fromXdc } from '../common/common';
import ScrollToTop from '../common/scrollToTop';

import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { Home } from './Home'
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


const NFTApp = () => {
    const location = useLocation();
    const navigation = useMemo(() => {
        return [
            { name: 'Discover', href: '/discover', current: location.pathname === '/discover' },
            { name: 'My NFTs', href: '/my-nfts', current: location.pathname === '/my-nfts' },
            { name: 'Create an NFT', href: '/mint-item', current: location.pathname === '/mint-item' }
        ]
    }, [location.pathname]);

    const history = useHistory()

    const [wallet, setWallet] = useState({});
    const [theme, setTheme] = useState("light");
    const [isModal, setIsModal] = useState(false);
    // const [isNotification, setIsNotification] = useState(false);

    const themeToggler = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    };

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <>
                <GlobalStyles/>
                <HomeStack>
                    {isModal
                        ? <Modal onClickCancel = {() => setIsModal(!isModal)}></Modal>
                        : null
                    }

                    <TopBar themeToggler={themeToggler}></TopBar>

                    <ScrollView>
                        <Switch>
                            <Route exact path="/" component={Home}></Route>
                            <Route exact path="/discover" component={Discover}></Route>
                            {/* <Route exact path="/UserProfile" component={UserProfile}></Route> */}
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
  width: 100vw;
`;

const ScrollView = styled(motion.div)`
  width: 100%;
  padding: 0px;
  margin: 0px;
`;