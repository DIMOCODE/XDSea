import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg, ZItem, ZStack, Spacer } from "./Stacks";
import { TitleBold15 } from "./TextStyles";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { nftaddress } from "../config";
import banner1 from "../images/Banner1.jpg";
import ReactPlayer from "react-player";

function OwnedNfts(props) {
  const { collectionGroup } = props;

  const history = useHistory();

  const isImage = (fileType) => {
    return !!fileType?.match("image.*");
  };

  const isVideo = (fileType) => {
    return !!fileType?.match("video.*");
  };

  const isAudio = (fileType) => {
    return !!fileType?.match("audio.*");
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  return (
    <VStack
      width="100%"
      key={"Created"}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      id={"scrollableDiv"}
    >
      {collectionGroup.map((item, i) => (
        <VStack
          maxwidth="186px"
          minwidth="186px"
          height="186px"
          border="15px"
          cursor="pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            NavigateTo(`nft/${nftaddress}/${item}`);
          }}
        >
          <ZStack cursor={"pointer"}>
            <CreatorTag>OWNER</CreatorTag>
            <ZItem backgroundimage={isAudio(item.fileType) ? item.preview : null}>
              {isImage(item.fileType) ? (
                <IconImg
                  url={item.image}
                  width="100%"
                  height="100%"
                  backsize="cover"
                  border="15px"
                ></IconImg>
              ) : isVideo(item.fileType) ? (
                <ReactPlayer
                  url={item.image}
                  playing={true}
                  muted={true}
                  volume={0}
                  loop={false}
                  width="100%"
                  height="100%"
                />
              ) : isAudio(item.fileType) ? (
                <ReactPlayer
                  url={item?.image}
                  playing={false}
                  muted={true}
                  volume={0}
                  loop={false}
                  width="100%"
                  height="100%"
                />
              ) : null}
            </ZItem>
            <ZItem>
              <VStack padding="15px">
                <HStack>
                  <Spacer></Spacer>
                  <IconImg
                    url={banner1}
                    width="45px"
                    height="45px"
                    backsize="cover"
                    border="45px"
                    bordersize="3px"
                    bordercolor="white"
                  ></IconImg>
                </HStack>
                <Spacer></Spacer>
                <TitleBold15 textcolor={appStyle.colors.white}>
                  {item.name}
                </TitleBold15>
              </VStack>
            </ZItem>
          </ZStack>
        </VStack>
        // <VStack
        //   width="100%"
        //   padding="30px"
        //   spacing="21px"
        //   alignment="flex-start"
        // >
        //   {console.log(collectionGroup)}
        //   <HStack width="100%">
        //     <IconImg
        //       url={item.logo}
        //       width="60px"
        //       height="60px"
        //       backsize="cover"
        //       border="36px"
        //     ></IconImg>
        /* <VStack spacing="6px" alignment="flex-start">
              <TitleBold18>{item.collection}</TitleBold18>
              <BodyRegular>{item.owned} of {item.items} Items</BodyRegular>
            </VStack> */
          // </HStack>
          // <HStack
          //   flexwrap="wrap"
          //   justify="flex-start"
          //   width="100%"
          //   overflowx="hidden"
          //   overflowy="hidden"
          //   height={expand ? "auto" : "199px"}
          //   onClick={() => setIsExpand((value) => !value)}
          //   padding="6px"
          // >
          //   {item.map((nft, j) => (
              
          //   ))}
          /* <VStack
              maxwidth="186px"
              height="186px"
              border="15px"
              whileHover={{ scale: 1.05 }}
              background={({ theme }) => theme.backElement}
              spacing="6px"
              cursor="pointer"
              onClick={() => {
                NavigateTo(`collection/${item.name}`);
              }}
            >
              <IconImg url={seeAll} width="45px" height="45px"></IconImg>
              <BodyBold>See All</BodyBold>
            </VStack> */
          // </HStack>

            // {item.owned > 5 ? (
            //   <ButtonApp
            //     text={expand ? "See Less" : "See More"}
            //     textcolor={appStyle.colors.white}
            //     border="30px"
            //     onClick={() => onClick(i)}
            //     btnStatus={0}
            //   ></ButtonApp>
            // ) : null}
        // </VStack>
      ))}
    </VStack>
  );
}

export { OwnedNfts };

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 10px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;
