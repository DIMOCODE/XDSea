import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Xdc3 from "xdc3";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import { DEFAULT_PROVIDER, HEADER, LS_ROOT_KEY, LS } from "../../constant";
import NFT from "../../abis/NFT.json";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import { LoopLogo } from "../../styles/LoopLogo";
import { deletedCollections, verifiedProfiles } from "../../blacklist";
import emptyCollection from "../../images/emptyCollection.png";
import emptyNFT from "../../images/emptyNFT.png";

import axios from "axios";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import { burnedNFTs } from "../../blacklist";
import copyIcon from "../../images/copyAddress.png";
import verified from "../../images/verified.png";

import styled from "styled-components";
import {
  HStack,
  Spacer,
  VStack,
  IconImg,
  ZStack,
  ZItem,
} from "../../styles/Stacks";
import { motion } from "framer-motion/dist/framer-motion";
import {
  BodyRegular,
  CaptionBold,
  TitleBold15,
  TitleBold18,
  CaptionBoldShort,
  CaptionSmallRegular,
} from "../../styles/TextStyles";
import xdcLogo from "../../images/miniXdcLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";
import { appStyle } from "../../styles/AppStyles";
import { BubbleCopied } from "../../styles/BubbleCopied";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import CID from "cids";
import { getNFTs } from "../../API/NFT";
import { getCollections } from "../../API/Collection";
import { isSafari } from "../../common/common";
import { getUser } from "../../API/User";

