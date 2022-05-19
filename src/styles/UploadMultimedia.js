import React from "react";
import { useState } from "react";
import { VStack, IconImg, ZStack, HStack, ZItem, Spacer } from "./Stacks";
import {
  BodyRegular,
  CaptionRegular,
  BodyBold,
  CaptionBold,
  TitleBold15,
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
import audioCover from "../images/coverAudio.png";

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

  const [selectedImage, setSelectedImage] = useState(null);
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
          >
            <IconImg url={multimediaIcon} width="45px" height="40px"></IconImg>

            <VStack maxheight="60px" spacing="6px">
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
          <ZStack>
            <ZItem>
              <ReactPlayer
                url={
                  file.preview
                }
                playing={true}
                muted={true}
                loop={true}
                width="180%"
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
            {selectedImage ? (
              <ZItem>
                <IconImg
                  url={URL.createObjectURL(selectedImage)}
                  width="100%"
                  height="100%"
                  backsize="cover"
                  border="12px"
                ></IconImg>
                <AbsoluteCoverBtn>
                  <HStack
                    background={appStyle.colors.yellow}
                    onClick={() => setSelectedImage(null)}
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
                  htmlFor="my-file"
                  style={{ width: "100%", height: "100%" }}
                >
                  <VStack padding="30px" whileTap={{ scale: 0.96 }}>
                    <Spacer></Spacer>

                    <VStack width="180px">
                      <IconImg
                        url={audioCover}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <TitleBold15 align="center">
                        Upload a Cover Audio
                      </TitleBold15>
                      <BodyRegular
                        align="center"
                        textcolor={({ theme }) => theme.text}
                      >
                        Compatible: jpg, png, gif
                      </BodyRegular>
                    </VStack>

                    <input
                      type="file"
                      name="myImage"
                      id="my-file"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                      }}
                    />
                    <Spacer></Spacer>
                  </VStack>
                </label>
              </ZItem>
            )}

            <PlayerAbsolute>
              <ReactPlayer
                url={
                  file.preview
                }
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
