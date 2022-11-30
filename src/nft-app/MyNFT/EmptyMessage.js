import React from "react";
import { VStack, IconImg } from "../../styles/Stacks";
import { BodyRegular } from "../../styles/TextStyles";

function EmptyMessage(props) {
  const { height, image, text } = props;

  return (
    <VStack
      border="15px"
      width="100%"
      minheight={height}
      background={({ theme }) => theme.backElement}
    >
      <IconImg url={image} width="60px" height="60px"></IconImg>
      <BodyRegular>{text}</BodyRegular>
    </VStack>
  );
}

export { EmptyMessage };
