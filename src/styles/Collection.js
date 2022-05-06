import React from "react";
import { useState } from "react";
import { IconImg, VStack, HStack, Spacer, ZStack, ZItem } from "./Stacks";
import { appStyle } from "./AppStyles";

import miniXdcLogo from "../images/miniXdcLogo.png";
import {
  BodyBold,
  BodyRegular,
  CaptionBold,
  CaptionBoldShort,
  TitleBold21,
} from "./TextStyles";
import ButtonApp from "./Buttons";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";

function Collection(props) {
  const {
    floorprice,
    owners,
    nfts,
    volumetraded,
    collectionImage,
    creatorLogo,
    collectionName,
    collectionDescription,
    onClickCollection,
    onClickCreator,
    creatorName,
  } = props;
  const scaleImage = {
    initial: {
      scale: 1,
    },

    hover: {
      scale: 1.05,
    },
  };

  const scaleContainer = {
    initial: {
      scale: 1,
    },

    hover: {
      scale: 1.02,
    },
  };

  const creator = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 0 },
  };

  const [isVisible, setIsVisible] = useState(false);

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  return (
    <LayoutGroup id="CollectionAnimation">
      <AnimatePresence>
        <VStack
          animate={isVisible ? "hover" : "initial"}
          variants={scaleContainer}
          onHoverStart={() => setIsVisible((isVisible) => !isVisible)}
          onHoverEnd={() => setIsVisible((isVisible) => !isVisible)}
          overflow="hidden"
          border="15px"
          background={({ theme }) => theme.backElement}
        >
          <ZStack>
            <ZItem>
              <ZItem>
                <IconImg
                  url={collectionImage}
                  width="500px"
                  height="100%"
                  border="15px"
                  backsize="cover"
                  animate={isVisible ? "hover" : "initial"}
                  variants={scaleImage}
                ></IconImg>
              </ZItem>
            </ZItem>
            {isVisible ? (
              <ZItem>
                <VStack
                  padding="26px 26px"
                  height="100%"
                  background={appStyle.colors.darkgrey90}
                >
                  <motion.div whileTap={onClickCreator}>
                    <IconImg
                      url={creatorLogo}
                      width="60px"
                      height="60px"
                      border="60px"
                      bordercolor="white"
                      bordersize="3px"
                    ></IconImg>
                  </motion.div>

                  <VStack spacing="3px">
                    <CaptionBold textcolor={appStyle.colors.white}>
                      CREATOR
                    </CaptionBold>
                    <CaptionBoldShort textcolor={appStyle.colors.white}>
                      {truncateAddress(creatorName)}
                    </CaptionBoldShort>
                  </VStack>
                  <TitleBold21
                    display={"-webkit-box"}
                    overflow={"hidden"}
                    clamp={"1"}
                    orient={"vertical"}
                  >
                    {collectionName || "Collection Name"}
                  </TitleBold21>
                  <BodyRegular
                    display={"-webkit-box"}
                    overflow={"hidden"}
                    clamp={"1"}
                    orient={"vertical"}
                    align="center"
                    textcolor={appStyle.colors.white}
                  >
                    {collectionDescription || "Collection Description"}
                  </BodyRegular>
                  <HStack spacing="6px">
                    <VStack
                      spacing="9px"
                      border="9px"
                      padding="18px 0"
                      background={appStyle.colors.white30}
                    >
                      <HStack spacing="6px">
                        <IconImg
                          url={miniXdcLogo}
                          width="18px"
                          height="18px"
                        ></IconImg>
                        <BodyBold textcolor={appStyle.colors.white}>
                          {floorprice || "0"}
                        </BodyBold>
                      </HStack>{" "}
                      <CaptionBoldShort textcolor={appStyle.colors.white}>
                        Floor Price
                      </CaptionBoldShort>
                    </VStack>

                    <VStack
                      border="9px"
                      padding="18px 0"
                      spacing="9px"
                      background={appStyle.colors.white30}
                    >
                      <BodyBold textcolor={appStyle.colors.white}>
                        {owners || "0"}
                      </BodyBold>{" "}
                      <CaptionBoldShort textcolor={appStyle.colors.white}>
                        Owners
                      </CaptionBoldShort>
                    </VStack>

                    <VStack
                      border="9px"
                      padding="18px 0"
                      background={appStyle.colors.white30}
                      spacing="9px"
                    >
                      <BodyBold textcolor={appStyle.colors.white}>
                        {nfts || "0"}
                      </BodyBold>
                      <CaptionBoldShort textcolor={appStyle.colors.white}>
                        NFT's
                      </CaptionBoldShort>{" "}
                    </VStack>

                    <VStack
                      border="9px"
                      padding="18px 0"
                      background={appStyle.colors.white30}
                      spacing="9px"
                    >
                      <HStack spacing="6px">
                        <IconImg
                          url={miniXdcLogo}
                          width="18px"
                          height="18px"
                        ></IconImg>
                        <BodyBold textcolor={appStyle.colors.white}>
                          {volumetraded || "0"}
                        </BodyBold>
                      </HStack>
                      <CaptionBoldShort
                        textcolor={appStyle.colors.white}
                        align="center"
                      >
                        Volume Traded
                      </CaptionBoldShort>
                    </VStack>
                  </HStack>
                  <ButtonApp
                    height="39px"
                    background={appStyle.colors.blue}
                    text="Visit Collection"
                    textcolor={appStyle.colors.white}
                    onClick={onClickCollection}
                    cursor={"pointer"}
                  ></ButtonApp>
                </VStack>
              </ZItem>
            ) : (
              <ZItem>
                <VStack
                  padding="30px"
                  background="linear-gradient(180.3deg, rgba(0, 0, 0, 0) 64.14%, rgba(0, 0, 0, 0.3) 78.31%, #000000 96.66%)"
                >
                  <Spacer></Spacer>
                  <motion.div whileTap={onClickCreator}>
                    <IconImg
                      url={creatorLogo}
                      width="60px"
                      height="60px"
                      border="60px"
                      bordercolor="white"
                      bordersize="3px"
                    ></IconImg>
                  </motion.div>
                  <TitleBold21
                    display={"-webkit-box"}
                    overflow={"hidden"}
                    clamp={"1"}
                    orient={"vertical"}
                  >
                    {collectionName || "Collection Name"}
                  </TitleBold21>
                </VStack>
              </ZItem>
            )}
          </ZStack>
        </VStack>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { Collection };
