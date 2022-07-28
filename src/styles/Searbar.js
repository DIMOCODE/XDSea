import React, { useState, useRef } from "react";
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
  const [filteredData, setFilteredData] = useState([]);
  const [result, setResult] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  useClickAway(ref, () => {
    setFilteredData([]);
    switchBarStatus(false);
  });

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setResult(searchWord);
    const newFilter = data.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord == "") {
      setFilteredData([]);
      switchBarStatus(false);
    } else {
      setFilteredData(newFilter);
      switchBarStatus(true);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setResult("");
    switchBarStatus(false);
  };

  return (
    <VStack height="42px" minwidth={widthInput || "300px"}>
      <InputStyled
        type="text"
        placeholder={placeholder}
        background={({ theme }) => theme.faded}
        icon={search}
        onChange={handleFilter}
        input={result}
        height="42px"
      ></InputStyled>
      {filteredData.length != 0 && (
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
              <BodyBold>"{result}"</BodyBold>

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
              <VStack alignment="flex-start">
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
              </VStack>
              {/* NFTs */}
              <VStack alignment="flex-start" spacing="9px">
                <CaptionBoldShort>NFTs</CaptionBoldShort>

                <VStack spacing="12px">
                  <HStack
                    whileHover={{ background: "rgb(0,0,0,0.06" }}
                    padding="6px"
                    border="6px"
                  >
                    <IconImg
                      url={dummyNFT}
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
                      <BodyBold>Luminosity #001</BodyBold>
                      <CaptionRegular>433s...3ds34</CaptionRegular>
                      <CaptionRegular>Not For Sale</CaptionRegular>
                    </VStack>
                  </HStack>

                  <HStack
                    whileHover={{ background: "rgb(0,0,0,0.06" }}
                    padding="6px"
                    border="6px"
                  >
                    <IconImg
                      url={dummyNFT}
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
                      <BodyBold>Luminosity #001</BodyBold>
                      <CaptionRegular>433s...3ds34</CaptionRegular>
                      <CaptionRegular>Not For Sale</CaptionRegular>
                    </VStack>
                  </HStack>
                </VStack>

                <a>
                  <HStack
                    spacing="5px"
                    background={({ theme }) => theme.faded}
                    padding="5px 15px"
                    border="9px"
                    cursor="pointer"
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
              </VStack>

              {/* Collections */}

              <VStack alignment="flex-start" spacing="9px">
                <CaptionBoldShort>Collections</CaptionBoldShort>

                <VStack
                  alignment="flex-start"
                  spacing="9px"
                  width="200px"
                  whileHover={{ background: "rgb(0,0,0,0.06" }}
                  padding="6px"
                  border="6px"
                >
                  <IconImg
                    url={dummyNFT}
                    width="189px"
                    height="54px"
                    border="6px"
                    backsize="cover"
                    cursor="pointer"
                  ></IconImg>
                  <VStack
                    alignment="flex-start"
                    spacing="3px"
                    cursor="pointer"
                    width="100%"
                  >
                    <BodyBold>Lux Setup</BodyBold>
                    <CaptionRegular>433s...3ds34</CaptionRegular>
                  </VStack>
                </VStack>

                <a>
                  <HStack
                    spacing="5px"
                    background={({ theme }) => theme.faded}
                    padding="5px 15px"
                    border="9px"
                    cursor="pointer"
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
              </VStack>
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
