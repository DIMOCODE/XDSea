import React, { useEffect, useState } from "react";
import { HStack, VStack } from "../../../styles/Stacks";
import { TitleBold30, BodyRegular, BodyBold } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { NFTValue } from "./NFTValue";
import { ToggleBtn } from "./ToggleBtn";

function Step4(props) {
  const { isBackedValue, onComplete, onBack, onNext } = props;
  const { nftsStakeables } = props;
  const [isOn, setIsOn] = useState(!!isBackedValue);
  const [nftsBackedValues, setNftsBackedValues] = useState([]);

  useEffect(() => {
    const nftsWithBackedValues = nftsStakeables.map((nft) => ({
      _id: nft._id,
      backedValue: nft.backedValue ?? "",
      urlFile: nft.urlFile,
      name: nft.name,
    }));

    setNftsBackedValues(nftsWithBackedValues);
  }, [nftsStakeables]);

  const handleOn = () => {
    setIsOn(!isOn);
    console.log(nftsStakeables);
  };

  const onChangeNft = (id, value) => {
    const updated = nftsBackedValues.map((nft) =>
      nft._id === id ? { ...nft, backedValue: value } : nft
    );
    setNftsBackedValues(updated);
  };

  const saveBackdValues = () => {
    onComplete(true, nftsBackedValues);
    onNext();
  };

  return (
    <HStack width="100%">
      <VStack maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 4</TitleBold30>
        <BodyBold>What is a Backed Value?</BodyBold>
        <BodyRegular>
          If a reseller tries to change the price of one of your NFT, the reward
          will always remain the same
        </BodyRegular>

        <HStack
          bordersize="2px"
          bordercolor={({ theme }) => theme.faded30}
          padding="15px 15px 0 15px"
          border="6px"
        >
          <VStack width="100%" spacing="15px">
            <HStack padding="0 0 15px 0">
              {nftsStakeables.length ? (
                <>
                  <BodyRegular>
                    Do you want to activate the Backed Value on your NFTs?
                  </BodyRegular>

                  <ToggleBtn value={isOn} onClick={handleOn}></ToggleBtn>
                </>
              ) : (
                <BodyRegular>
                  First you need to select which nfts will be available for
                  stake
                </BodyRegular>
              )}
            </HStack>

            {isOn && (
              <VStack
                maxheight="300px"
                overflowy="scroll"
                justify="flex-start"
                width="100%"
                padding="0 9px 15px 0"
              >
                {nftsBackedValues.map((nft) => (
                  <NFTValue
                    key={nft._id}
                    name={nft.name}
                    image={nft.urlFile.v0}
                    value={nft.backedValue}
                    onChange={(value) => onChangeNft(nft._id, value)}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        </HStack>

        <ActionButtons
          grayBtn="Cancel"
          blueBtn="Continue"
          onClickBlue={saveBackdValues}
          onClickGray={onBack}
          blueBtnDisabled={!nftsBackedValues.length}
        />
      </VStack>
    </HStack>
  );
}

export { Step4 };
