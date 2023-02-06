import React, { useEffect, useState } from "react";
import { getCollectionNFTs } from "../../API/Collection";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { VStack, HStack } from "../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../styles/TextStyles";
import { GridNFT } from "./GridNFT";

function Step2({ collectionId, onBack, onNext, onComplete }) {
  const [nftsInCollection, setNftsInCollection] = useState([]);
  const [nftsSelected, setNftsSelected] = useState([]);
  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    try {
      const { data } = await getCollectionNFTs({ collectionId });
      let { nfts } = data;
      nfts = nfts.map((nft) => ({ ...nft, isSelected: false }));
      setNftsInCollection(nfts);
    } catch (error) {
      console.info(error);
    }
  };

  const handleNext = () => {
    onComplete(nftsSelected.length > 0, nftsSelected);
    onNext();
  };
  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="600px" alignment="flex-start">
        <TitleBold30>Step2</TitleBold30>

        {nftsInCollection.length ? (
          <GridNFT
            nfts={nftsInCollection}
            onChange={(nfts) => setNftsSelected(nfts)}
          ></GridNFT>
        ) : null}

        <HStack>
          <ButtonM
            title="Go Back"
            background={({ theme }) => theme.faded30}
            onClick={onBack}
            height="52px"
          ></ButtonM>
          <ButtonM
            title="Continue"
            background={({ theme }) => theme.blue}
            textcolor="white"
            onClick={handleNext}
            disabled={nftsSelected.length === 0}
            height="52px"
          ></ButtonM>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { Step2 };
