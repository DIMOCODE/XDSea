import React from "react";

import miniXdcLogo from "../../images/miniXdcLogo.png";
import { HStack, VStack, IconImg } from "../../styles/Stacks";
import { BodyBold, CaptionBoldShort } from "../../styles/TextStyles";

function CollectionStats(props) {
  const { owners, nftsCount, floorPrice, volumeTrade, width } = props;

  return (
    <HStack
      height={"69px"}
      spacing="0px"
      background={({ theme }) => theme.backElement}
      style={{
        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
      }}
      border="6px"
      width={width}
    >
      <VStack padding="18px 0" maxwidth="81px" spacing="6px">
        <BodyBold textcolor={({ theme }) => theme.text}>{owners}</BodyBold>

        <CaptionBoldShort
          initial={{ opacity: 0.6 }}
          textcolor={({ theme }) => theme.text}
        >
          Owners
        </CaptionBoldShort>
      </VStack>

      <VStack padding="18px 0" maxwidth="81px" spacing="6px">
        <BodyBold textcolor={({ theme }) => theme.text}>{nftsCount}</BodyBold>

        <CaptionBoldShort
          initial={{ opacity: 0.6 }}
          textcolor={({ theme }) => theme.text}
        >
          NFTs
        </CaptionBoldShort>
      </VStack>

      <VStack spacing="6px" padding="18px 0">
        <HStack spacing="6px">
          <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>

          <BodyBold textcolor={({ theme }) => theme.text}>
            {floorPrice}
          </BodyBold>
        </HStack>
        <CaptionBoldShort
          initial={{ opacity: 0.6 }}
          textcolor={({ theme }) => theme.text}
        >
          Floor Price
        </CaptionBoldShort>
      </VStack>
      <VStack border="9px" padding="18px 0" spacing="6px">
        <HStack spacing="6px">
          <IconImg url={miniXdcLogo} width="18px" height="18px"></IconImg>

          <BodyBold textcolor={({ theme }) => theme.text}>
            {volumeTrade}
          </BodyBold>
        </HStack>
        <CaptionBoldShort
          align="center"
          textcolor={({ theme }) => theme.text}
          initial={{ opacity: 0.6 }}
        >
          Volume Traded
        </CaptionBoldShort>
      </VStack>
    </HStack>
  );
}

export { CollectionStats };
