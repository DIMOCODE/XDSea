import React, { useState } from "react";
import { HStack, VStack } from "../../../styles/Stacks";
import { TitleBold30, BodyRegular, BodyBold } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { NFTValue } from "./NFTValue";
import { ToggleBtn } from "./ToggleBtn";

function Step4() {
  const [isOn, setIsOn] = useState(false);

  const handleOn = () => {
    setIsOn(!isOn);
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
              <BodyRegular>
                Do you want to activate the Backed Value on your NFTs?
              </BodyRegular>

              <ToggleBtn onClick={handleOn}></ToggleBtn>
            </HStack>

            {isOn && (
              <VStack
                maxheight="300px"
                overflowy="scroll"
                justify="flex-start"
                width="100%"
                padding="0 9px 15px 0"
              >
                <NFTValue name="NFT Name"></NFTValue>
                <NFTValue name="NFT Name"></NFTValue>
                <NFTValue name="NFT Name"></NFTValue>
                <NFTValue name="NFT Name"></NFTValue>
                <NFTValue name="NFT Name"></NFTValue>
                <NFTValue name="NFT Name"></NFTValue>
              </VStack>
            )}
          </VStack>
        </HStack>

        <ActionButtons grayBtn="Cancel" blueBtn="Publish"></ActionButtons>
      </VStack>
    </HStack>
  );
}

export { Step4 };
