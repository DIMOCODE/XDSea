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
  const { selected, onSelect } = props;

  const handleSelect = () => {
    onSelect(!selected);
  };

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
        {selected ? (
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
    </VStack>
  );
}

function GridNFT({ nfts, onChange }) {
  const [nftsSelected, setNftsSelected] = useState(nfts);

  useEffect(() => {}, [nftsSelected]);

  const handleSelect = (id, selected) => {
    const nftsUpdated = nftsSelected.map((nft) =>
      nft._id === id ? { ...nft, isSelected: selected } : { ...nft }
    );
    setNftsSelected(nftsUpdated);
    onChange(nftsUpdated.filter((nft) => nft.isSelected));
  };

  const handleDeselectAll = () => {
    const nftsUpdated = nftsSelected.map((nft) => ({
      ...nft,
      isSelected: false,
    }));
    setNftsSelected(nftsUpdated);
    onChange([]);
  };

  const handleSelectAll = () => {
    const nftsUpdated = nftsSelected.map((nft) => ({
      ...nft,
      isSelected: true,
    }));
    setNftsSelected(nftsUpdated);
    onChange(nftsUpdated);
  };

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
          {nftsSelected.map((nft) => (
            <NFTBox
              key={nft._id}
              id={nft._id}
              image={nft.urlFile.v0}
              title={nft.name}
              selected={nft.isSelected}
              onSelect={(selected) => handleSelect(nft._id, selected)}
              handleDeselectAll={handleDeselectAll}
            />
          ))}
        </HStack>
      </HStack>
      <BodyBold>
        {nftsSelected.filter((nft) => nft.isSelected).length +
          " items selected"}
      </BodyBold>
    </VStack>
  );
}

export { GridNFT };

const AbsoluteCheck = styled(motion.div)`
  position: absolute;
  top: 6px;
  right: 6px;
`;
