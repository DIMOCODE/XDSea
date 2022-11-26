import React from "react";
import { HStack, VStack } from "../../styles/Stacks";
import { BodyBold, TitleBold33 } from "../../styles/TextStyles";
import useWindowSize from "../../styles/useWindowSize";

function TopPage(props) {
  const size = useWindowSize();
  const { background, title } = props;

  return (
    <HStack
      backgroundimage={background}
      width="100vw"
      minheight={size.width < 440 ? "180px" : "249px"}
    >
      <VStack
        maxwidth="1200px"
        spacing="6px"
        padding={size.width < 440 ? "69px 21px 0px 21px" : "69px 42px 0px 42px"}
        alignment="flex-start"
      >
        <BodyBold textcolor="#CAFA4C">XDSEA Marketplace</BodyBold>
        <TitleBold33 textcolor="white">{title}</TitleBold33>
      </VStack>
    </HStack>
  );
}

export { TopPage };
