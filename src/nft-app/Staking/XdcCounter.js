import React, { useState } from "react";
import { VStack, HStack, IconImg } from "../../styles/Stacks";
import xdc from "../../images/miniXdcLogo.png";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";

function XdcCounter(props) {
  const { amount, period } = props;

  const [timePeriod, setTimePeriod] = useState(period);

  return (
    <VStack spacing="3px">
      <HStack spacing="3px">
        <BodyBold>{(amount > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(amount)
                      : (amount).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0")}</BodyBold>
        <IconImg url={xdc} width="15px" height="15px"></IconImg>
      </HStack>

      {timePeriod === 0 && (
        <CaptionBold textcolor={({ theme }) => theme.blue}>XDC</CaptionBold>
      )}

      {timePeriod === 1 && (
        <CaptionBold textcolor={({ theme }) => theme.blue}>XDC/D</CaptionBold>
      )}

      {timePeriod === 2 && (
        <CaptionBold textcolor={({ theme }) => theme.blue}>XDC/Mo</CaptionBold>
      )}

      {timePeriod === 3 && (
        <CaptionBold textcolor={({ theme }) => theme.blue}>XDC/Yr</CaptionBold>
      )}
    </VStack>
  );
}

export { XdcCounter };
