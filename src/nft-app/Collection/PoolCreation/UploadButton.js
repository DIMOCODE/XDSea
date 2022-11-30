import React from "react";
import { useRef } from "react";
import { IconImg, VStack, HStack } from "../../../styles/Stacks";
import { TitleBold15 } from "../../../styles/TextStyles";
import file from "../../../images/fileIcon.png";

function UploadButton(props) {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };

  return (
    <>
      <HStack
        height="52px"
        background={({ theme }) => theme.faded}
        border="6px"
        onClick={handleClick}
        cursor="pointer"
        whileTap={{ scale: 0.96 }}
      >
        <TitleBold15 cursor="pointer">Upload</TitleBold15>
        <IconImg
          url={file}
          width="18px"
          height="18px"
          cursor="pointer"
        ></IconImg>
      </HStack>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
}

export { UploadButton };
