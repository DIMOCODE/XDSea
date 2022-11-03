import React from "react";
import { HStack, VStack } from "../../../styles/Stacks";
import { TitleBold15 } from "../../../styles/TextStyles";
import { MiniPreview } from "./MiniPreview";
import mountain from "../../../images/mountain.jpg";

function PreviewPool() {
  return (
    <VStack
      width="100%"
      background={({ theme }) => theme.backElement}
      padding="21px"
      border="6px"
      alignment="flex-start"
    >
      <TitleBold15>Preview</TitleBold15>

      <HStack flexwrap="wrap" justify="flex-start">
        {Array.from({ length: 9 }, (_, i) => (
          <MiniPreview
            image={mountain}
            nftname="Serious Jojo"
            nftvalue="300"
            maxwidth="276px"
            minwidth="276px"
          ></MiniPreview>
        ))}
      </HStack>
    </VStack>
  );
}

export { PreviewPool };
