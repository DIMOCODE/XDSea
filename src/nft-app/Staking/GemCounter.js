import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg } from "../../styles/Stacks";
import xdc from "../../images/miniXdcLogo.png";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import gem from "../../images/GemLogo.png";

function GemCounter(props) {
  const { amount, period } = props;

  const [timePeriod, setTimePeriod] = useState(period);

  return (
    <VStack spacing="3px">
      <HStack spacing="3px">
        <BodyBold>
          {amount > 100000
            ? Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 2,
              }).format(amount)
            : (amount ?? "--").toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) || "0"}
        </BodyBold>
        <IconImg url={gem} width="18px" height="18px"></IconImg>
      </HStack>

      {timePeriod === 0 && <CaptionBold textcolor="#781FD1">GEM/D</CaptionBold>}

      {timePeriod === 1 && (
        <CaptionBold textcolor="#781FD1">GEM/Mo</CaptionBold>
      )}

      {timePeriod === 2 && (
        <CaptionBold textcolor="#781FD1">GEM/Yr</CaptionBold>
      )}
    </VStack>
  );
}

export { GemCounter };
