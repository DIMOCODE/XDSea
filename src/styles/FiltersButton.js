import React from "react";
import { useRef } from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  CaptionRegular,
} from "./TextStyles";
import resetIcon from "../images/resetIcon.png";
import filterIcon from "../images/FilterIcon.png";
import { useState } from "react";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";

import verifiedBlue from "../images/verifiedBlue.png";
import nonVerified from "../images/nonVerified.png";
import filter from "../images/filter.png";
import all from "../images/all.png";
import notforsale from "../images/notforsale.png";
import relist from "../images/relist.png";
import sold from "../images/sold.png";
import sale from "../images/sale.png";

import styled1 from "styled-components";
import { useAsync, useClickAway } from "react-use";

import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { FilterNFT } from "./FilterNFT";
import useWindowSize from "../styles/useWindowSize";

function FiltersButton(props) {
  const { isNftFilter, onChange, params, top, right, left, isSearchPage } = props;

  const size = useWindowSize();
  const [btnAll, setBtnAll] = useState(false);
  const [btnSale, setBtnSale] = useState(false);
  const [btnSold, setBtnSold] = useState(false);
  const [btnRelist, setBtnRelist] = useState(false);
  const [btnNFS, setBtnNFS] = useState(false);
  const [btnVerified, setBtnVerified] = useState(false);
  const [minValue, setMinValue] = useState(1000);
  const [maxValue, setMaxValue] = useState(150000);
  const [activeFilters, setActiveFilters] = useState(0);

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
  const ref = useRef(null);
  useClickAway(ref, () => {
    setIsActive(false);
  });

  const blue = "#3256FF";
  const grayBar = "#C3C2C2";

  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: blue, //color of the slider between thumbs
    "& .MuiSlider-thumb": {
      backgroundColor: blue, //color of thumbs
    },
    "& .MuiSlider-rail": {
      color: grayBar, ////color of the slider outside  teh area between thumbs
    },
  }));

  const [isActive, setIsActive] = useState(false);

  return (
    <VStack ref={ref} maxwidth={size.width < 728 ? "90px" : "210px"}>
      <HStack
        alignment="center"
        spacing="6px"
        background={({ theme }) => theme.backElement}
        padding="9px 12px"
        border="9px"
        width={size.width < 728 ? "90px" : "210px"}
        cursor="pointer"
        height="49px"
      >
        <HStack
          cursor="pointer"
          spacing="6px"
          onClick={() => setIsActive(!isActive)}
          width="100%"
        >
          <IconImg
            cursor="pointer"
            url={filterIcon}
            width="18px"
            height="18px"
          ></IconImg>
          {size.width < 728 ? null : (
            <>
              <BodyBold cursor="pointer">Filters</BodyBold>
            </>
          )}
          <Spacer></Spacer>
        </HStack>

        {activeFilters > 0 && size.width < 728 ? (
          <Bubble>
            <HStack
              background={({ theme }) => theme.blue}
              width="30px"
              height="30px"
              border="6px"
            >
              <BodyBold textcolor="white">{activeFilters}</BodyBold>
            </HStack>
          </Bubble>
        ) : activeFilters > 0 && size.width > 728 
          ? (
            <HStack
              background={({ theme }) => theme.blue}
              width="48px"
              border="6px"
            >
              <BodyBold textcolor="white">{activeFilters}</BodyBold>
            </HStack>
          )
          : null
        }

        <IconImg
          cursor="pointer"
          url={resetIcon}
          width="21px"
          height="21px"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if(isSearchPage) {
              if(isNftFilter)
                onChange({
                  searchBy: params.searchBy,
                  page: 1
                });
              else
                onChange({
                  searchTerm: params.searchTerm,
                  page: 1
                });
            }
            else{
              if(isNftFilter)
                onChange({
                  page: 1,
                  sortBy: "publication",
                  sortDirection: -1
                });
              else
                onChange({
                  page: 1,
                  sortBy: "volumeTrade",
                  sortDirection: -1,
                });
            }
            setBtnVerified(false);
            setActiveFilters(0);
          }}
        ></IconImg>
      </HStack>
      {isActive && (
        <DropDown top={top} right={right} left={left}>
          <VStack
            background={({ theme }) => theme.backElement}
            border="9px"
            padding="21px 21px"
            width="290px"
            spacing="15px"
          >
            {isNftFilter && (
              <>
                {/*Slider*/}

                <VStack width="100%" alignment="flex-start" spacing="15px">
                  <CaptionBoldShort cursor="pointer">Price Range</CaptionBoldShort>

                  <HStack
                    background="transparent"
                    height="60px"
                    alignment="flex-end"
                  >
                    <CustomSlider
                      min={1}
                      max={3000000}
                      defaultValue={[minValue, maxValue]}
                      valueLabelDisplay="on"
                      className="FilterPriceSlider"
                    />
                  </HStack>

                  <HStack
                    background={({ theme }) => theme.blue}
                    width="100%"
                    border="6px"
                    height="43px"
                    cursor="pointer"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMinValue(document.getElementsByClassName("FilterPriceSlider")[0]
                        .getElementsByTagName("span")[2].getElementsByTagName("input")[0].value);
                      setMaxValue(document.getElementsByClassName("FilterPriceSlider")[0]
                      .getElementsByTagName("span")[6].getElementsByTagName("input")[0].value);
                      onChange({...params, page: 1, priceRangeStart: document.getElementsByClassName("FilterPriceSlider")[0]
                        .getElementsByTagName("span")[2].getElementsByTagName("input")[0].value, priceRangeEnd: document.getElementsByClassName("FilterPriceSlider")[0]
                        .getElementsByTagName("span")[6].getElementsByTagName("input")[0].value
                      });
                      if(!params.priceRangeStart)
                        setActiveFilters(activeFilters + 1);
                    }}
                  >
                    <BodyRegular cursor="pointer" textcolor="white">
                      Apply
                    </BodyRegular>
                  </HStack>
                </VStack>
                <Divider></Divider>
                {/* Sale Type */}
                <VStack width="100%" alignment="flex-start" spacing="15px">
                  <CaptionBoldShort cursor="pointer">
                    Sale Type
                  </CaptionBoldShort>

                  <HStack width="100%" spacing="15px">
                    <IconImg
                      url={all}
                      width="36px"
                      height="36px"
                      cursor="pointer"
                      onTapStart={() => {
                        setBtnAll(!btnAll);
                        setBtnSale(!btnAll);
                        setBtnSold(!btnAll);
                        setBtnRelist(!btnAll);
                        setBtnNFS(!btnAll);
                      }}
                      variants={activated}
                      animate={btnAll ? "off" : "on"}
                    ></IconImg>

                    <IconImg
                      url={sale}
                      width="36px"
                      height="36px"
                      cursor="pointer"
                      onTapStart={() => {
                        setBtnSale(!btnSale);
                        if(btnSale && !btnNFS && !btnSold && !btnRelist) {
                          setBtnAll(false);
                        }
                        else if(!btnSale && !btnNFS && !btnSold && !btnRelist) {
                          setBtnAll(true);
                        }
                      }}
                      variants={activated}
                      animate={btnSale ? "off" : "on"}
                    ></IconImg>

                    <IconImg
                      url={sold}
                      width="36px"
                      height="36px"
                      cursor="pointer"
                      onTapStart={() => {
                        setBtnSold(!btnSold);
                        if(btnSold && !btnNFS && !btnSale && !btnRelist) {
                          setBtnAll(false);
                        }
                        else if(!btnSold && !btnNFS && !btnSale && !btnRelist) {
                          setBtnAll(true);
                        }
                      }}
                      variants={activated}
                      animate={btnSold ? "off" : "on"}
                    ></IconImg>

                    <IconImg
                      url={relist}
                      width="36px"
                      height="36px"
                      cursor="pointer"
                      onTapStart={() => {
                        setBtnRelist(!btnRelist);
                        if(btnRelist && !btnNFS && !btnSale && !btnSold) {
                          setBtnAll(false);
                        }
                        else if(!btnRelist && !btnNFS && !btnSale && !btnSold) {
                          setBtnAll(true);
                        }
                      }}
                      variants={activated}
                      animate={btnRelist ? "off" : "on"}
                    ></IconImg>

                    <IconImg
                      url={notforsale}
                      width="36px"
                      height="36px"
                      cursor="pointer"
                      onTapStart={() => {
                        setBtnNFS(!btnNFS);
                        if(btnNFS && !btnRelist && !btnSale && !btnSold) {
                          setBtnAll(false);
                        }
                        else if(!btnNFS && !btnRelist && !btnSale && !btnSold) {
                          setBtnAll(true);
                        }
                      }}
                      variants={activated}
                      animate={btnNFS ? "off" : "on"}
                    ></IconImg>
                  </HStack>

                  {/* ApplyChanges  */}
                  <HStack
                    background={({ theme }) => theme.blue}
                    width="100%"
                    border="6px"
                    height="43px"
                    cursor="pointer"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onChange({...params, page: 1, saleType1: !btnSale ? "SALE" : "", saleType2: !btnRelist ? "RELIST" : "",
                        saleType3: !btnSold ? "SOLD" : "", saleType4: !btnNFS ? "NOT_SALE" : ""});
                      if(!params.saleType1 && !params.saleType2 && !params.saleType3 && !params.saleType4)
                        setActiveFilters(activeFilters + 1);
                    }}
                  >
                    <BodyRegular cursor="pointer" textcolor="white">
                      Apply
                    </BodyRegular>
                  </HStack>
                </VStack>
                <Divider></Divider>
              </>
            )}

            {/* Verified */}
            <VStack
              width="100%"
              alignment="flex-start"
              spacing="9px"
              onClick={() => {
                setBtnVerified(!btnVerified);
                if(!btnVerified)
                  onChange({...params, page: 1, verified: !btnVerified});
                else
                  onChange({...params, page: 1, verified: ""});
                setActiveFilters(btnVerified ? activeFilters - 1 : activeFilters + 1);
              }}
              cursor="pointer"
            >
              <CaptionBoldShort cursor="pointer">Status</CaptionBoldShort>
              <HStack cursor="pointer">
                <BodyBold cursor="pointer">
                  Verified Only
                </BodyBold>
                <Spacer></Spacer>
                <IconImg
                  cursor="pointer"
                  url={verifiedBlue}
                  width="30px"
                  height="30px"
                  animate={btnVerified ? { opacity: 1 } : { opacity: 0.3 }}
                ></IconImg>
              </HStack>
            </VStack>
          </VStack>
        </DropDown>
      )}
    </VStack>
  );
}

export { FiltersButton };

const DropDown = styled1(motion.div).attrs((props) => ({
  top: props.top || "60px",
  left: props.left || "0px",
  right: props.right || "",
}))`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top} ;
  right: ${(props) => props.right};
 

`;

const Bubble = styled1(motion.div)`
position: absolute;
top:-15px;
right:-15px;
`;
