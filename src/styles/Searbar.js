import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { InputStyled } from "./InputStyled";
import {
  VStack,
  HStack,
  IconImg,
  ZStack,
  ZItem,
  Spacer,
  Divider,
} from "./Stacks";
import styled from "styled-components";
import search from "../images/searchIcon.png";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import {
  BodyBold,
  BodyRegular,
  CaptionBold,
  CaptionBoldShort,
  CaptionRegular,
} from "./TextStyles";
import crossSearch from "../images/crossSearch.png";
import verifiedShape from "../images/verifiedShape.png";
import verifiedBlue from "../images/verifiedBlue.png";
import verifiedMask from "../images/verifiedMask.png";
import arrowRight from "../images/arrowRight.png";
import { useClickAway } from "react-use";
import { Icon } from "@mui/material";
import dummyNFT from "../images/abstract1.jpg";
import dummyUser from "../images/dummyuser.jpg";
import dummyUser1 from "../images/dummyuser1.jpg";
import { getCollections } from "../API/Collection";
import { getNFTs } from "../API/NFT";
import loadingIcon from "../images/loadingDots.gif";
import { isSafari } from "../common/common";
import { nftaddress } from "../config";

function Searchbar({
  placeholder,
  data,
  verifiedCreator,
  clickVerifiedCretor,
  onClickCreator,
  creatorImage,
  top,
  left,
  width,
  widthInput,
  isPhone,
  onClickInput,
  switchBarStatus,
}) {
  const history = useHistory();
  const [filteredCollectionData, setFilteredCollectionData] = useState([]);
  const [filteredNFTData, setFilteredNFTData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);

  useClickAway(ref, () => {
    setFilteredCollectionData([]);
    setFilteredNFTData([]);
    switchBarStatus(false);
    setShowResults(false);
  });

  const clearInput = () => {
    setFilteredCollectionData([]);
    setFilteredNFTData([]);
    setSearchTerm("");
    switchBarStatus(false);
    setShowResults(false);
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 6) + "..." + address.substring(38)
      : "undefined";
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
    setShowResults(false);
    switchBarStatus(false);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if(searchTerm !== "") {
        const collectionResults = await (await getCollections({ searchTerm: searchTerm })).data;
        console.log(collectionResults);
        const nftResults = await (await getNFTs({ page: 1, searchBy: searchTerm })).data;
        console.log(nftResults);
        setFilteredCollectionData(collectionResults.collections);
        setFilteredNFTData(nftResults.nfts);
        setLoading(false);
        switchBarStatus(true);
        setShowResults(true);
      }
      else{
        setFilteredCollectionData([]);
        setFilteredNFTData([]);
        setLoading(false);
        switchBarStatus(false);
        setShowResults(false);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <VStack height="42px" minwidth={widthInput || "300px"}>
      <InputStyled
        type="text"
        placeholder={placeholder}
        background={({ theme }) => theme.faded}
        icon={loading ? loadingIcon : search}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setLoading(true);
        }}
        input={searchTerm}
        onClick={() => {
          const delayFn = setTimeout(() => {
            if(searchTerm !== "")
              setShowResults(true);
          }, 1500);

          return () => clearTimeout(delayFn);
        }}
        height="42px"
      ></InputStyled>
      {showResults && (
        <SearchResult top={top} left={left} ref={ref}>
          <VStack
            background={({ theme }) => theme.backElement}
            padding="6px 15px 0 15px"
            border="12px"
            style={{
              boxShadow: "0px 15px 15px rgba(0, 0, 0, 0.15)",
            }}
            spacing="0px"
            // background="pink"
            width={width}
          >
            {/* Title Results */}

            <HStack padding="15px 0 " width="100%">
              <BodyRegular>Search Results for</BodyRegular>
              <BodyBold>"{searchTerm}"</BodyBold>

              <Spacer></Spacer>

              <a onClick={clearInput}>
                <IconImg
                  url={crossSearch}
                  width="26px"
                  height="26px"
                  cursor="pointer"
                ></IconImg>
              </a>
            </HStack>

            <Divider></Divider>

            {/* Box Results */}

            <HStack
              responsive="true"
              alignment="flex-start"
              overflowy="auto"
              height={isPhone ? "590px" : "auto"}
              justify={isPhone ? "flex-start" : "center"}
              padding="15px 0 15px 0"
            >
              {/* Creators */}
              {/* <VStack alignment="flex-start">
                <CaptionBoldShort>Creators</CaptionBoldShort>

                <VStack spacing="9px">
                  {filteredData.slice(0, 5).map((value, key) => {
                    return (
                      <HStack>
                        {value.isVerified ? (
                          <HStack
                            whileHover={{ background: "rgb(0,0,0,0.06" }}
                            padding="6px"
                            border="6px"
                          >
                            <VStack maxwidth="45px">
                              <ZStack>
                                <ZItem>
                                  <Mask img={verifiedMask}>
                                    <IconImg
                                      url={dummyUser1}
                                      width="42px"
                                      height="42px"
                                      border="90px"
                                      backsize="cover"
                                    ></IconImg>
                                  </Mask>
                                </ZItem>

                                <ZItem>
                                  <IconImg
                                    url={verifiedShape}
                                    width="45px"
                                    height="45px"
                                    border="120px"
                                    whileTap={clickVerifiedCretor}
                                    backsize="cover"
                                    cursor={"pointer"}
                                    style={{
                                      boxShadow:
                                        "0px 4px 2px rgba(0, 0, 0, 0.15)",
                                    }}
                                  ></IconImg>
                                  <AbsoluteVerified>
                                    <IconImg
                                      url={verifiedBlue}
                                      width="21px"
                                      height="21px"
                                      border="120px"
                                    ></IconImg>
                                  </AbsoluteVerified>
                                </ZItem>
                              </ZStack>
                            </VStack>

                            <VStack
                              alignment="flex-start"
                              spacing="6px"
                              cursor="pointer"
                            >
                              <BodyBold>{value.name}</BodyBold>
                              <CaptionRegular>{value.address}</CaptionRegular>
                            </VStack>
                          </HStack>
                        ) : (
                          <HStack
                            width="100%"
                            whileHover={{ background: "rgb(0,0,0,0.06" }}
                            padding="6px"
                            border="6px"
                          >
                            <IconImg
                              url={dummyUser}
                              width="43px"
                              height="43px"
                              border="120px"
                              bordersize="4px"
                              bordercolor="white"
                              whileTap={onClickCreator}
                              backsize="cover"
                              cursor={"pointer"}
                              style={{
                                boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.15)",
                              }}
                            ></IconImg>

                            <VStack
                              alignment="flex-start"
                              spacing="6px"
                              cursor="pointer"
                            >
                              <BodyBold>{value.name}</BodyBold>
                              <CaptionRegular>{value.address}</CaptionRegular>
                            </VStack>
                          </HStack>
                        )}
                      </HStack>
                    );
                  })}
                </VStack>

                <a>
                  <HStack
                    spacing="5px"
                    background={({ theme }) => theme.faded}
                    padding="5px 15px"
                    border="9px"
                    cursor="pointer"
                  >
                    <CaptionBoldShort>See all Creators</CaptionBoldShort>
                    <IconImg
                      url={arrowRight}
                      width="26px"
                      height="26px"
                      cursor="pointer"
                    ></IconImg>
                  </HStack>
                </a>
              </VStack> */}

              {/* NFTs */}
              {filteredNFTData.length !== 0 && (
                <VStack alignment="flex-start" spacing="9px">
                  <CaptionBoldShort>NFTs</CaptionBoldShort>
                  <VStack spacing="12px">
                    {filteredNFTData.slice(0, 3).map((nft) => (
                      <HStack
                        whileHover={{ background: "rgb(0,0,0,0.06" }}
                        padding="6px"
                        border="6px"
                        onClick={() => NavigateTo(`nft/${nftaddress}/${nft.tokenId}`)}
                      >
                        <IconImg
                          url={isSafari ? nft.urlFile.v1 : nft.urlFile.v0}
                          width="54px"
                          height="54px"
                          border="9px"
                          backsize="cover"
                          cursor="pointer"
                        ></IconImg>
                        <VStack
                          alignment="flex-start"
                          spacing="3px"
                          cursor="pointer"
                        >
                          <BodyBold>{nft.name}</BodyBold>
                          <CaptionRegular>{nft.collectionId.name}</CaptionRegular>
                          <CaptionRegular>{truncateAddress(nft.owner.userName)}</CaptionRegular>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>

                  {filteredNFTData.length > 3 && (
                    <a>
                      <HStack
                        spacing="5px"
                        background={({ theme }) => theme.faded}
                        padding="5px 15px"
                        border="9px"
                        cursor="pointer"
                        onClick={() => NavigateTo(`SearchPage?searchTerm=${searchTerm}&mode=nft`)}
                      >
                        <CaptionBoldShort>See all NFTs</CaptionBoldShort>
                        <IconImg
                          url={arrowRight}
                          width="26px"
                          height="26px"
                          cursor="pointer"
                        ></IconImg>
                      </HStack>
                    </a>
                  )}
                </VStack>
              )}

              {/* Collections */}
              {filteredCollectionData.length !== 0 && (
                <VStack alignment="flex-start" spacing="9px">
                  <CaptionBoldShort>Collections</CaptionBoldShort>
                  {filteredCollectionData.slice(0, 2).map((collection) => (
                    <VStack
                      alignment="flex-start"
                      spacing="9px"
                      width="200px"
                      whileHover={{ background: "rgb(0,0,0,0.06" }}
                      padding="6px"
                      border="6px"
                      onClick={() => NavigateTo(`collection/${collection.nickName}`)}
                    >
                      <IconImg
                        url={isSafari ? collection.banner.v1 : collection.banner.v0}
                        width="189px"
                        height="54px"
                        border="6px"
                        backsize="cover"
                        cursor="pointer"
                      ></IconImg>
                      <HStack>
                        <IconImg
                          url={isSafari ? collection.logo.v1 : collection.logo.v0}
                          width="32px"
                          height="32px"
                          border="15px"
                        ></IconImg>
                        <VStack
                          alignment="flex-start"
                          spacing="3px"
                          cursor="pointer"
                          width="100%"
                        >
                          <BodyBold>{collection.name}</BodyBold>
                          <CaptionRegular>{truncateAddress(collection.creator.userName)}</CaptionRegular>
                        </VStack>
                      </HStack>
                    </VStack>
                  ))}

                  {filteredCollectionData.length > 2 && (
                    <a>
                      <HStack
                        spacing="5px"
                        background={({ theme }) => theme.faded}
                        padding="5px 15px"
                        border="9px"
                        cursor="pointer"
                        onClick={() => NavigateTo(`SearchPage?searchTerm=${searchTerm}&mode=collection`)}
                      >
                        <CaptionBoldShort>See all Collections</CaptionBoldShort>
                        <IconImg
                          url={arrowRight}
                          width="26px"
                          height="26px"
                          cursor="pointer"
                        ></IconImg>
                      </HStack>
                    </a>
                  )}
                </VStack>
              )}
            </HStack>
          </VStack>
        </SearchResult>
      )}
    </VStack>
  );
}

export { Searchbar };

const SearchResult = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 100;
  width: 100vw;

  box-sizing: border-box;
`;

const Mask = styled(motion.div)`
  -webkit-mask-image: url(${(props) => props.img});
  mask-image: url(${(props) => props.img});
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  mask-position: 0% 0%;
  mask-size: 48px;
  height: 48px;
  width: 48px;
`;

const AbsoluteVerified = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  left: 30px;
`;
