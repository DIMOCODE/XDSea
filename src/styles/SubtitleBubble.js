import React from "react";
import { HStack, VStack } from "./Stacks";
import { SubtTitleRegular18, TitleRegular18 } from "./TextStyles";

function SubtitleBubble(props) {
  const { text } = props;
  return (
    <HStack
      self="none"
      padding="0 15px"
      height="42px"
      border="30px"
      background=" linear-gradient(90.5deg, #FFF5B3 -30.32%, #FCD868 15.14%, #FBC34B 85.07%, #FF7A00 109.52%)
"
    >
      <SubtTitleRegular18 textcolor="#7A4405">
        {text || "Introduce Subtitle"}
      </SubtTitleRegular18>
    </HStack>
  );
}

export { SubtitleBubble };
