import React from "react";
import { VStack } from "./Stacks";
import { LoopLogo } from "./LoopLogo";

function LoadingNftContainer() {
  return (
    <VStack
      overflow="hidden"
      border="27px"
      background="rgba(153, 162, 175, 0.12)"
      spacing="0"
      width="100%"
      height="450px"
    >
      <LoopLogo></LoopLogo>
    </VStack>
  );
}

export { LoadingNftContainer };
