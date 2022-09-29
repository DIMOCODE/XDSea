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
import { getCollections } from "../API/Collection";
import { getNFTs } from "../API/NFT";
import loadingIcon from "../images/loadingDots.gif";
import { truncateAddress } from "../common/common";
import { nftaddress } from "../config";
import useWindowSize from "../styles/useWindowSize";

function Searchbar({
  placeholder,
  data,
  verifiedCreator,
  clickVerifiedCretor,
  onClickCreator,
  creatorImage,
  top,
  left,
  widthInput,
  isPhone,
  backcolor,
  textcolor,
  onClickInput,
  textplace,
}) {
  const history = useHistory();
  const [filteredCollectionData, setFilteredCollectionData] = useState([]);
  const [filteredNFTData, setFilteredNFTData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  const size = useWindowSize();
  useClickAway(ref, () => {
    setShowResults(false);
  });

  const clearInput = () => {
    setFilteredCollectionData([]);
    setFilteredNFTData([]);
    setSearchTerm("");
    setShowResults(false);
  };

  /**
   * Redirect the user to a specific path
   *
   * @param {string} route path to be redirected to
   */
  function NavigateTo(route) {
    history.push(`/${route}`);
    setShowResults(false);
  }

  /**
   * React Hook to render the component when the search term is updated
   */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm !== "") {
        const requestData = await Promise.all(
          [1, 2].map(async (i) => {
            if (i === 1) {
              const collectionResults = await (
                await getCollections({ searchBy: searchTerm })
              ).data;
              setFilteredCollectionData(collectionResults.collections);
            } else {
              const nftResults = await (
                await getNFTs({ page: 1, searchBy: searchTerm })
              ).data;
              setFilteredNFTData(nftResults.nfts);
            }

            setLoading(false);
            setShowResults(true);
          })
        );
      } else {
        setFilteredCollectionData([]);
        setFilteredNFTData([]);
        setLoading(false);
        setShowResults(false);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <VStack
      height="auto"
      minwidth={widthInput || "300px"}
      style={{ zIndex: 1 }}
    >
      <InputStyled
        type="text"
        textcolor={textcolor || "white"}
        placeholder={placeholder}
        background={backcolor || "rgba(0, 0, 0, 0.3)"}
        icon={loading ? loadingIcon : search}
        textplace={textplace}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setLoading(true);
        }}
        input={searchTerm}
        onClick={() => {
          const delayFn = setTimeout(() => {
            if (searchTerm !== "") setShowResults(true);
          }, 1500);

          return () => clearTimeout(delayFn);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            NavigateTo(`SearchPage?searchTerm=${searchTerm}&mode=nft`);
          }
        }}
        height="42px"
      ></InputStyled>
      {showResults ? (
        size.width > 428 ? (
          <SearchResult top={top} left={left} ref={ref}>
            <VStack
              background={({ theme }) => theme.backElement}
              padding={isPhone ? "0px" : "6px 15px 0 15px"}
              border={isPhone ? "0px" : "12px"}
              style={{
                boxShadow: isPhone ? "0" : "0px 15px 15px rgba(0, 0, 0, 0.15)",
              }}
              spacing="0px"
              width={widthInput || "300px"}
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

              {size.width > 768 ? (
                <HStack
                  responsive={size.width > 428 ? false : true}
                  alignment="flex-start"
                  overflowy="auto"
                  height={"auto"}
                  justify={isPhone ? "flex-start" : "center"}
                  padding="15px 0 15px 0"
                >
                  {/* NFTs */}
                  {filteredNFTData.length !== 0 && (
                    <VStack alignment="flex-start" spacing="9px">
                      <CaptionBoldShort>NFTs</CaptionBoldShort>
                      <VStack spacing="12px" width="100%">
                        {filteredNFTData.slice(0, 3).map((nft) => (
                          <HStack
                            whileHover={{ background: "rgb(0,0,0,0.06" }}
                            padding="6px"
                            border="6px"
                            onClick={() =>
                              NavigateTo(`nft/${nft.nftContract}/${nft.tokenId}`)
                            }
                            key={nft._id}
                          >
                            <IconImg
                              url={nft.urlFile.v0}
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
                              <CaptionRegular>
                                {nft.collectionId.name}
                              </CaptionRegular>
                              <CaptionRegular>
                                {nft.owner.userName}
                              </CaptionRegular>
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
                            onClick={() =>
                              NavigateTo(
                                `SearchPage?searchTerm=${searchTerm}&mode=nft`
                              )
                            }
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
                          width="100%"
                          whileHover={{ background: "rgb(0,0,0,0.06" }}
                          padding="6px"
                          border="6px"
                          onClick={() =>
                            NavigateTo(`collection/${collection.nickName}`)
                          }
                          key={collection._id}
                        >
                          <IconImg
                            url={collection.banner.v0}
                            width="100%"
                            height="60px"
                            border="6px"
                            backsize="cover"
                            cursor="pointer"
                          ></IconImg>
                          <HStack>
                            <IconImg
                              url={collection.logo.v0}
                              width="32px"
                              height="32px"
                              border="15px"
                              backsize="cover"
                            ></IconImg>
                            <VStack
                              alignment="flex-start"
                              spacing="3px"
                              cursor="pointer"
                              width="100%"
                            >
                              <BodyBold>{collection.name}</BodyBold>
                              <CaptionRegular>
                                {collection.creator.userName}
                              </CaptionRegular>
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
                            onClick={() =>
                              NavigateTo(
                                `SearchPage?searchTerm=${searchTerm}&mode=collection`
                              )
                            }
                          >
                            <CaptionBoldShort cursor="pointer">
                              See all Collections
                            </CaptionBoldShort>
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
              ) : (
                <VStack
                  responsive={size.width > 428 ? false : true}
                  alignment="flex-start"
                  overflowy="auto"
                  height={isPhone ? "490px" : "300px"}
                  justify={isPhone ? "flex-start" : "center"}
                  padding="15px 0 15px 0"
                >
                  {/* NFTs */}
                  {filteredNFTData.length !== 0 && (
                    <VStack alignment="flex-start" spacing="9px">
                      <CaptionBoldShort>NFTs</CaptionBoldShort>
                      <VStack spacing="12px" width="100%">
                        {filteredNFTData.slice(0, 2).map((nft) => (
                          <HStack
                            whileHover={{ background: "rgb(0,0,0,0.06" }}
                            padding="6px"
                            border="6px"
                            onClick={() =>
                              NavigateTo(`nft/${nft.nftContract}/${nft.tokenId}`)
                            }
                            key={nft._id}
                            width="260px"
                          >
                            <IconImg
                              url={nft.urlFile.v0}
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
                              <CaptionRegular>
                                {nft.collectionId.name}
                              </CaptionRegular>
                              <CaptionRegular>
                                {nft.owner.userName}
                              </CaptionRegular>
                            </VStack>
                          </HStack>
                        ))}
                      </VStack>

                      {filteredNFTData.length > 2 && (
                        <a>
                          <HStack
                            spacing="5px"
                            background={({ theme }) => theme.faded}
                            padding="5px 15px"
                            border="9px"
                            cursor="pointer"
                            onClick={() =>
                              NavigateTo(
                                `SearchPage?searchTerm=${searchTerm}&mode=nft`
                              )
                            }
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
                      {filteredCollectionData.slice(0, 1).map((collection) => (
                        <VStack
                          alignment="flex-start"
                          spacing="9px"
                          width="260px"
                          whileHover={{ background: "rgb(0,0,0,0.06" }}
                          padding="6px"
                          border="6px"
                          onClick={() =>
                            NavigateTo(`collection/${collection.nickName}`)
                          }
                          key={collection._id}
                        >
                          <IconImg
                            url={collection.banner.v0}
                            width="100%"
                            height="60px"
                            border="6px"
                            backsize="cover"
                            cursor="pointer"
                          ></IconImg>
                          <HStack>
                            <IconImg
                              url={collection.logo.v0}
                              width="32px"
                              height="32px"
                              border="15px"
                              backsize="cover"
                            ></IconImg>
                            <VStack
                              alignment="flex-start"
                              spacing="3px"
                              cursor="pointer"
                              width="100%"
                            >
                              <BodyBold>{collection.name}</BodyBold>
                              <CaptionRegular>
                                {collection.creator.userName}
                              </CaptionRegular>
                            </VStack>
                          </HStack>
                        </VStack>
                      ))}

                      {filteredCollectionData.length > 1 && (
                        <a>
                          <HStack
                            spacing="5px"
                            background={({ theme }) => theme.faded}
                            padding="5px 15px"
                            border="9px"
                            cursor="pointer"
                            onClick={() =>
                              NavigateTo(
                                `SearchPage?searchTerm=${searchTerm}&mode=collection`
                              )
                            }
                          >
                            <CaptionBoldShort cursor="pointer">
                              See all Collections
                            </CaptionBoldShort>
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
                </VStack>
              )}
            </VStack>
          </SearchResult>
        ) : (
          <SearchResultMobile top={top} left={left}>
            <VStack
              background={({ theme }) => theme.backElement}
              padding={"6px 15px 0 15px"}
              border={isPhone ? "0px" : "12px"}
              style={{
                boxShadow: isPhone ? "0" : "0px 15px 15px rgba(0, 0, 0, 0.15)",
              }}
              spacing="0px"
              width={widthInput || "300px"}
              minheight="360px"
              overflowy="auto"
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

              <VStack
                alignment="flex-start"
                justify={"flex-start"}
                padding="15px 0 15px 0"
                width={"100%"}
              >
                {/* NFTs */}
                {filteredNFTData.length !== 0
                  ? <VStack alignment="flex-start" spacing="9px" width="100%">
                      <CaptionBoldShort>NFTs</CaptionBoldShort>
                      <VStack spacing="12px" width="100%">
                        {filteredNFTData.slice(0, 2).map((nft) => (
                          <HStack
                            whileHover={{ background: "rgb(0,0,0,0.06" }}
                            padding="6px"
                            border="6px"
                            onClick={() =>
                              NavigateTo(`nft/${nft.nftContract}/${nft.tokenId}`)
                            }
                            key={nft._id}
                            width="100%"
                          >
                            <IconImg
                              url={nft.urlFile.v0}
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
                              <CaptionRegular>
                                {nft.collectionId.name}
                              </CaptionRegular>
                              <CaptionRegular>
                                {nft.owner.userName}
                              </CaptionRegular>
                            </VStack>
                          </HStack>
                        ))}
                      </VStack>

                      {<a>
                          <HStack
                            spacing="5px"
                            background={({ theme }) => theme.faded}
                            padding="5px 15px"
                            border="9px"
                            cursor="pointer"
                            onClick={() =>
                              NavigateTo(
                                `SearchPage?searchTerm=${searchTerm}&mode=nft`
                              )
                            }
                          >
                            <CaptionBoldShort>See all results</CaptionBoldShort>
                            <IconImg
                              url={arrowRight}
                              width="26px"
                              height="26px"
                              cursor="pointer"
                            ></IconImg>
                          </HStack>
                        </a>
                      }
                    </VStack>
                : filteredCollectionData.length !== 0
                  ? <VStack alignment="flex-start" spacing="9px" width="100%">
                    <CaptionBoldShort>Collections</CaptionBoldShort>
                    {filteredCollectionData.slice(0, 2).map((collection) => (
                      <VStack
                        alignment="flex-start"
                        spacing="9px"
                        width="100%"
                        whileHover={{ background: "rgb(0,0,0,0.06" }}
                        padding="6px"
                        border="6px"
                        onClick={() =>
                          NavigateTo(`collection/${collection.nickName}`)
                        }
                        key={collection._id}
                      >
                        <IconImg
                          url={collection.banner.v0}
                          width="100%"
                          height="60px"
                          border="6px"
                          backsize="cover"
                          cursor="pointer"
                        ></IconImg>
                        <HStack>
                          <IconImg
                            url={collection.logo.v0}
                            width="32px"
                            height="32px"
                            border="15px"
                            backsize="cover"
                          ></IconImg>
                          <VStack
                            alignment="flex-start"
                            spacing="3px"
                            cursor="pointer"
                            width="100%"
                          >
                            <BodyBold>{collection.name}</BodyBold>
                            <CaptionRegular>
                              {collection.creator.userName}
                            </CaptionRegular>
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
                          onClick={() =>
                            NavigateTo(
                              `SearchPage?searchTerm=${searchTerm}&mode=collection`
                            )
                          }
                        >
                          <CaptionBoldShort cursor="pointer">
                            See all results
                          </CaptionBoldShort>
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
                  : null
                }
              </VStack>
            </VStack>
          </SearchResultMobile>
        )
      ) : null}
    </VStack>
  );
}

export { Searchbar };

const SearchResult = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 100;
  width: ${(props) => props.width} || 100vw;

  box-sizing: border-box;
`;

const SearchResultMobile = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: ${(props) => props.width} || 100vw;
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
