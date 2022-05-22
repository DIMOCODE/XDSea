import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { XdcConnect, Disconnect } from "xdc-connect";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import ButtonApp from "../../styles/Buttons";
import { BodyBold, CaptionRegular } from "../../styles/TextStyles";
import XDSealogo from "../../images/LogoXDSEA.png";
import { WalletButton } from "../../styles/walletButton";
import { fromXdc, isXdc } from "../../common/common";
import { SwitchButton } from "../../styles/SwitchButton";
import { motion } from "framer-motion/dist/framer-motion";
import { UserMenuButton } from "./UserMenuButton";
import { appStyle } from "../../styles/AppStyles";
import "../../styles/App.css";

function TopBar(props) {
  const { themeToggler, devMode, onWalletChange } = props;
  const history = useHistory();
  const [wallet, setWallet] = useState({});

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  return (
    <ContentBar>
      <HStack height="90px" width="1200px">
        <HStack onClick={() => NavigateTo('')} cursor={"pointer"}>
          <IconImg url={XDSealogo} width="66px" height="66px" cursor={"pointer"}></IconImg>
          <VStack cursor={"pointer"} spacing="1px" alignment="flex-start">
            <BodyBold textcolor={({ theme }) => theme.text}>XDSea</BodyBold>
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
          btnClass={`walletConnect ${wallet?.connected ? "hide" : ""}`}
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
        {wallet?.connected ? 
          <UserMenuButton
            clickOnUser={() => NavigateTo(`UserProfile/${isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address}`)}
            wallet={wallet}
          ></UserMenuButton>
          : null
        }
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
  z-index: 9;
`;
