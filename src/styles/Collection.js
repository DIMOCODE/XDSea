import React from "react";
import { useState } from "react";
import { IconImg, VStack, Spacer, ZStack, ZItem } from "./Stacks";
import { appStyle } from "./AppStyles";
import {
  BodyRegular,
  CaptionBold,
  CaptionBoldShort,
  TitleBold21,
} from "./TextStyles";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { fromXdc, isXdc } from "../common/common";

function Collection(props) {
  const {
    // floorprice,
    // owners,
    // nfts,
    // volumetraded,
    collectionImage,
    creatorLogo,
    collectionName,
    collectionDescription,
    onClickCollection,
    onClickCreator,
    creatorName,
    keyContent,
    keyID,
  } = props;

  const scaleImage = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        bounce: 0.15,
      },
    },
  };
  const scaleContainer = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        bounce: 0.15,
      },
    },
  };
  const background = {
    initial: {
      background:
        "linear-gradient(359.63deg, rgba(2, 2, 2, 0.74) 5.27%, rgba(2, 2, 2, 0.602581) 20.13%, rgba(2, 2, 2, 0) 40.93%)",
    },
    hover: {
      transition: {
        type: "spring",
        bounce: 0.15,
      },
      background:
        "linear-gradient(359.63deg, rgba(2, 2, 2, 0.74) 5.27%, rgba(2, 2, 2, 0.74) 20.13%, rgba(2, 2, 2, 0.74) 40.93%)",
    },
  };
  const [isVisible, setIsVisible] = useState(false);

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  return (
    <VStack
      animate={isVisible ? "hover" : "initial"}
      variants={scaleContainer}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
      overflow="hidden"
      border="15px"
      background={({ theme }) => theme.backElement}
      onClick={onClickCollection}
    >
      <ZStack>
        <ZItem>
          <ZItem>
            <IconImg
              url={collectionImage}
              width="310px"
              height="100%"
              border="15px"
              backsize="cover"
              animate={isVisible ? "initial" : "hover"}
              variants={scaleImage}
            ></IconImg>
          </ZItem>
        </ZItem>
        <ZItem>
          <AnimatePresence>
            <VStack
              spacing="0"
              padding="21px"
              // animate={isVisible ? "hover" : "initial"}
              variants={background}
              cursor={"pointer"}
            >
              <VStack
                cursor={"pointer"}
                key={keyID}
                initial={{
                  y: 150,
                  x: 0,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                layout
                width="100%"
              >
                <Spacer></Spacer>
                <motion.div layout="position" cursor={"pointer"}>
                  <VStack spacing="6px" cursor={"pointer"}>
                    <IconImg
                      url={creatorLogo}
                      width="60px"
                      height="60px"
                      border="60px"
                      bordercolor="white"
                      bordersize="3px"
                      backsize="cover"
                      onClick={onClickCreator}
                      cursor={"pointer"}
                    ></IconImg>
                    <CaptionBold textcolor={appStyle.colors.white}>
                      CREATOR
                    </CaptionBold>
                    <CaptionBoldShort
                      cursor={"pointer"}
                      textcolor={appStyle.colors.white}
                    >
                      {truncateAddress(
                        isXdc(creatorName) ? fromXdc(creatorName) : creatorName
                      )}
                    </CaptionBoldShort>
                    <TitleBold21
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}
                      width={"250px"}
                      textOverflow={"ellipsis"}
                      textAlign={"center"}
                    >
                      {collectionName || "Collection Name"}
                    </TitleBold21>
                    <VStack
                      key={keyContent}
                      initial={{
                        y: 150,
                        x: 0,
                        opacity: 0,
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          bounce: 0.15,
                        },
                      }}
                      exit={{
                        y: -150,
                        opacity: 0,
                      }}
                      layout
                      width="100%"
                    >
                      <VStack width="100%">
                        <BodyRegular
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          width={"250px"}
                          textOverflow={"ellipsis"}
                          align="center"
                          textcolor={appStyle.colors.white}
                          cursor={"pointer"}
                        >
                          {collectionDescription || null}
                        </BodyRegular>
                        {/* <HStack spacing="6px" width="450px">
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
                                {Number(volumetraded) || "0"}
                              </BodyBold>
                            </HStack>
                            <CaptionBoldShort
                              textcolor={appStyle.colors.white}
                              align="center"
                            >
                              Volume Traded
                            </CaptionBoldShort>
                          </VStack>
                        </HStack> */}
                        {/* <ButtonApp
                          height="39px"
                          background={appStyle.colors.blue}
                          text="Visit Collection"
                          textcolor={appStyle.colors.white}
                          onClick={onClickCollection}
                          cursor={"pointer"}
                          btnStatus={0}
                        ></ButtonApp> */}
                      </VStack>
                    </VStack>
                  </VStack>
                </motion.div>
              </VStack>
            </VStack>
          </AnimatePresence>
        </ZItem>
      </ZStack>
    </VStack>
  );
}

export { Collection };
