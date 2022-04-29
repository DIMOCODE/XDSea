import React from "react";
import { useState } from "react";
import { VStack, IconImg, ZStack, HStack, Spacer } from "./Stacks";
import { BodyRegular, CaptionBoldShort } from "./TextStyles";
import multimediaIcon from "../images/multimedia.png";
import updateIcon from "../images/update.png";
import styled from "styled-components";
import { appStyle } from "./AppStyles";

function UploadMultimedia(props) {
  const { width, height, sizeText, backsize, border } = props;

  const [image, setImage] = useState({ preview: "", raw: "" });

  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image.raw);

    await fetch("YOUR_URL", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  };

  return (
    <div>
      <label htmlFor="upload-button">
        {image.preview ? (
          <ZStack>
            <VStack
              width={width}
              height={height}
              border={border}
              background={({ theme }) => theme.backElement}
              overflow="hidden"
            >
              <img src={image.preview} alt="image" width="100%" height="100%" />
            </VStack>
            <TagUpload>
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
            </TagUpload>
          </ZStack>
        ) : (
          <VStack
            width={width}
            height={height}
            border={border}
            background={({ theme }) => theme.backElement}
          >
            <IconImg url={multimediaIcon} width="52px" height="40px"></IconImg>

            <BodyRegular align="Center">
              {sizeText} <br></br>
              Supported: JPG, PNG, GIF, SVG. <br></br>
              Max size: 100 MB <br></br>
            </BodyRegular>
          </VStack>
        )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleUpload}>Upload</button>
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
