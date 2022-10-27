import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { CaptionBoldShort } from "../../styles/TextStyles";
import transfer from "../../images/transferIconBlue.png";

function TransferBtn(props) {
  const { onClick } = props;

  return (
    <VStack
      height="52px"
      width="100%"
      background={({ theme }) => theme.backElement}
      padding="0 15px"
      border="6px"
      whileTap={{ scale: 0.96 }}
      spacing="3px"
      cursor="pointer"
      onClick={onClick}
    >
      <IconImg
        cursor="pointer"
        url={transfer}
        width="18px"
        height="18px"
      ></IconImg>
      <CaptionBoldShort cursor="pointer">Transfer</CaptionBoldShort>
    </VStack>
  );
}

export { TransferBtn };
