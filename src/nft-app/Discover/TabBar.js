import React from "react";
import { useState } from "react";
import { HStack, VStack } from "../../styles/Stacks";
import { BodyMedium, BodyRegular, CaptionBoldShort } from "../../styles/TextStyles";

function TabBar(props) {
  const { onClick, initialTab, alignment, userProfile, userSettings, collectionLength, nftLength } = props;
  const [isTab, setIsTab] = useState(initialTab);
  const toggleTab = (active) => {
    setIsTab(active);
    onClick(active);
    // this will send the bool state from child component
  };

  return (
    <HStack
      background={({ theme }) => theme.backElement}
      padding="3px"
      border="6px"
      height="49px"
      width="100%"
      self="none"
      spacing="3px"
      style={{zIndex: "100", alignSelf: alignment, maxWidth: "366px"}}
    >
        <HStack width="100%" height="43px" onClick={() => toggleTab(true)} cursor="pointer">
          <HStack spacing="10px">
            <BodyMedium
              width="100%"
              textcolor={
                isTab ? ({ theme }) => theme.text : ({ theme }) => theme.faded60
              }
              cursor="pointer"
              align="center"
            >
              Collections
            </BodyMedium>
            {userProfile && (
              <VStack
                width="auto"
                minwidth="26px"
                height="26px"
                border="26px"
                background={
                  isTab ? ({ theme }) => theme.blue : ({ theme }) => theme.faded30
                }
                cursor="pointer"
              >
                <BodyRegular
                  textcolor={
                    isTab ? "white" : "#363537"
                  }
                >
                  {collectionLength}
                </BodyRegular>
              </VStack>
            )}
          </HStack>
        </HStack>

        <HStack width="1px" height="43px" background={({ theme }) => theme.faded60}>
        </HStack>

        <HStack
          width="100%"
          height="43px"
          cursor="pointer"
          onClick={() => {
            toggleTab(false);
          }}
        >
          <HStack spacing="10px">
            <BodyMedium
              width="100%"
              textcolor={
                isTab ? ({ theme }) => theme.faded60 : ({ theme }) => theme.text
              }
              cursor="pointer"
              align="center"
            >
              NFTs
            </BodyMedium>
            {userProfile && (
              <VStack
                width="auto"
                minwidth="26px"
                height="26px"
                border="26px"
                background={
                  !isTab ? ({ theme }) => theme.blue : ({ theme }) => theme.faded30
                }
                cursor="pointer"
              >
                <BodyRegular
                  textcolor={
                    !isTab ? "white" : "#363537"
                  }
                >
                  {nftLength}
                </BodyRegular>
              </VStack>
            )}
          </HStack>
        </HStack>
    </HStack>
  );
}

export { TabBar };
