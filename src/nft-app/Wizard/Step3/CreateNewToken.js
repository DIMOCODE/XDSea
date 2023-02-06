import React, { useEffect, useRef, useState } from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import styled from "styled-components";
import imageSelector from "../../../images/ImageSelector.svg";
import { ActionButtons } from "../ActionButtons";

function CreateNewToken(props) {
  const { onSave } = props;
  const inputFile = useRef(null);

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  useEffect(() => {
    setFormIsValid(address !== "" && name !== "" && color !== "" && imgLoaded);

    return () => {};
  }, [address, name, color, imgLoaded]);

  const handleOnCreate = () => {
    onSave({
      addressContract: address,
      type: "token",
      name,
      color,
      imgFile,
      iconUrl: imgLoaded,
      _id: address,
    });
  };

  const handleImageChange = (event) => {
    event.preventDefault();

    if (event.target.files.length) {
      let reader = new FileReader();
      let file = event.target.files[0];

      reader.onloadend = () => {
        setImgFile(file);
        setImgLoaded(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setImgLoaded("");
    }
  };

  const handlefile = () => {
    inputFile.current.click();
  };
  return (
    <VStack width="100%" maxheight="420px">
      <VStack spacing="9px">
        <IconImg
          url={imgLoaded ?? imageSelector}
          width="90px"
          height="90px"
          onClick={handlefile}
          cursor="pointer"
        ></IconImg>
        <BodyMedium>Upload Token</BodyMedium>
      </VStack>

      <VStack height="90px" width="100%" alignment="flex-start">
        <BodyMedium>Token Contact Address</BodyMedium>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={"Contract Address"}
        />
      </VStack>

      <HStack>
        <VStack height="90px" alignment="flex-start">
          <BodyMedium>Token Name</BodyMedium>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"Ej. XDC"}
          />
        </VStack>

        <VStack height="90px" alignment="flex-start">
          <BodyMedium>Hex Color Token</BodyMedium>
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder={"#1f42f8"}
          />
        </VStack>
      </HStack>

      <ActionButtons
        grayBtn="Cancel"
        onClickGray={props.onClickCancel}
        blueBtn="Create Token"
        onClickBlue={handleOnCreate}
        blueBtnDisabled={!formIsValid}
      ></ActionButtons>

      <input
        type="file"
        ref={inputFile}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </VStack>
  );
}

export { CreateNewToken };

const Input = styled.input`
  background: ${({ theme }) => theme.faded30};
  border: 2px solid rgba(0, 0, 0, 0);
  height: 52px;
  width: 100%;
  padding: 9px 9px 9px 21px;
  border-radius: 9px;
  outline: 0;
  text-align: center;

  &:focus {
    outline: none;
    border: 2px solid #1f42f8;
  }
`;
