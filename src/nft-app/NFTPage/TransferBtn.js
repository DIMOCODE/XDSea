import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { CaptionBoldShort } from "../../styles/TextStyles";
import transfer from "../../images/transferIconBlue.png";
import { RingSpinner } from "react-spinners-kit";
import successIcon from "../../images/successIcon.png";
import failIcon from "../../images/cancelIcon.png";

function TransferBtn(props) {
  const { onClick, status } = props;

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
      onClick={status === 0 ? onClick : null}
    >
      {status === 1 ? (
        <RingSpinner size={18} color={"blue"} loading={true} />
      ) : (
        <IconImg
          cursor="pointer"
          url={status === 3 ? successIcon : status === 4 ? failIcon : transfer}
          width="18px"
          height="18px"
        ></IconImg>
      )}

      <CaptionBoldShort cursor="pointer">Transfer</CaptionBoldShort>
    </VStack>
  );
}

export { TransferBtn };
