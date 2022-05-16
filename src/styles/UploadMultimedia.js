import React from "react";
import { VStack, IconImg, ZStack, HStack, ZItem } from "./Stacks";
import {
  BodyRegular,
  CaptionRegular,
  BodyBold,
  CaptionBold,
} from "./TextStyles";
import multimediaIcon from "../images/uploadicon.png";
import updateIcon from "../images/update.png";
import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { UploadLogo } from "./UploadLogo";
import checkOK from "../images/checkOK.png";
import tryAgain from "../images/tryAgain.png";
import { isAudio, isImage, isVideo } from "../common";
import ReactPlayer from "react-player";

function UploadMultimedia(props) {
  const {
    button,
    width,
    height,
    sizeText,
    backsize,
    border,
    file,
    isUploading,
    description,
    setBorder,
    uploadConfirmed,
    uploadFailed,
    borderLoader,
  } = props;

  const borderColor = {
    border: "6px solid #FFFFFF",
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", image.raw);

  //   await fetch("YOUR_URL", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: formData,
  //   });
  // };

  return (
    <div>
      <label htmlFor={button}>
        {!file.preview ? (
          <VStack
            width={width}
            height={height}
            border={border}
            background={({ theme }) => theme.backElement}
            whileTap={{ scale: 0.96 }}
            spacing="0px"
          >
            <IconImg url={multimediaIcon} width="45px" height="40px"></IconImg>

            <VStack maxheight="60px" spacing="6px">
              <BodyBold>{description}</BodyBold>
              <CaptionRegular align="Center">{sizeText}</CaptionRegular>
            </VStack>
          </VStack>
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

                  {uploadConfirmed && (
                    <ConfirmUpload>
                      <HStack
                        spacing="6px"
                        background={appStyle.colors.darkgrey90}
                        border="30px"
                        padding="6px 12px"
                      >
                        <BodyRegular textcolor="white">Uploaded</BodyRegular>
                        <IconImg
                          url={checkOK}
                          width="30px"
                          height="30px"
                        ></IconImg>
                      </HStack>
                    </ConfirmUpload>
                  )}

                  {uploadFailed && (
                    <ConfirmUpload>
                      <HStack
                        spacing="6px"
                        background={appStyle.colors.darkgrey90}
                        border="30px"
                        padding="9px 12px"
                      >
                        <BodyRegular textcolor="white">
                          Upload Failed, try again
                        </BodyRegular>
                        <IconImg
                          url={tryAgain}
                          width="21px"
                          height="21px"
                        ></IconImg>
                      </HStack>
                    </ConfirmUpload>
                  )}
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

            {/* <TagUpload>
              <HStack height="60px">
                <HStack
                  height="36px"
                  background={appStyle.colors.darkgrey60}
                  border="9px"
                  width="160px"
                  spacing="6px"
                >
                  <BodyRegular textcolor={appStyle.colors.white}>
                    Change Content
                  </BodyRegular>
                  <IconImg
                    url={updateIcon}
                    width="18px"
                    height="18px"
                  ></IconImg>
                </HStack>
              </HStack>
            </TagUpload> */}
          </ZStack>
        ) : isVideo(file.fileType) ? (
          <VStack
            width={width}
            height={height}
            border={border}
            background={({ theme }) => theme.backElement}
            overflow="hidden"
            cursor="pointer"
          >
            <ReactPlayer
              url={
                "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
              }
              playing={true}
              muted={true}
              loop={true}
              width="100%"
              height="100%"
            />
          </VStack>
        ) : isAudio(file.fileType) ? (
          <VStack
            width={width}
            height={height}
            border={border}
            background={({ theme }) => theme.backElement}
            overflow="hidden"
            cursor="pointer"
            padding="15px 15px 66px 15px"
          >
            <ReactPlayer
              url={
                "https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
              }
              playing={true}
              muted={true}
              controls={true}
              loop={true}
              width="100%"
              height="100%"
            />
          </VStack>
        ) : null}
      </label>
    </div>
  );
}

export { UploadMultimedia };

const TagUpload = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
  cursor: pointer;
`;

const ConfirmUpload = styled.div`
  position: absolute;
  bottom: 15px;
`;
