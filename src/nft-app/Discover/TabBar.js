import React from "react";
import { useState } from "react";
import { HStack } from "../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../styles/TextStyles";

function TabBar(props) {
  const { onClick } = props;
  const [isTab, setIsTab] = useState(false);
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
      self="none"
      spacing="3px"
    >
      <HStack height="42px" width="360px" self="none" spacing="3px">
        <HStack width="100%" onClick={() => toggleTab(true)} cursor="pointer">
          <BodyMedium
            textcolor={
              isTab ? ({ theme }) => theme.text : ({ theme }) => theme.faded60
            }
            cursor="pointer"
          >
            Collections
          </BodyMedium>
        </HStack>

        <HStack
          width="100%"
          cursor="pointer"
          onClick={() => {
            toggleTab(false);
          }}
        >
          <BodyMedium
            textcolor={
              isTab ? ({ theme }) => theme.faded60 : ({ theme }) => theme.text
            }
            cursor="pointer"
          >
            NFTs
          </BodyMedium>
        </HStack>
      </HStack>
    </HStack>
  );
}

export { TabBar };
