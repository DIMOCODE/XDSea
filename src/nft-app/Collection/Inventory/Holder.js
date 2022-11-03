import React from "react";
import { HStack, IconImg, Spacer, VStack } from "../../../styles/Stacks";
import { TitleBold15, TitleBold18 } from "../../../styles/TextStyles";

function Holder(props) {
  const { domain, image, address, percent, hasdomain } = props;
  return (
    <HStack>
      <IconImg
        url={image}
        width="30px"
        height="30px"
        backsize="cover"
        border="26px"
      ></IconImg>

      <VStack spacing="-3px" alignment="flex-start">
        {hasdomain && (
          <TitleBold15 textcolor={({ theme }) => theme.blue}>
            {domain}
          </TitleBold15>
        )}
        <TitleBold15>{address}</TitleBold15>
      </VStack>

      <Spacer></Spacer>
      <TitleBold15>{percent}</TitleBold15>
    </HStack>
  );
}

export { Holder };
