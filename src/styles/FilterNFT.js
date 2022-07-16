import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg, Spacer, Divider } from "./Stacks";
import { BodyBold, CaptionBold, CaptionBoldShort } from "./TextStyles";

import arrowDown from "../images/arrowDown.png";
import verifiedBlue from "../images/verifiedBlue.png";
import filter from "../images/filter.png";
import all from "../images/all.png";
import notforsale from "../images/notforsale.png";
import relist from "../images/relist.png";
import sold from "../images/sold.png";
import sale from "../images/sale.png";

import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import useWindowSize from "../styles/useWindowSize";
import { click } from "@testing-library/user-event/dist/click";
import { InputStyled } from "./InputStyled";

function FilterNFT({
  clickPublication,
  clickPrice,
  clickOffers,
  clickRange,
  clickStatus,
  clickAll,
  clickSale,
  clickSold,
  clickRelist,
  clickNFS,
}) {
  const size = useWindowSize();

  const [isRange, setIsRange] = useState(false);

  const [isSaleType, setIsSaleType] = useState(0);

  const [isPublication, setIsPublication] = useState(false);
  const togglePublication = () => setIsPublication(!isPublication);

  const [isPrice, setIsPrice] = useState(false);
  const togglePrice = () => setIsPrice(!isPrice);

  const [isOffers, setIsOffers] = useState(false);
  const toggleOffers = () => setIsOffers(!isOffers);

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
    <HStack responsive="true" padding="0 21px">
      {/* Filters Computer */}
      {size.width > 425 && (
        <>
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
            {/* Range */}

            <VStack
              alignment="flex-start"
              minwidth="120px"
              spacing="8px"
              onTapStart={() => setIsRange(true)}
              onClick={clickRange}
              cursor="pointer"
            >
              <CaptionBoldShort>Range</CaptionBoldShort>
              <HStack spacing="15px" self="none">
                <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                  Set Range
                </BodyBold>

                <IconImg
                  cursor="pointer"
                  url={arrowDown}
                  width="15px"
                  height="15px"
                  backsize="contain"
                ></IconImg>
              </HStack>
            </VStack>

            {isRange && (
              <RangeModal>
                <VStack
                  background={({ theme }) => theme.backElement}
                  padding="9px"
                  border="9px"
                  width="260px"
                  style={{
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <HStack>
                    <InputStyled
                      background={({ theme }) => theme.faded}
                      placeholder="from"
                    ></InputStyled>
                    <InputStyled
                      background={({ theme }) => theme.faded}
                      placeholder="to"
                    ></InputStyled>
                  </HStack>
                  <HStack>
                    <VStack
                      alignment="center"
                      height="42px"
                      border="6px"
                      spacing="8px"
                      onClick={() => setIsRange(false)}
                      cursor="pointer"
                      background={({ theme }) => theme.faded}
                    >
                      <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                        Close Filters
                      </BodyBold>
                    </VStack>

                    <VStack
                      alignment="center"
                      height="42px"
                      border="6px"
                      spacing="8px"
                      onClick={() => setIsRange(false)}
                      cursor="pointer"
                      background={({ theme }) => theme.faded}
                    >
                      <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                        Apply
                      </BodyBold>
                    </VStack>
                  </HStack>
                </VStack>
              </RangeModal>
            )}

            <Line></Line>
            {/* Publication */}
            <VStack
              alignment="flex-start"
              minwidth="120px"
              spacing="8px"
              onTapStart={togglePublication}
              onClick={clickPublication}
              cursor="pointer"
              style={{ zIndex: 10 }}
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

            {/* Price */}
            <VStack
              alignment="flex-start"
              minwidth="140px"
              spacing="8px"
              onTapStart={togglePrice}
              onClick={clickPrice}
              cursor="pointer"
            >
              <CaptionBoldShort>Price</CaptionBoldShort>
              <HStack spacing="15px" self="none">
                <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                  {isPrice ? "Hight to Low" : "Low to High"}
                </BodyBold>

                <IconImg
                  cursor="pointer"
                  url={arrowDown}
                  width="15px"
                  height="15px"
                  backsize="contain"
                  variants={flip}
                  animate={isPrice ? "top" : "down"}
                ></IconImg>
              </HStack>
            </VStack>

            <Line></Line>

            {/* Offers */}
            <VStack
              alignment="flex-start"
              minwidth="120px"
              spacing="8px"
              onTapStart={toggleOffers}
              onClick={clickOffers}
              cursor="pointer"
            >
              <CaptionBoldShort>Offers Amount</CaptionBoldShort>
              <HStack spacing="15px" self="none">
                <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                  {isOffers ? "High to Low" : "Low to High"}
                </BodyBold>

                <IconImg
                  cursor="pointer"
                  url={arrowDown}
                  width="15px"
                  height="15px"
                  backsize="contain"
                  variants={flip}
                  animate={isOffers ? "top" : "down"}
                ></IconImg>
              </HStack>
            </VStack>
          </HStack>

          <HStack
            background={({ theme }) => theme.backElement}
            self="none"
            padding="6px 9px"
            border="6px"
            width="auto"
            onTapStart={() => setShowMiniModal(true)}
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
              <BodyBold cursor="pointer">Sale Type</BodyBold>
            </VStack>

            <IconImg
              url={all}
              width="33px"
              height="33px"
              cursor="pointer"
              whileTap={() => setIsSaleType(0)}
              onClick={clickAll}
              variants={activated}
              animate={isSaleType === 0 ? "on" : "off"}
            ></IconImg>

            <IconImg
              url={sale}
              width="33px"
              height="33px"
              cursor="pointer"
              whileTap={() => setIsSaleType(1)}
              onClick={clickSale}
              variants={activated}
              animate={isSaleType === 1 ? "on" : "off"}
            ></IconImg>

            <IconImg
              url={sold}
              width="33px"
              height="33px"
              cursor="pointer"
              whileTap={() => setIsSaleType(2)}
              onClick={clickSold}
              variants={activated}
              animate={isSaleType === 2 ? "on" : "off"}
            ></IconImg>

            <IconImg
              url={relist}
              width="33px"
              height="33px"
              cursor="pointer"
              whileTap={() => setIsSaleType(3)}
              onClick={clickRelist}
              variants={activated}
              animate={isSaleType === 3 ? "on" : "off"}
            ></IconImg>

            <IconImg
              url={notforsale}
              width="33px"
              height="33px"
              cursor="pointer"
              whileTap={() => setIsSaleType(4)}
              onClick={clickNFS}
              variants={activated}
              animate={isSaleType === 4 ? "on" : "off"}
            ></IconImg>
          </HStack>
        </>
      )}

      <HStack>
        {/* Filter Button Mobile*/}
        {size.width < 425 && (
          <>
            <HStack
              background={({ theme }) => theme.backElement}
              self="none"
              padding="6px 9px"
              border="6px"
              width="100%"
              onTapStart={() => setShowMiniModal(true)}
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
                <BodyBold cursor="pointer">NFT Filters</BodyBold>
              </VStack>

              <IconImg
                url={filter}
                width="24px"
                height="24px"
                cursor="pointer"
              ></IconImg>
            </HStack>
            {showMiniModal && (
              <MiniModal>
                <VStack
                  background={({ theme }) => theme.backElement}
                  border="6px"
                  padding="9px"
                  style={{
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <HStack flexwrap="wrap" padding="6px 9px" width="100%">
                    {/* Range */}

                    <VStack
                      alignment="flex-start"
                      minwidth="120px"
                      spacing="8px"
                      onTapStart={() => setIsRange(true)}
                      onClick={clickRange}
                      cursor="pointer"
                    >
                      <CaptionBoldShort>Range</CaptionBoldShort>
                      <HStack spacing="15px" self="none">
                        <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                          Set Range
                        </BodyBold>

                        <IconImg
                          cursor="pointer"
                          url={arrowDown}
                          width="15px"
                          height="15px"
                          backsize="contain"
                        ></IconImg>
                      </HStack>
                    </VStack>

                    {isRange && (
                      <RangeModal>
                        <VStack
                          background={({ theme }) => theme.backElement}
                          padding="9px"
                          border="9px"
                          width="100%"
                          style={{
                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <HStack>
                            <InputStyled
                              background={({ theme }) => theme.faded}
                              placeholder="from"
                            ></InputStyled>
                            <InputStyled
                              background={({ theme }) => theme.faded}
                              placeholder="to"
                            ></InputStyled>
                          </HStack>
                          <HStack>
                            <VStack
                              alignment="center"
                              height="42px"
                              border="6px"
                              spacing="8px"
                              onClick={() => setIsRange(false)}
                              cursor="pointer"
                              background={({ theme }) => theme.faded}
                            >
                              <BodyBold
                                animate={{ opacity: 0.6 }}
                                cursor="pointer"
                              >
                                Close Filters
                              </BodyBold>
                            </VStack>

                            <VStack
                              alignment="center"
                              height="42px"
                              border="6px"
                              spacing="8px"
                              onClick={() => setIsRange(false)}
                              cursor="pointer"
                              background={({ theme }) => theme.faded}
                            >
                              <BodyBold
                                animate={{ opacity: 0.6 }}
                                cursor="pointer"
                              >
                                Apply
                              </BodyBold>
                            </VStack>
                          </HStack>
                        </VStack>
                      </RangeModal>
                    )}

                    {/* Publication */}
                    <VStack
                      alignment="flex-start"
                      minwidth="120px"
                      spacing="8px"
                      onTapStart={togglePublication}
                      onClick={clickPublication}
                      cursor="pointer"
                      style={{ zIndex: 10 }}
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

                    {/* Price */}
                    <VStack
                      alignment="flex-start"
                      minwidth="140px"
                      spacing="8px"
                      onTapStart={togglePrice}
                      onClick={clickPrice}
                      cursor="pointer"
                    >
                      <CaptionBoldShort>Price</CaptionBoldShort>
                      <HStack spacing="15px" self="none">
                        <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                          {isPrice ? "Hight to Low" : "Low to High"}
                        </BodyBold>

                        <IconImg
                          cursor="pointer"
                          url={arrowDown}
                          width="15px"
                          height="15px"
                          backsize="contain"
                          variants={flip}
                          animate={isPrice ? "top" : "down"}
                        ></IconImg>
                      </HStack>
                    </VStack>

                    {/* Offers */}
                    <VStack
                      alignment="flex-start"
                      minwidth="120px"
                      spacing="8px"
                      onTapStart={toggleOffers}
                      onClick={clickOffers}
                      cursor="pointer"
                    >
                      <CaptionBoldShort>Offers Amount</CaptionBoldShort>
                      <HStack spacing="15px" self="none">
                        <BodyBold animate={{ opacity: 0.6 }} cursor="pointer">
                          {isOffers ? "High to Low" : "Low to High"}
                        </BodyBold>

                        <IconImg
                          cursor="pointer"
                          url={arrowDown}
                          width="15px"
                          height="15px"
                          backsize="contain"
                          variants={flip}
                          animate={isOffers ? "top" : "down"}
                        ></IconImg>
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack
                    background={({ theme }) => theme.backElement}
                    padding="6px 9px"
                    width="100%"
                    onTapStart={() => setShowMiniModal(true)}
                  >
                    <VStack
                      alignment="flex-start"
                      width="100%"
                      height="41px"
                      spacing="8px"
                      cursor="pointer"
                    >
                      <BodyBold cursor="pointer">Sale Type</BodyBold>
                    </VStack>

                    <IconImg
                      url={all}
                      width="33px"
                      height="33px"
                      cursor="pointer"
                      whileTap={() => setIsSaleType(0)}
                      onClick={clickAll}
                      variants={activated}
                      animate={isSaleType === 0 ? "on" : "off"}
                    ></IconImg>

                    <IconImg
                      url={sale}
                      width="33px"
                      height="33px"
                      cursor="pointer"
                      whileTap={() => setIsSaleType(1)}
                      onClick={clickSale}
                      variants={activated}
                      animate={isSaleType === 1 ? "on" : "off"}
                    ></IconImg>

                    <IconImg
                      url={sold}
                      width="33px"
                      height="33px"
                      cursor="pointer"
                      whileTap={() => setIsSaleType(2)}
                      onClick={clickSold}
                      variants={activated}
                      animate={isSaleType === 2 ? "on" : "off"}
                    ></IconImg>

                    <IconImg
                      url={relist}
                      width="33px"
                      height="33px"
                      cursor="pointer"
                      whileTap={() => setIsSaleType(3)}
                      onClick={clickRelist}
                      variants={activated}
                      animate={isSaleType === 3 ? "on" : "off"}
                    ></IconImg>

                    <IconImg
                      url={notforsale}
                      width="33px"
                      height="33px"
                      cursor="pointer"
                      whileTap={() => setIsSaleType(4)}
                      onClick={clickNFS}
                      variants={activated}
                      animate={isSaleType === 4 ? "on" : "off"}
                    ></IconImg>
                  </HStack>

                  <VStack
                    alignment="center"
                    width="100%"
                    minheight="42px"
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
                </VStack>
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
    </HStack>
  );
}

export { FilterNFT };

const Line = styled(motion.div)`
  width: 2px;
  height: 26px;
  background: rgb(0, 0, 0, 0.2);
`;

const MiniModal = styled(motion.div)`
  position: absolute;
  top: 60px;

  width: 100%;
  height: auto;

  z-index: 100;
`;

const RangeModal = styled(motion.div)`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
`;
