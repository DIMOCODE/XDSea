import React from "react";
import { IconImg, VStack, HStack, Spacer } from "../../styles/Stacks";
import { Tooltip } from "@mui/material";
import {
  CaptionBold,
  CaptionBoldShort,
  TitleBold18,
  BodyRegular,
} from "../../styles/TextStyles";
import verified from "../../images/verified.png";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { CollectionStats } from "./CollectionStats";
import { LoopBars } from "../../styles/LoopBars";

function BannerMobile(props) {
  const {
    collectionImage,
    onClickCreator,
    tooltip,
    addressCreator,
    isVerified,
    collectionName,
    owners,
    nftCount,
    floorPrice,
    volumeTrade,
  } = props;
  return (
    <VStack padding="90px 12px 0 12px" alignment="flex-start">
      <HStack>
        <IconImg
          url={collectionImage}
          width="69px"
          height="69px"
          border="9px"
          bordersize="3px"
          bordercolor="white"
          backsize="cover"
          style={{
            boxShadow: "0px 3px 9px 0px rgba(0, 0, 0, 0.3)",
          }}
        ></IconImg>

        <CreatorAbsolute>
          <HStack
            onClick={onClickCreator}
            border="0 6px 6px 0"
            padding="6px 9px"
            height="42px"
            style={{
              boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
            }}
            cursor={"pointer"}
            background={({ theme }) => theme.backElement}
          >
            <VStack spacing="0px" alignment="flex-start" cursor={"pointer"}>
              <CaptionBold textcolor={({ theme }) => theme.text}>
                CREATOR
              </CaptionBold>
              <HStack spacing="6px">
                <Tooltip title={tooltip}>
                  <CaptionBold textcolor={({ theme }) => theme.text}>
                    {addressCreator}
                  </CaptionBold>
                </Tooltip>

                {isVerified ? (
                  <IconImg
                    cursor={"pointer"}
                    url={verified}
                    width="15px"
                    height="15px"
                  ></IconImg>
                ) : null}
              </HStack>
            </VStack>
          </HStack>
        </CreatorAbsolute>

        <Spacer></Spacer>
        <HStack
          justify="flex-start"
          border="30px"
          padding="0 15px"
          spacing="15px"
          height="42px"
          self="none"
          background={({ theme }) => theme.backElement}
        >
          <CaptionBoldShort>SHARE</CaptionBoldShort>
        </HStack>
      </HStack>

      {/* Collection Name */}
      <VStack
        background={({ theme }) => theme.walletButton}
        padding="6px 15px"
        border="9px"
        spacing="3px"
        style={{
          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
        }}
        alignment="flex-start"
      >
        <CaptionBold initial={{ opacity: 0.6 }} textcolor="white">
          COLLECTION
        </CaptionBold>

        <TitleBold18 align="center" textcolor={({ theme }) => theme.walletText}>
          {collectionName}
        </TitleBold18>
      </VStack>
      <CollectionStats
        owners={owners}
        nftsCount={nftCount}
        floorPrice={floorPrice}
        volumeTrade={volumeTrade}
        width="100%"
      ></CollectionStats>
    </VStack>
  );
}

export { BannerMobile };

const CreatorAbsolute = styled(motion.div)`
  position: absolute;
  top: 12px;
  left: 69px;
`;
