import React from "react";
import { VStack, IconImg, ZStack, HStack, ZItem, Spacer } from "./Stacks";
import {
  BodyRegular,
  CaptionRegular,
  BodyBold,
  TitleBold15,
} from "./TextStyles";
import multimediaIcon from "../images/uploadicon.png";
import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { UploadLogo } from "./UploadLogo";
import { isAudio, isImage, isVideo } from "../common";
import ReactPlayer from "react-player";
import audioCover from "../images/coverAudio.png";

function UploadMultimedia(props) {
  const {
    button,
    width,
    height,
    sizeText,
    secondaryFile,
    secondaryButton,
    secondaryUploading,
    onClickSecondary,
    border,
    file,
    isUploading,
    description,
    setBorder,
    borderLoader,
  } = props;

  const borderColor = {
    border: "6px solid #FFFFFF",
  };

  return (
    <MultimediaBox>
      {!file.preview ? (
        <label htmlFor={button}>
          <VStack
            width={width}
            height={height}
            border={border}
            background={({ theme }) => theme.backElement}
            whileTap={{ scale: 0.96 }}
            spacing="0px"
            cursor="pointer"
            overflow="hidden"
          >
            <IconImg
              url={multimediaIcon}
              width="45px"
              height="40px"
              cursor="pointer"
            ></IconImg>
            <VStack maxheight="60px" spacing="6px" cursor="pointer">
              <BodyBold>{description}</BodyBold>
              <CaptionRegular align="Center">{sizeText}</CaptionRegular>
            </VStack>
          </VStack>
        </label>
      ) : isImage(file.fileType) ? (
        <ZStack>
          <ZStack>
            <ZItem>
              <VStack
                width={width}
                height={height}
                border={border}
                background={({ theme }) => theme.backElement}
                overflow="hidden"
                overflowy="hidden"
                cursor="pointer"
                style={setBorder && borderColor}
              >
                <IconImg
                  url={file.preview}
                  alt="image"
                  width="100%"
                  height="100%"
                  backsize="cover"
                />
              </VStack>
            </ZItem>
            {isUploading && (
              <ZItem>
                <VStack
                  background={appStyle.colors.darkgrey90}
                  border={borderLoader || "15px"}
                >
                  <UploadLogo></UploadLogo>
                </VStack>
              </ZItem>
            )}
          </ZStack>
        </ZStack>
      ) : isVideo(file.fileType) ? (
        <VStack
          width={width}
          height={height}
          border={border}
          background={({ theme }) => theme.backElement}
          cursor="pointer"
          overflow="hidden"
          overflowx="hidden"
          overflowy="hidden"
        >
          <ZStack>
            <ZItem>
              <ReactPlayer
                url={file.preview}
                playing={true}
                muted={true}
                loop={true}
                width="100%"
                height="100%"
              />
            </ZItem>
            {isUploading && (
              <ZItem>
                <VStack
                  background={appStyle.colors.darkgrey90}
                  border={borderLoader || "15px"}
                >
                  <UploadLogo></UploadLogo>
                </VStack>
              </ZItem>
            )}
          </ZStack>
        </VStack>
      ) : isAudio(file.fileType) ? (
        <VStack
          width={width}
          height={height}
          border={border}
          background={({ theme }) => theme.backElement}
          overflow="hidden"
          cursor="pointer"
          padding="0"
          style={{ zIndex: 100 }}
        >
          <ZStack>
            {secondaryFile.raw !== "" ? (
              <ZItem>
                <IconImg
                  url={secondaryFile.preview}
                  width="100%"
                  height="100%"
                  backsize="cover"
                  border="12px"
                ></IconImg>
                <AbsoluteCoverBtn>
                  <HStack
                    background={appStyle.colors.yellow}
                    onClick={onClickSecondary}
                    border="9px"
                    height="39px"
                  >
                    <BodyRegular textcolor={appStyle.colors.darkyellow}>
                      Remove Cover
                    </BodyRegular>
                  </HStack>
                </AbsoluteCoverBtn>
              </ZItem>
            ) : (
              <ZItem>
                <label
                  htmlFor={secondaryButton}
                  style={{ width: "100%", height: "100%" }}
                >
                  <VStack padding="30px" whileTap={{ scale: 0.96 }}>
                    <Spacer></Spacer>
                    <VStack width="180px">
                      <IconImg
                        url={audioCover}
                        width="60px"
                        height="60px"
                        style={{ cursor: "pointer" }}
                      ></IconImg>
                      <TitleBold15 style={{ cursor: "pointer" }} align="center">
                        Upload a Cover Audio
                      </TitleBold15>
                      <BodyRegular
                        align="center"
                        textcolor={({ theme }) => theme.text}
                        style={{ cursor: "pointer" }}
                      >
                        Compatible: jpg, png, gif
                      </BodyRegular>
                    </VStack>
                    <Spacer></Spacer>
                  </VStack>
                </label>
              </ZItem>
            )}
            {secondaryUploading && (
              <ZItem>
                <VStack
                  background={appStyle.colors.darkgrey90}
                  border={borderLoader || "15px"}
                >
                  <UploadLogo></UploadLogo>
                </VStack>
              </ZItem>
            )}
            <PlayerAbsolute>
              <ReactPlayer
                url={file.preview}
                playing={true}
                muted={true}
                controls={true}
                loop={true}
                width="100%"
                height="100%"
              />
            </PlayerAbsolute>
            {isUploading && (
              <ZItem>
                <VStack
                  background={appStyle.colors.darkgrey90}
                  border={borderLoader || "15px"}
                >
                  <UploadLogo></UploadLogo>
                </VStack>
              </ZItem>
            )}
          </ZStack>
        </VStack>
      ) : null}
    </MultimediaBox>
  );
}

export { UploadMultimedia };

const MultimediaBox = styled(motion.div)``;

const PlayerAbsolute = styled(motion.div)`
  position: absolute;
  width: 100%;

  height: 54px;
  bottom: 80px;
  padding: 0 55px;
`;

const AbsoluteCoverBtn = styled(motion.div)`
  position: absolute;
  width: 128px;
  height: 100px;
  top: 15px;
  right: 15px;
`;
