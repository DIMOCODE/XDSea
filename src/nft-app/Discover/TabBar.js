import React from "react";
import { useState } from "react";
import { HStack } from "../../styles/Stacks";
import { BodyMedium, CaptionBoldShort } from "../../styles/TextStyles";

function TabBar(props) {
  const { onClick, initialTab } = props;
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
      width="366px"
      self="none"
      spacing="3px"
      style={{zIndex: "100"}}
    >
        <HStack width="100%" height="43px" onClick={() => toggleTab(true)} cursor="pointer">
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
        </HStack>
    </HStack>
  );
}

export { TabBar };
