import React from "react";
import { useRef } from "react";
import { HStack, IconImg, VStack, Spacer } from "./Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  CaptionRegular,
} from "./TextStyles";
import arrowDown from "../images/arrowDown.png";
import { useState } from "react";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import { useClickAway } from "react-use";
import useWindowSize from "./useWindowSize";

function SortButtonNFTS(props) {
  const { onChange, params } = props;
  const ref = useRef(null);
  useClickAway(ref, () => {
    setIsActive(false);
  });

  const size = useWindowSize();
  const [isActive, setIsActive] = useState(false);
  const [isSelected, setIsSelected] = useState(0);
  const [isOld, setIsOld] = useState(false);
  const [isTopPrice, setIsTopPrice] = useState(false);

  const [isTopOffer, setIsTopOffer] = useState(false);

  const [isAtoZ, setIsAtoZ] = useState(false);

  const flip = {
    top: {
      rotateZ: 0,
    },
    down: {
      rotateZ: 180,
    },
  };

  return (
    <VStack ref={ref} maxwidth={size.width < 728 ? "90px" : "210px"}>
      <VStack
        alignment="flex-start"
        spacing="3px"
        background={({ theme }) => theme.backElement}
        padding="6px 12px"
        border="9px"
        width={size.width < 728 ? "90px" : "210px"}
        onClick={() => setIsActive(!isActive)}
        cursor="pointer"
        minheight="49px"
      >
        {size.width < 728 ? null : (
          <CaptionRegular cursor="pointer">Sorting by</CaptionRegular>
        )}

        <HStack cursor="pointer">
          {size.width < 728 ? (
            "Sort"
          ) : (
            <BodyBold cursor="pointer">
              {isSelected === 0
                ? isOld
                  ? "Oldest"
                  : "Newest"
                : isSelected === 1
                ? isTopPrice
                  ? "Highest Price"
                  : "Lowest Price"
                : isSelected === 3
                ? isTopOffer
                  ? "Most Offers"
                  : "Least Offers"
                : isSelected === 4
                ? isAtoZ
                  ? "A to Z"
                  : "Z to A"
                : null}
            </BodyBold>
          )}

          <Spacer></Spacer>
          <IconImg
            cursor="pointer"
            url={arrowDown}
            width="15px"
            height="15px"
            variants={flip}
            animate={isActive ? "down" : "top"}
          ></IconImg>
        </HStack>
      </VStack>
      {isActive && (
        <DropDown>
          <VStack
            background={({ theme }) => theme.backElement}
            border="9px"
            padding="9px"
            width="290px"
            spacing="9px"
          >
            {/* Publication */}
            <HStack
              height="49px"
              background={({ theme }) => theme.faded}
              // background={isSelected === 0 ? "green" : "yellow"}
              border="6px"
              spacing="6px"
              onClick={() => {
                setIsSelected(0);
              }}
              padding="3px"
            >
              {/* Option1  */}
              <HStack
                background={
                  isSelected === 0
                    ? isOld
                      ? ({ theme }) => theme.blue
                      : "transparent"
                    : null
                }
                width="100%"
                border="6px"
                cursor="pointer"
                onClick={() => {
                  setIsOld(true);
                  onChange({...params, page: 1, sortBy: "publication", sortDirection: 1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 0
                      ? isOld
                        ? "white"
                        : ({ theme }) => theme.text
                      : ({ theme }) => theme.text
                  }
                >
                  Oldest
                </BodyRegular>
              </HStack>

              {/* Option2  */}
              <HStack
                cursor="pointer"
                width="100%"
                border="6px"
                background={
                  isSelected === 0
                    ? isOld
                      ? "transparent"
                      : ({ theme }) => theme.blue
                    : null
                }
                onClick={() => {
                  setIsOld(false);
                  onChange({...params, page: 1, sortBy: "publication", sortDirection: -1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 0
                      ? isOld
                        ? ({ theme }) => theme.text
                        : "white"
                      : ({ theme }) => theme.text
                  }
                >
                  Newest
                </BodyRegular>
              </HStack>
            </HStack>

            {/* Price */}
            <HStack
              height="49px"
              background={({ theme }) => theme.faded}
              // background={isSelected === 1 ? "green" : "yellow"}
              border="6px"
              spacing="6px"
              onClick={() => {
                setIsSelected(1);
              }}
              padding="3px"
            >
              {/* Option1  */}
              <HStack
                background={
                  isSelected === 1
                    ? isTopPrice
                      ? ({ theme }) => theme.blue
                      : "transparent"
                    : null
                }
                width="100%"
                border="6px"
                cursor="pointer"
                onClick={() => {
                  setIsTopPrice(true);
                  onChange({...params, page: 1, sortBy: "price", sortDirection: -1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 1
                      ? isTopPrice
                        ? "white"
                        : ({ theme }) => theme.text
                      : ({ theme }) => theme.text
                  }
                >
                  Highest Price
                </BodyRegular>
              </HStack>

              {/* Option2  */}
              <HStack
                cursor="pointer"
                width="100%"
                border="6px"
                background={
                  isSelected === 1
                    ? isTopPrice
                      ? "transparent"
                      : ({ theme }) => theme.blue
                    : null
                }
                onClick={() => {
                  setIsTopPrice(false);
                  onChange({...params, page: 1, sortBy: "price", sortDirection: 1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 1
                      ? isTopPrice
                        ? ({ theme }) => theme.text
                        : "white"
                      : ({ theme }) => theme.text
                  }
                >
                  Lowest Price
                </BodyRegular>
              </HStack>
            </HStack>

            {/*  NFT Quantity  */}
            <VStack
              minheight="98px"
              background={({ theme }) => theme.faded}
              // background={isSelected === 1 ? "green" : "yellow"}
              border="6px"
              spacing="6px"
              onClick={() => {
                setIsSelected(3);
              }}
              padding="3px"
              width="100%"
            >
              {/* Option1  */}
              <HStack
                background={
                  isSelected === 3
                    ? isTopOffer
                      ? ({ theme }) => theme.blue
                      : "transparent"
                    : null
                }
                width="100%"
                border="6px"
                cursor="pointer"
                height="43px"
                onClick={() => {
                  setIsTopOffer(true);
                  onChange({...params, page: 1, sortBy: "offers", sortDirection: -1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 3
                      ? isTopOffer
                        ? "white"
                        : ({ theme }) => theme.text
                      : ({ theme }) => theme.text
                  }
                >
                  Most Offers
                </BodyRegular>
              </HStack>

              {/* Option2  */}
              <HStack
                cursor="pointer"
                width="100%"
                border="6px"
                background={
                  isSelected === 3
                    ? isTopOffer
                      ? "transparent"
                      : ({ theme }) => theme.blue
                    : null
                }
                onClick={() => {
                  setIsTopOffer(false);
                  onChange({...params, page: 1, sortBy: "offers", sortDirection: 1});
                }}
                height="43px"
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 3
                      ? isTopOffer
                        ? ({ theme }) => theme.text
                        : "white"
                      : ({ theme }) => theme.text
                  }
                >
                  Least Offers
                </BodyRegular>
              </HStack>
            </VStack>

            {/* Alphabetical */}
            <HStack
              height="49px"
              background={({ theme }) => theme.faded}
              // background={isSelected === 1 ? "green" : "yellow"}
              border="6px"
              spacing="6px"
              onClick={() => {
                setIsSelected(4);
              }}
              padding="3px"
            >
              {/* Option1  */}
              <HStack
                background={
                  isSelected === 4
                    ? isAtoZ
                      ? ({ theme }) => theme.blue
                      : "transparent"
                    : null
                }
                width="100%"
                border="6px"
                cursor="pointer"
                onClick={() => {
                  setIsAtoZ(true);
                  onChange({...params, page: 1, sortBy: "alphabet", sortDirection: 1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 4
                      ? isAtoZ
                        ? "white"
                        : ({ theme }) => theme.text
                      : ({ theme }) => theme.text
                  }
                >
                  A to Z
                </BodyRegular>
              </HStack>

              {/* Option2  */}
              <HStack
                cursor="pointer"
                width="100%"
                border="6px"
                background={
                  isSelected === 4
                    ? isAtoZ
                      ? "transparent"
                      : ({ theme }) => theme.blue
                    : null
                }
                onClick={() => {
                  setIsAtoZ(false);
                  onChange({...params, page: 1, sortBy: "alphabet", sortDirection: -1});
                }}
              >
                <BodyRegular
                  cursor="pointer"
                  textcolor={
                    isSelected === 4
                      ? isAtoZ
                        ? ({ theme }) => theme.text
                        : "white"
                      : ({ theme }) => theme.text
                  }
                >
                  Z to A
                </BodyRegular>
              </HStack>
            </HStack>
          </VStack>
        </DropDown>
      )}
    </VStack>
  );
}

export { SortButtonNFTS };

const DropDown = styled(motion.div)`
  position: absolute;
  right: 0px;
  top: 66px;
`;
