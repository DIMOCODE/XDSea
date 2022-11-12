import React from "react";
import {
  HStack,
  IconImg,
  Separator,
  Spacer,
  VStack,
} from "../../styles/Stacks";
import { TitleBold15 } from "../../styles/TextStyles";
import mountain from "../../images/mountain.jpg";

function HolderSection() {
  return (
    <HStack width="100%">
      <VStack
        width="100%"
        background={({ theme }) => theme.backElement}
        padding="21px 6px 0 21px"
        border="6px"
        justify="flex-start"
        alignment="flex-start"
      >
        <TitleBold15> Holders </TitleBold15>

        <VStack
          width="100%"
          maxheight="290px"
          overflowy="scroll"
          justify="flex-start"
        >
          <HStack
            flexwrap="wrap"
            justify="flex-start"
            spacing="6px"
            padding="0 0 21px 0"
          >
            {Array.from({ length: 16 }, (_, i) => (
              <IconImg
                url={mountain}
                width="69px"
                height="69px"
                backsize="cover"
                border="6px"
              ></IconImg>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </HStack>
  );
}

export { HolderSection };
