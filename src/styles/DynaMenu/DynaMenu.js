import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useClickAway } from "react-use";

import styled from "styled-components";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";

import { HStack, IconImg, Spacer, VStack } from "../Stacks";
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

function DynaMenu(props) {
  const {
    isStake,
    setIsStake,
    collectionParams,
    handleFilterCollections,
    nftParams,
    handleFilterNFTs,
    isCollections,
    maxPrice,
    setMaxPrice,
    minPrice,
    setMinPrice,
    isSearchPage,
    isStakingEnabled,
    searchTerm,
    setSearchTerm,
  } = props;
  const ref = useRef(null);

  const [isSearch, setIsSearch] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [collectionSearchTerm, setCollectionSearchTerm] = useState("");
  const [nftSearchTerm, setNftSearchTerm] = useState("");
  const [btnSale, setBtnSale] = useState(false);
  const [btnSold, setBtnSold] = useState(false);
  const [btnRelist, setBtnRelist] = useState(false);
  const [btnNFS, setBtnNFS] = useState(false);
  const [nftVerified, setNftVerified] = useState(false);
  const [collectionVerified, setCollectionVerified] = useState(false);
  const [isCollectionSelected, setIsCollectionSelected] = useState(
    isSearchPage ? 6 : 1
  );
  const [isCollectionOld, setIsCollectionOld] = useState(false);
  const [isVolumeTop, setIsVolumeTop] = useState(true);
  const [isTopOwners, setIsTopOwners] = useState(false);
  const [isTopQuantity, setIsTopQuantity] = useState(false);
  const [isTopFloor, setIsTopFloor] = useState(false);
  const [isCollectionAtoZ, setIsCollectionAtoZ] = useState(false);
  const [isNftSelected, setIsNftSelected] = useState(isSearchPage ? 2 : 0);
  const [isNftOld, setIsNftOld] = useState(false);
  const [isTopPrice, setIsTopPrice] = useState(false);
  const [isTopOffer, setIsTopOffer] = useState(false);
  const [isNftAtoZ, setIsNftAtoZ] = useState(false);

  useClickAway(ref, () => {
    setIsSearch(false);
    setIsFilter(false);
    setIsSort(false);
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (isSearch) {
        if (collectionSearchTerm !== "") {
          handleFilterCollections({
            ...collectionParams,
            searchBy: collectionSearchTerm,
            page: 1,
          });
        } else {
          handleFilterCollections({
            ...collectionParams,
            searchBy: "",
            page: 1,
          });
        }
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [collectionSearchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (isSearch) {
        if (nftSearchTerm !== "") {
          handleFilterNFTs({
            ...nftParams,
            searchBy: nftSearchTerm,
            page: 1,
          });
        } else {
          handleFilterNFTs({
            ...nftParams,
            searchBy: "",
            page: 1,
          });
        }
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [nftSearchTerm]);

  return (
    <HStack overflowx="visible" ref={ref}>
      {/* Black menu bar */}
      <HStack
        layout
        height="52px"
        background={isStake ? ({ theme }) => theme.blue : "black"}
        border="60px"
        spacing="0px"
        overflowx="hidden"
        style={{ borderRadius: 60 }}
      >
        {isSearch ? (
          <motion.div layout>
            <SearchOption
              placeholder={
                searchTerm !== undefined
                  ? searchTerm
                  : isCollections
                  ? collectionSearchTerm
                  : nftSearchTerm
              }
              onChange={(e) => {
                if (searchTerm !== undefined) {
                  setSearchTerm(e.target.value);
                } else {
                  if (isCollections) {
                    setCollectionSearchTerm(e.target.value);
                  } else {
                    setNftSearchTerm(e.target.value);
                  }
                }
              }}
              onClickBack={() => setIsSearch(false)}
              onClickCancel={() => {
                if (searchTerm !== undefined) {
                  setSearchTerm("");
                } else {
                  if (isCollections) {
                    setCollectionSearchTerm("");
                  } else {
                    setNftSearchTerm("");
                  }
                }
                document.getElementById("SearchbarDynaMenu").value = "";
              }}
            ></SearchOption>
          </motion.div>
        ) : isStake ? (
          <motion.div layout>
            <StakeBtn
              onClick={() => {
                setIsStake(false);
                if (isCollections) {
                  handleFilterCollections({
                    ...collectionParams,
                    page: 1,
                    stakeable: "",
                  });
                } else {
                  handleFilterNFTs({
                    ...nftParams,
                    page: 1,
                    stakeable: "",
                  });
                }
              }}
            ></StakeBtn>
          </motion.div>
        ) : (
          <HStack layout spacing="0">
            <BtnMenu
              name="Search"
              icon={searchW}
              iconw="24px"
              iconh="24px"
              onClick={() => {
                setIsSearch(true);
                setIsSort(false);
                setIsFilter(false);
              }}
            ></BtnMenu>
            <BtnMenu
              name="Filter"
              icon={filterW}
              iconw="21px"
              iconh="21px"
              onClick={() => {
                setIsFilter(true);
                setIsSort(false);
              }}
            ></BtnMenu>
            <BtnMenu
              name="Sort"
              icon={sortW}
              iconw="24px"
              iconh="24px"
              onClick={() => {
                setIsSort(true);
                setIsFilter(false);
              }}
            ></BtnMenu>
            {isStakingEnabled && (
              <BtnMenu
                name="Stake"
                icon={stakeStar}
                iconw="24px"
                iconh="24px"
                background={({ theme }) => theme.blue}
                border="0 30px 30px 0"
                onClick={() => {
                  setIsStake(true);
                  setIsSort(false);
                  setIsFilter(false);
                  if (isCollections) {
                    handleFilterCollections({
                      ...collectionParams,
                      page: 1,
                      stakeable: true,
                    });
                  } else {
                    handleFilterNFTs({
                      ...nftParams,
                      page: 1,
                      stakeable: true,
                    });
                  }
                }}
              ></BtnMenu>
            )}
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
              y: 6,
            }}
            transition={{ type: "spring", damping: 10 }}
          >
            <VStack
              background="black"
              width="389px"
              height="auto"
              border="29px"
              padding="39px 39px"
              spacing="36px"
            >
              {!isCollections && (
                <>
                  <PriceRange
                    color="white"
                    oppColor="black"
                    minValue={minPrice}
                    setMinValue={setMinPrice}
                    maxValue={maxPrice}
                    setMaxValue={setMaxPrice}
                    params={nftParams}
                    onChange={handleFilterNFTs}
                  ></PriceRange>
                  <SaleType
                    params={nftParams}
                    onChange={handleFilterNFTs}
                    btnSale={btnSale}
                    setBtnSale={setBtnSale}
                    btnNFS={btnNFS}
                    setBtnNFS={setBtnNFS}
                    btnRelist={btnRelist}
                    setBtnRelist={setBtnRelist}
                    btnSold={btnSold}
                    setBtnSold={setBtnSold}
                  ></SaleType>
                </>
              )}
              <VerifiedStatus
                isVerified={isCollections ? collectionVerified : nftVerified}
                setVerified={
                  isCollections ? setCollectionVerified : setNftVerified
                }
                params={isCollections ? collectionParams : nftParams}
                onChange={
                  isCollections ? handleFilterCollections : handleFilterNFTs
                }
              ></VerifiedStatus>
              <CloseBtn layout>
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
              y: 6,
            }}
            transition={{ type: "spring", damping: 10 }}
          >
            <VStack
              background="black"
              width="389px"
              height="auto"
              border="29px"
              padding="46px 39px"
              spacing="36px"
            >
              {isCollections ? (
                <SortCollection
                  onChange={handleFilterCollections}
                  params={collectionParams}
                  isSearchPage={isSearchPage}
                  isSelected={isCollectionSelected}
                  setIsSelected={setIsCollectionSelected}
                  isOld={isCollectionOld}
                  setIsOld={setIsCollectionOld}
                  isVolumeTop={isVolumeTop}
                  setIsVolumeTop={setIsVolumeTop}
                  isTopOwners={isTopOwners}
                  setIsTopOwners={setIsTopOwners}
                  isTopFloor={isTopFloor}
                  setIsTopFloor={setIsTopFloor}
                  isTopQuantity={isTopQuantity}
                  setIsTopQuantity={setIsTopQuantity}
                  isAtoZ={isCollectionAtoZ}
                  setIsAtoZ={setIsCollectionAtoZ}
                ></SortCollection>
              ) : (
                <SortNFTs
                  onChange={handleFilterNFTs}
                  params={nftParams}
                  isSearchPage={isSearchPage}
                  isSelected={isNftSelected}
                  setIsSelected={setIsNftSelected}
                  isOld={isNftOld}
                  setIsOld={setIsNftOld}
                  isTopPrice={isTopPrice}
                  setIsTopPrice={setIsTopPrice}
                  isTopOffer={isTopOffer}
                  setIsTopOffer={setIsTopOffer}
                  isAtoZ={isNftAtoZ}
                  setIsAtoZ={setIsNftAtoZ}
                ></SortNFTs>
              )}
              <CloseBtn layout>
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
  bottom: 0px;
  z-index: 0;
`;

const CloseBtn = styled(motion.div)`
  position: absolute;
  top: 9px;
  right: 9px;
`;
