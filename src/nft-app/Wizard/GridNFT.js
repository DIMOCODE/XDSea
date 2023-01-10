import React from "react";
import { useState, useEffect } from "react";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import mountain from "../../images/mountain.jpg";
import checked from "../../images/FilledCheck.svg";
import empty from "../../images/EmptyCheck.svg";
import { BodyBold, BodyMedium, BodyRegular } from "../../styles/TextStyles";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { ButtonM } from "../../styles/Buttons/ButtonM";

function NFTBox(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    setIsSelected(props.selected.includes(props.id));
  }, [props.selected]);

  const handleSelect = () => {
    props.onSelect(props.id);
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    if (props.handleDeselectAll && props.selected.includes(props.id)) {
      setIsSelected(false);
    }
  }, [props.handleDeselectAll, props.selected]);

  return (
    <VStack
      background={({ theme }) => theme.faded30}
      minwidth="141px"
      maxwidth="141px"
      height="141px"
      border="6px"
      padding="9px"
      onClick={handleSelect}
      backgroundimage={props.image}
    >
      <Spacer></Spacer>
      <BodyMedium textcolor="white">{props.title}</BodyMedium>

      <AbsoluteCheck>
        {isSelected ? (
          <IconImg
            url={checked}
            width="30px"
            height="30px"
            backsize="cover"
            onClick={handleSelect}
          ></IconImg>
        ) : (
          <IconImg
            url={empty}
            width="30px"
            height="30px"
            backsize="cover"
            onClick={handleSelect}
          ></IconImg>
        )}
      </AbsoluteCheck>

      {console.log(isSelected)}
    </VStack>
  );
}

function GridNFT() {
  const [selected, setSelected] = useState([]);

  const handleSelect = (id) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
      return [...prevSelected, id];
    });
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  const handleSelectAll = () => {
    setSelected(components.map((component) => component.id));
  };

  const components = [
    { id: 1, title: "Image 1", image: mountain },
    { id: 2, title: "Image 2", image: mountain },
    { id: 3, title: "Image 4", image: mountain },
    { id: 4, title: "Image 5", image: mountain },
    { id: 5, title: "Image 3", image: mountain },
    { id: 6, title: "Image 1", image: mountain },
    { id: 7, title: "Image 2", image: mountain },
    { id: 8, title: "Image 4", image: mountain },
    { id: 9, title: "Image 5", image: mountain },
    { id: 10, title: "Image 3", image: mountain },
    { id: 11, title: "Image 4", image: mountain },
    { id: 12, title: "Image 5", image: mountain },
    { id: 13, title: "Image 3", image: mountain },
  ];

  return (
    <VStack maxheight="526px">
      <HStack>
        <BodyRegular>Choose NFTs from your collection</BodyRegular>

        <Spacer></Spacer>
        <ButtonM
          title="Deselect all"
          height="36px"
          width="145px"
          background={({ theme }) => theme.faded30}
          onClick={handleDeselectAll}
        ></ButtonM>
        <ButtonM
          title="Select all"
          height="36px"
          width="145px"
          background={({ theme }) => theme.faded30}
          onClick={handleSelectAll}
        ></ButtonM>
      </HStack>

      <HStack height="auto" maxheight="444px" overflowy="scroll">
        <HStack
          flexwrap="wrap"
          justify="flex-start"
          alignment="flex-start"
          spacing="9px"
        >
          {components.map((component) => (
            <NFTBox
              key={component.id}
              id={component.id}
              image={component.image}
              title={component.title}
              selected={selected}
              onSelect={handleSelect}
              handleDeselectAll={handleDeselectAll}
            />
          ))}
        </HStack>
      </HStack>
      <BodyBold>{selected.length + " items selected"}</BodyBold>
    </VStack>
  );
}

export { GridNFT };

const AbsoluteCheck = styled(motion.div)`
  position: absolute;
  top: 6px;
  right: 6px;
`;
