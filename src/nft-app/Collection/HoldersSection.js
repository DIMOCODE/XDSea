import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { TitleBold15 } from "../../styles/TextStyles";
import mountain from "../../images/mountain.jpg";

function HolderSection() {
  return (
    <VStack
      width="100%"
      background={({ theme }) => theme.backElement}
      padding="21px"
      border="6px"
      alignment="flex-start"
    >
      <TitleBold15> Holders </TitleBold15>

      <HStack flexwrap="wrap" justify="flex-start">
        {Array.from({ length: 10 }, (_, i) => (
          <IconImg
            url={mountain}
            width="78px"
            height="78px"
            backsize="cover"
            border="6px"
          ></IconImg>
        ))}
      </HStack>
    </VStack>
  );
}

export { HolderSection };