const MyNFT = (props) => {
  const { userId } = useParams();
  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [user, setUser] = useState({});
  const [nftParams, setNftParams] = useState({
    pageSize: 15, 
    page: 1, 
    userId: userId
  });
  const [collectionParams, setCollectionParams] = useState({
    userId: userId
  })

  /**
   * Get the owned collections of the user
   */
  const getCreatedCollections = async () => {
    const collectionData = await (await getCollections(collectionParams)).data;

    setCollections(collectionData.collections);
    setLoadingCollection(false);
  };

  /**
   * Get the first page of owned NFTs of the user
   */
  const getOwnedNFTs = async () => {
    await Promise.all(
      [1, 2].map(async (i) => {
        if (i === 1) {
          let userData = await (await getUser(userId)).data.user;
          setUser(userData);
        } else {
          let nftData = await (await getNFTs(nftParams)).data;

          setNfts(nftData.nfts);
          setTotalNfts(nftData.nftsAmount);
        }
      })
    );

    setNftParams({
      ...nftParams,
      page: nftParams.page + 1
    });
    setLoading(false);
  };

  /**
   * Get the next page of owned NFTs of the user
   */
  const fetchMoreNFTs = async () => {
    const nftData = await (await getNFTs(nftParams)).data;

    setNfts([...nfts, ...nftData.nfts]);
    setNftParams({
      ...nftParams,
      page: nftParams.page + 1
    });
  };

  const isImage = (fileType) => {
    return !!fileType?.match("image.*");
  };

  const isVideo = (fileType) => {
    return !!fileType?.match("video.*");
  };

  const isAudio = (fileType) => {
    return !!fileType?.match("audio.*");
  };

  const [subMenu, setSubMenu] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSubMenu(0);
    setLoading(true);
    getOwnedNFTs();
  }, [userId]);

  const size = useWindowSize();

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const [, setShowMenu] = useState(props.showMenu);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();

  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
      setShowMenu(false);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  useEffect(() => {}, [scrolling]);

  return (
    <UserSection>
      <Content id="scrollableDiv">
        <VStack spacing="36px" width="100%">
          {/* Account information  */}
          <VStack>
            <VStack direction={size.width < 768 ? "row" : "column"}>
              <VStack>
                {user.isVerified ? (
                  <VerifiedIcon>
                    <IconImg
                      url={verified}
                      width="39px"
                      height="39px"
                    ></IconImg>
                  </VerifiedIcon>
                ) : null}
                <IconImg
                  url={user.urlProfile}
                  width={size.width < 768 ? "120px" : "150px"}
                  height={size.width < 768 ? "120px" : "150px"}
                  border="90px"
                  backsize="cover"
                  bordercolor="white"
                  bordersize="6px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                  }}
                ></IconImg>
              </VStack>

              <VStack spacing="9px" direction="column">
                <CaptionBold textcolor={({ theme }) => theme.text}>
                  CREATOR
                </CaptionBold>
                <BubbleCopied
                  logo={xdcLogo}
                  address={user.XDCWallets ? user.XDCWallets[0] : ""}
                  icon={copyIcon}
                ></BubbleCopied>
              </VStack>
            </VStack>
          </VStack>

          {/* Creator buttons  Owned NFTs or Created Collections */}
          <VStack
            maxwidth={size.width < 768 ? "100%" : "70%"}
            minwidth={size.width < 768 ? "100%" : "70%"}
          >
            <HStack>
              <ButtonApp
                background={
                  subMenu === 0
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Owned"
                height="39px"
                onClick={() => setSubMenu(0)}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp>

              <ButtonApp
                background={
                  subMenu === 1
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Created Collections"
                height="39px"
                onClick={() => {
                  setSubMenu(1);
                  setLoadingCollection(true);
                  getCreatedCollections();
                }}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp>
            </HStack>
          </VStack>

          {/* Content of result of filtering Owned or Created Collections */}
          <AnimatePresence>
            <ZStack>
              {subMenu === 0 && (
                <VStack
                  width="100%"
                  key={"Created"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  id={"scrollableDiv"}
                >
                  {loading ? (
                    <VStack padding="120px">
                      <LoopLogo></LoopLogo>
                    </VStack>
                  ) : nfts.length !== 0 ? (
                    <InfiniteScroll
                      dataLength={nfts.length}
                      next={fetchMoreNFTs}
                      hasMore={nfts.length < totalNfts}
                      scrollThreshold={0.6}
                      loader={
                        <HStack
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          height="190px"
                        >
                          <LoopLogo></LoopLogo>
                        </HStack>
                      }
                      scrollableTarget="#scrollableDiv"
                      style={{ overflow: "hidden" }}
                    >
                      <HStack
                        flexwrap="wrap"
                        width="100%"
                        padding="0 60px"
                        justify="flex-start"
                      >
                        {nfts.map((item, i) => (
                          <VStack
                            maxwidth="186px"
                            minwidth="186px"
                            height="186px"
                            border="15px"
                            cursor="pointer"
                            overflow="hidden"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                              props.redirect(`nft/${nftaddress}/${item.tokenId}`);
                            }}
                          >
                            <ZStack cursor={"pointer"}>
                              {item.hasOpenOffer ? (
                                <BubbleOffers>
                                  <HStack
                                    background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                                    width="26px"
                                    height="26px"
                                    border="300px"
                                    padding="0 6px"
                                    spacing="6px"
                                  >
                                    <CaptionBoldShort textcolor="white">
                                      !
                                    </CaptionBoldShort>
                                  </HStack>
                                </BubbleOffers>
                              ) : null}
                              <ZItem
                                backgroundimage={
                                  isAudio(item.fileType) 
                                    ? isSafari
                                      ? item.preview.v1
                                      : item.preview.v0 
                                    : null
                                }
                              >
                                {isImage(item.fileType) ? (
                                  <IconImg
                                    url={isSafari
                                      ? item.urlFile.v1
                                      : item.urlFile.v0
                                    }
                                    width="100%"
                                    height="100%"
                                    backsize="cover"
                                    border="15px"
                                  ></IconImg>
                                ) : isVideo(item.fileType) ? (
                                  <VStack
                                    width="186px"
                                    height="186px"
                                    border="9px"
                                    overflow="hidden"
                                  >
                                    <ReactPlayer
                                      url={isSafari
                                        ? item.urlFile.v1
                                        : item.urlFile.v0
                                      }
                                      playing={true}
                                      volume={0}
                                      muted={true}
                                      loop={false}
                                      width="100%"
                                      height="160%"
                                    />
                                  </VStack>
                                ) : isAudio(item.fileType) ? (
                                  <VStack
                                    width="186px"
                                    height="186px"
                                    border="15px"
                                    overflow="hidden"
                                  >
                                    <ReactPlayer
                                      url={isSafari
                                        ? item.urlFile.v1
                                        : item.urlFile.v0
                                      }
                                      playing={false}
                                      muted={true}
                                      volume={0}
                                      loop={false}
                                      width="50%"
                                      height="50%"
                                      style={{ borderRadius: 15 }}
                                    />
                                  </VStack>
                                ) : null}
                              </ZItem>
                              <ZItem>
                                <VStack padding="15px">
                                  <Spacer></Spacer>
                                  <TitleBold15
                                    textcolor={appStyle.colors.white}
                                  >
                                    {item.name}
                                  </TitleBold15>
                                </VStack>
                              </ZItem>
                            </ZStack>
                          </VStack>
                        ))}
                      </HStack>
                    </InfiniteScroll>
                  ) : (
                    <VStack
                      border="15px"
                      width="100%"
                      minheight="300px"
                      background={({ theme }) => theme.backElement}
                    >
                      <IconImg
                        url={emptyNFT}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <BodyRegular>
                        This creator does not have any NFT yet
                      </BodyRegular>
                    </VStack>
                  )}
                </VStack>
              )}
              {subMenu === 1 && (
                <VStack
                  width="100%"
                  key={"Created"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                >
                  {loadingCollection ? (
                    <VStack padding="120px">
                      <LoopLogo></LoopLogo>
                    </VStack>
                  ) : collections.length ? (
                    collections.map((item, i) => (
                      <VStack width="100%" padding="30px" spacing="30px">
                        <HStack width="100%">
                          <IconImg
                            url={isSafari
                              ? item.logo.v1
                              : item.logo.v0
                            }
                            width="60px"
                            height="60px"
                            backsize="cover"
                            border="36px"
                          ></IconImg>
                          <VStack spacing="6px" alignment="flex-start">
                            <TitleBold18>{item.name}</TitleBold18>
                            <BodyRegular>{item.totalNfts} Items</BodyRegular>
                          </VStack>
                        </HStack>
                        <HStack justify="flex-start">
                          {item.nfts.map((nft, j) => (
                            <VStack
                              maxwidth="186px"
                              height="186px"
                              border="15px"
                              whileHover={{ scale: 1.05 }}
                              overflow="hidden"
                              onClick={() => {
                                props.redirect(`nft/${nftaddress}/${nft.tokenId}`);
                              }}
                            >
                              <ZStack cursor={"pointer"}>
                                <ZItem
                                  backgroundimage={
                                    isAudio(nft.fileType)
                                      ? isSafari
                                        ? nft.preview.v1
                                        : nft.preview.v0
                                      : null
                                  }
                                >
                                  {isImage(nft.fileType) ? (
                                    <IconImg
                                      url={
                                        isSafari
                                          ? nft.urlFile.v1
                                          : nft.urlFile.v0
                                      }
                                      width="100%"
                                      height="100%"
                                      backsize="cover"
                                      border="15px"
                                    ></IconImg>
                                  ) : isVideo(nft.fileType) ? (
                                    <VStack
                                      width="186px"
                                      height="186px"
                                      border="9px"
                                      overflow="hidden"
                                    >
                                      <ReactPlayer
                                        url={
                                          isSafari
                                            ? nft.urlFile.v1
                                            : nft.urlFile.v0
                                        }
                                        playing={true}
                                        muted={true}
                                        loop={false}
                                        volume={0}
                                        width="100%"
                                        height="180%"
                                      />
                                    </VStack>
                                  ) : isAudio(nft.fileType) ? (
                                    <VStack
                                      width="186px"
                                      height="186px"
                                      border="9px"
                                      overflow="hidden"
                                    >
                                      <ReactPlayer
                                        url={
                                          isSafari
                                            ? nft.urlFile.v1
                                            : nft.urlFile.v0
                                        }
                                        playing={false}
                                        muted={true}
                                        volume={0}
                                        loop={false}
                                        width="100%"
                                        height="100%"
                                      />
                                    </VStack>
                                  ) : null}
                                </ZItem>
                                <ZItem>
                                  <VStack padding="15px">
                                    <Spacer></Spacer>
                                    <TitleBold15
                                      textcolor={appStyle.colors.white}
                                    >
                                      {truncate(nft.name, 33)}
                                    </TitleBold15>
                                  </VStack>
                                </ZItem>
                              </ZStack>
                            </VStack>
                          ))}
                        </HStack>
                        {item.totalNfts > 5 ? (
                          <ButtonApp
                            text={"See Collection"}
                            textcolor={appStyle.colors.white}
                            border="30px"
                            onClick={() =>
                              props.redirect(`collection/${item.nickName}`)
                            }
                            btnStatus={0}
                          ></ButtonApp>
                        ) : null}
                      </VStack>
                    ))
                  ) : (
                    <VStack
                      border="15px"
                      width="100%"
                      minheight="300px"
                      background={({ theme }) => theme.backElement}
                    >
                      <IconImg
                        url={emptyCollection}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <BodyRegular>
                        This creator has not yet created any collection
                      </BodyRegular>
                    </VStack>
                  )}
                </VStack>
              )}
            </ZStack>
          </AnimatePresence>
        </VStack>
      </Content>
    </UserSection>
  );
};

export default MyNFT;

const UserSection = styled(motion.div)`
  padding: 120px 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
`;

const Content = styled(motion.div)`
  padding: 0px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const VerifiedIcon = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  right: 6px;
  z-index: 10;
`;

const BubbleOffers = styled(motion.div)`
  top: 12px;
  right: 12px;
  position: absolute;
  z-index: 100;
`;
