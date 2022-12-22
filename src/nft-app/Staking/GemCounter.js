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

      {timePeriod === 1 && <CaptionBold textcolor="#781FD1">GEM/D</CaptionBold>}

      {timePeriod === 2 && (
        <CaptionBold textcolor="#781FD1">GEM/Mo</CaptionBold>
      )}

      {timePeriod === 3 && (
        <CaptionBold textcolor="#781FD1">GEM/Yr</CaptionBold>
      )}
    </VStack>
  );
}

export { GemCounter };
