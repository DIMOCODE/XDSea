import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg, Spacer, Divider } from "./Stacks";
import { BodyBold, CaptionBold, CaptionBoldShort } from "./TextStyles";

import arrowDown from "../images/arrowDown.png";
import verifiedBlue from "../images/verifiedBlue.png";
import filter from "../images/filter.png";

import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import useWindowSize from "../styles/useWindowSize";
import { click } from "@testing-library/user-event/dist/click";

function FilterCollections({
  clickPublication,
  clickVolume,
  clickFloor,
  clickOwners,
  clickNFTs,
  clickStatus,
}) {
  const size = useWindowSize();
  const [isPublication, setIsPublication] = useState(false);
  const togglePublication = () => setIsPublication(!isPublication);

  const [isVolume, setIsVolume] = useState(false);
  const toggleVolume = () => setIsVolume(!isVolume);

  const [isFloor, setIsFloor] = useState(false);
  const toggleFloor = () => setIsFloor(!isFloor);

  const [isOwners, setIsOwners] = useState(false);
  const toggleOwners = () => setIsOwners(!isOwners);

  const [isNFT, setIsNFT] = useState(false);
  const toggleNFT = () => setIsNFT(!isNFT);

  const [isVerified, setIsVerified] = useState(false);
  const toggleVerified = () => setIsVerified(!isVerified);

  const [showMiniModal, setShowMiniModal] = useState(false);

  const flip = {
    top: {
      rotate: 0,
    },
    down: {
      rotate: 180,
    },
  };

  const activated = {
    on: {
      opacity: 1,
      scale: 1,
    },
    off: {
      opacity: 0.3,
      scale: 0.96,
    },
  };

  return (
    <HStack padding="0 21px" style={{ zIndex: "20" }}>
      {/* Filters Computer */}
      {size.width > 1112 && (
        <HStack
          flexwrap="wrap"
          background={({ theme }) => theme.backElement}
          self="none"
          padding="6px 9px"
          border="6px"
          style={{
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Publication */}
          <VStack
            alignment="flex-start"
            minwidth="120px"
            spacing="8px"
            onTapStart={togglePublication}
            onClick={clickPublication}
            cursor="pointer"
          >
            <CaptionBoldShort>Publication</CaptionBoldShort>
            <HStack spacing="15px" self="none">
              <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                {isPublication ? "New To Old" : "Old to New"}
              </BodyBold>

              <IconImg
                cursor="pointer"
                url={arrowDown}
                width="15px"
                height="15px"
                backsize="contain"
                variants={flip}
                animate={isPublication ? "top" : "down"}
              ></IconImg>
            </HStack>
          </VStack>

          <Line></Line>

          {/* Volume Traded */}
          <VStack
            alignment="flex-start"
            minwidth="120px"
            spacing="8px"
            onTapStart={toggleVolume}
            onClick={clickVolume}
            cursor="pointer"
          >
            <CaptionBoldShort>Volume Traded</CaptionBoldShort>
            <HStack spacing="15px" self="none">
              <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                {isVolume ? "High to Low" : "Low to High"}
              </BodyBold>

              <IconImg
                cursor="pointer"
                url={arrowDown}
                width="15px"
                height="15px"
                backsize="contain"
                variants={flip}
                animate={isVolume ? "top" : "down"}
              ></IconImg>
            </HStack>
          </VStack>

          <Line></Line>

          {/* Floor Price */}
          <VStack
            alignment="flex-start"
            minwidth="140px"
            spacing="8px"
            onTapStart={toggleFloor}
            onClick={clickFloor}
            cursor="pointer"
          >
            <CaptionBoldShort>Floor Price</CaptionBoldShort>
            <HStack spacing="15px" self="none">
              <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                {isFloor ? "High to Low" : "Low to High"}
              </BodyBold>

              <IconImg
                cursor="pointer"
                url={arrowDown}
                width="15px"
                height="15px"
                backsize="contain"
                variants={flip}
                animate={isFloor ? "top" : "down"}
              ></IconImg>
            </HStack>
          </VStack>

          <Line></Line>

          {/* Owner */}
          <VStack
            alignment="flex-start"
            minwidth="120px"
            spacing="8px"
            onTapStart={toggleOwners}
            onClick={clickOwners}
            cursor="pointer"
          >
            <CaptionBoldShort>Owners</CaptionBoldShort>
            <HStack spacing="15px" self="none">
              <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                {isOwners ? "High to Low" : "Low to High"}
              </BodyBold>

              <IconImg
                cursor="pointer"
                url={arrowDown}
                width="15px"
                height="15px"
                backsize="contain"
                variants={flip}
                animate={isOwners ? "top" : "down"}
              ></IconImg>
            </HStack>
          </VStack>

          <Line></Line>

          {/* NFTs */}
          <VStack
            alignment="flex-start"
            minwidth="120px"
            spacing="8px"
            onTapStart={toggleNFT}
            onClick={clickNFTs}
            cursor="pointer"
          >
            <CaptionBoldShort>NFTs</CaptionBoldShort>
            <HStack spacing="15px" self="none">
              <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                {isNFT ? "High to Low" : "Low to High"}
              </BodyBold>

              <IconImg
                cursor="pointer"
                url={arrowDown}
                width="15px"
                height="15px"
                backsize="contain"
                variants={flip}
                animate={isNFT ? "top" : "down"}
              ></IconImg>
            </HStack>
          </VStack>
        </HStack>
      )}

      {/* Filter Button Mobile*/}
      {size.width < 1112 && (
        <>
          <HStack
            background={({ theme }) => theme.backElement}
            self="none"
            padding="6px 9px"
            border="6px"
            width="100%"
            onTapStart={() => setShowMiniModal(!showMiniModal)}
            style={{
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
            }}
          >
            <VStack
              alignment="flex-start"
              width="100%"
              height="41px"
              spacing="8px"
              cursor="pointer"
            >
              <BodyBold cursor="pointer">Collection Filters</BodyBold>
            </VStack>

            <IconImg
              url={filter}
              width="24px"
              height="24px"
              cursor="pointer"
            ></IconImg>
          </HStack>

          {showMiniModal && (
            <MiniModal style={{ zIndex: "90" }}>
              {/* Filters */}
              <HStack
                flexwrap="wrap"
                background={({ theme }) => theme.backElement}
                self="none"
                padding="15px 9px"
                border="6px"
                style={{
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
                }}
              >
                {/* Publication */}
                <VStack
                  alignment="flex-start"
                  minwidth="120px"
                  spacing="8px"
                  onTapStart={togglePublication}
                  onClick={clickPublication}
                  cursor="pointer"
                >
                  <CaptionBoldShort>Publication</CaptionBoldShort>
                  <HStack spacing="15px" self="none">
                    <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                      {isPublication ? "New To Old" : "Old to New"}
                    </BodyBold>

                    <IconImg
                      cursor="pointer"
                      url={arrowDown}
                      width="15px"
                      height="15px"
                      backsize="contain"
                      variants={flip}
                      animate={isPublication ? "top" : "down"}
                    ></IconImg>
                  </HStack>
                </VStack>

                {/* Volume Traded */}
                <VStack
                  alignment="flex-start"
                  minwidth="120px"
                  spacing="8px"
                  onTapStart={toggleVolume}
                  onClick={clickVolume}
                  cursor="pointer"
                >
                  <CaptionBoldShort>Volume Traded</CaptionBoldShort>
                  <HStack spacing="15px" self="none">
                    <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                      {isVolume ? "High to Low" : "Low to High"}
                    </BodyBold>

                    <IconImg
                      cursor="pointer"
                      url={arrowDown}
                      width="15px"
                      height="15px"
                      backsize="contain"
                      variants={flip}
                      animate={isVolume ? "top" : "down"}
                    ></IconImg>
                  </HStack>
                </VStack>

                <Divider></Divider>

                {/* Floor Price */}
                <VStack
                  alignment="flex-start"
                  minwidth="140px"
                  spacing="8px"
                  onTapStart={toggleFloor}
                  onClick={clickFloor}
                  cursor="pointer"
                >
                  <CaptionBoldShort>Floor Price</CaptionBoldShort>
                  <HStack spacing="15px" self="none">
                    <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                      {isFloor ? "High to Low" : "Low to High"}
                    </BodyBold>

                    <IconImg
                      cursor="pointer"
                      url={arrowDown}
                      width="15px"
                      height="15px"
                      backsize="contain"
                      variants={flip}
                      animate={isFloor ? "top" : "down"}
                    ></IconImg>
                  </HStack>
                </VStack>

                {/* Owner */}
                <VStack
                  alignment="flex-start"
                  minwidth="120px"
                  spacing="8px"
                  onTapStart={toggleOwners}
                  onClick={clickOwners}
                  cursor="pointer"
                >
                  <CaptionBoldShort>Owners</CaptionBoldShort>
                  <HStack spacing="15px" self="none">
                    <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                      {isOwners ? "High to Low" : "Low to High"}
                    </BodyBold>

                    <IconImg
                      cursor="pointer"
                      url={arrowDown}
                      width="15px"
                      height="15px"
                      backsize="contain"
                      variants={flip}
                      animate={isOwners ? "top" : "down"}
                    ></IconImg>
                  </HStack>
                </VStack>

                <Divider></Divider>

                {/* NFTs */}
                <VStack
                  alignment="flex-start"
                  minwidth="120px"
                  spacing="8px"
                  onTapStart={toggleNFT}
                  onClick={clickNFTs}
                  cursor="pointer"
                >
                  <CaptionBoldShort>NFTs</CaptionBoldShort>
                  <HStack spacing="15px" self="none">
                    <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                      {isNFT ? "High to Low" : "Low to High"}
                    </BodyBold>

                    <IconImg
                      cursor="pointer"
                      url={arrowDown}
                      width="15px"
                      height="15px"
                      backsize="contain"
                      variants={flip}
                      animate={isNFT ? "top" : "down"}
                    ></IconImg>
                  </HStack>
                </VStack>

                {/* Close */}
                <VStack
                  alignment="center"
                  minwidth="120px"
                  height="42px"
                  border="6px"
                  spacing="8px"
                  onTapStart={() => setShowMiniModal(false)}
                  cursor="pointer"
                  background={({ theme }) => theme.faded}
                >
                  <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                    Close Filters
                  </BodyBold>
                </VStack>
              </HStack>
            </MiniModal>
          )}
        </>
      )}

      {/* Status */}
      <HStack
        background={({ theme }) => theme.backElement}
        self="none"
        padding="6px 9px"
        border="6px"
        onTapStart={toggleVerified}
        style={{
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
        }}
      >
        <VStack
          alignment="flex-start"
          width="94px"
          spacing="8px"
          cursor="pointer"
        >
          <CaptionBoldShort>Status</CaptionBoldShort>

          <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
            {isVerified ? "Verified" : "Non Verified"}
          </BodyBold>
        </VStack>

        <IconImg
          url={verifiedBlue}
          width="24px"
          height="24px"
          variants={activated}
          animate={isVerified ? "on" : "off"}
          cursor="pointer"
        ></IconImg>
      </HStack>
    </HStack>
  );
}

export { FilterCollections };

const Line = styled(motion.div)`
  width: 2px;
  height: 26px;
  background: rgb(0, 0, 0, 0.2);
`;

const MiniModal = styled(motion.div)`
  position: absolute;
  top: 60px;
  padding: 0 21px;
  width: 100%;
  height: 197px;
`;
