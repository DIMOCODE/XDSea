import React from "react";
import { VStack } from "./Stacks";
import { BodyBold, CaptionBoldShort, CaptionRegular } from "./TextStyles";

function Property(props) {
  const { Title, Property, Rarity } = props;
  return (
    <VStack
      background={({ theme }) => theme.backElement}
      border="9px"
      minwidth="160px"
      maxwidth="160px"
      maxheight="90px"
      spacing="6px"
    >
      <CaptionBoldShort textcolor={({ theme }) => theme.blue}>
        {Title || "Title"}
      </CaptionBoldShort>
      <BodyBold>{Property || "Property"}</BodyBold>
      <CaptionRegular>{Rarity || "Rarity"}% have this trait.</CaptionRegular>
    </VStack>
  );
}

export { Property };
