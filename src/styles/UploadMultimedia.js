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

function UploadMultimedia(props) {
  const {
    button,
    width,
    height,
    sizeText,
    backsize,
    border,
    image,
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
        {image.preview ? (
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
                    url={image.preview}
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
        ) : (
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
        )}
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
