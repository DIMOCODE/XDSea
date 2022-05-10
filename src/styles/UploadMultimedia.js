import React from "react";
import { VStack, IconImg, ZStack, HStack, ZItem } from "./Stacks";
import { BodyRegular, CaptionRegular, BodyBold } from "./TextStyles";
import multimediaIcon from "../images/uploadicon.png";
import updateIcon from "../images/update.png";
import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { UploadLogo } from "./UploadLogo";

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
  } = props;

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
                >
                  <IconImg
                    url={image.preview}
                    alt="image"
                    width="100%"
                    height="100%"
                    backsize="cover"
                  />
                </VStack>
              </ZItem>
              {isUploading && (
                <ZItem>
                  <VStack background={appStyle.colors.darkgrey90} border="15px">
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
          >
            <IconImg url={multimediaIcon} width="62px" height="50px"></IconImg>

            <VStack maxheight="60px" spacing="6px">
              <BodyBold>Click Here to Upload Media</BodyBold>
              <CaptionRegular align="Center">
                {sizeText} <br></br>
                Max size: 100 MB <br></br>
              </CaptionRegular>
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
