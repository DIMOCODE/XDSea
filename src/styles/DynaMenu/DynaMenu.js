import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useClickAway } from "react-use";

import styled from "styled-components";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";

import { HStack, IconImg, VStack } from "../Stacks";
import { BodyRegular } from "../TextStyles";

import searchW from "../../images/searchW.png";
import filterW from "../../images/filterW.png";
import sortW from "../../images/sortW.png";
import stakeStar from "../../images/stakeStar.png";

import { BtnMenu } from "./BtnMenu";
import { InputStyled } from "../InputStyled";
import { SearchOption } from "./SearchOption";
import { FiltersButton } from "../FiltersButton";
import { PriceRange } from "./Filters/PriceRange";
import { SaleType } from "./Filters/SaleType";
import { VerifiedStatus } from "./Filters/VerifiedStatus";
import { CloseIconBtn } from "../Buttons/CloseIconBtn";
import { SortCollection } from "./Sort/SortCollection";
import { SortNFTs } from "./Sort/SortNFTs";

import { StakeBtn } from "./StakeBtn";

function DynaMenu() {
  const ref = useRef(null);

  useClickAway(ref, () => {
    setIsSearch(false);
    setIsFilter(false);
    setIsSort(false);
  });

  const [isSearch, setIsSearch] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [isStake, setIsStake] = useState(false);

  return (
    <HStack overflowx="visible" ref={ref}>
      {/* Black menu bar */}

      <HStack
        layout
        height="52px"
        background={isStake ? "blue" : "black"}
        border="60px"
        spacing="0px"
        overflowx="hidden"
        style={{ borderRadius: 60 }}
      >
        {isSearch ? (
          <motion.div layout>
            <SearchOption onClick={() => setIsSearch(false)}></SearchOption>
          </motion.div>
        ) : isStake ? (
          <motion.div layout>
            <StakeBtn onClick={() => setIsStake(false)}></StakeBtn>
          </motion.div>
        ) : (
          <HStack layout spacing="0">
            <BtnMenu
              name="Search"
              icon={searchW}
              iconw="24px"
              iconh="24px"
              onClick={() => {
                setIsSearch(true), setIsSort(false), setIsFilter(false);
              }}
            ></BtnMenu>
            <BtnMenu
              name="Filter"
              icon={filterW}
              iconw="21px"
              iconh="21px"
              onClick={() => {
                setIsFilter(true), setIsSort(false);
              }}
            ></BtnMenu>
            <BtnMenu
              name="Sort"
              icon={sortW}
              iconw="24px"
              iconh="24px"
              onClick={() => {
                setIsSort(true), setIsFilter(false);
              }}
            ></BtnMenu>
            <BtnMenu
              name="Stake"
              icon={stakeStar}
              iconw="24px"
              iconh="24px"
              background="blue"
              border="0 30px 30px 0"
              onClick={() => {
                setIsStake(true), setIsSort(false), setIsFilter(false);
              }}
            ></BtnMenu>
          </HStack>
        )}
      </HStack>

      {/* Filter Window  */}
      <AnimatePresence initial={false}>
        {isFilter && (
          <AbsoluteWindow
            layout
            key="slideFilter"
            initial={{
              opacity: 1,
              y: 6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 0,
            }}
            transition={{ type: "spring", damping: 10 }}
          >
            <VStack
              background="white"
              width="390px"
              height="auto"
              border="9px"
              padding="39px 39px"
              spacing="36px"
            >
              <PriceRange></PriceRange>
              <SaleType></SaleType>
              <VerifiedStatus></VerifiedStatus>

              <CloseBtn>
                <CloseIconBtn onClick={() => setIsFilter(false)}></CloseIconBtn>
              </CloseBtn>
            </VStack>
          </AbsoluteWindow>
        )}
      </AnimatePresence>

      {/* Sorting Window */}
      <AnimatePresence initial={false}>
        {isSort && (
          <AbsoluteWindow
            layout
            key="slideSorting"
            initial={{
              opacity: 1,
              y: 6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 0,
            }}
            transition={{ type: "spring", damping: 10 }}
          >
            <VStack
              background="white"
              width="390px"
              height="auto"
              border="9px"
              padding="39px 39px"
              spacing="36px"
            >
              {/* <SortCollection></SortCollection> */}
              <SortNFTs></SortNFTs>
              <CloseBtn>
                <CloseIconBtn onClick={() => setIsSort(false)}></CloseIconBtn>
              </CloseBtn>
            </VStack>
          </AbsoluteWindow>
        )}
      </AnimatePresence>
    </HStack>
  );
}

export { DynaMenu };

const AbsoluteWindow = styled(motion.div)`
  position: absolute;
  bottom: 62px;
`;

const CloseBtn = styled(motion.div)`
  position: absolute;
  top: 12px;
  right: 12px;
`;
