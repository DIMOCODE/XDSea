import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg } from "../../styles/Stacks";
import xdc from "../../images/miniXdcLogo.png";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import gem from "../../images/gemIcon.png";

function GemCounter(props) {
  const { amount, period } = props;

  const [timePeriod, setTimePeriod] = useState(period);

  return (
    <VStack spacing="3px">
      <HStack spacing="3px">
        <BodyBold>{amount}</BodyBold>
        <IconImg url={gem} width="18px" height="18px"></IconImg>
      </HStack>

      {timePeriod === 0 && <CaptionBold textcolor="#EA1D81">GEM/D</CaptionBold>}

      {timePeriod === 1 && (
        <CaptionBold textcolor="#EA1D81">GEM/Mo</CaptionBold>
      )}

      {timePeriod === 2 && (
        <CaptionBold textcolor="#EA1D81">GEM/Yr</CaptionBold>
      )}
    </VStack>
  );
}

export { GemCounter };
