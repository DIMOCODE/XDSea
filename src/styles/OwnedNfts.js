import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg, ZItem, ZStack, Spacer } from "./Stacks";
import { TitleBold15 } from "./TextStyles";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { nftaddress } from "../config";
import ReactPlayer from "react-player";

function OwnedNfts(props) {
  const { collectionGroup } = props;


  const isImage = (fileType) => {
    return !!fileType?.match("image.*");
  };

  const isVideo = (fileType) => {
    return !!fileType?.match("video.*");
  };

  const isAudio = (fileType) => {
    return !!fileType?.match("audio.*");
  };

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
            props.redirect(`nft/${nftaddress}/${item}`);
          }}
        >
          <ZStack cursor={"pointer"}>
            <CreatorTag>OWNER</CreatorTag>
            <ZItem
              backgroundimage={isAudio(item.fileType) ? item.preview : null}
            >
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
                </HStack>
                <Spacer></Spacer>
                <TitleBold15 textcolor={appStyle.colors.white}>
                  {item.name}
                </TitleBold15>
              </VStack>
            </ZItem>
          </ZStack>
        </VStack>
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
