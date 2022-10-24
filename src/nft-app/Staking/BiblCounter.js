import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg } from "../../styles/Stacks";
import xdc from "../../images/miniXdcLogo.png";
import { BodyBold, CaptionBold } from "../../styles/TextStyles";
import bibl from "../../images/bibl.png";

function BiblCounter(props) {
  const { amount, period } = props;

  const [timePeriod, setTimePeriod] = useState(period);

  return (
    <VStack spacing="3px">
      <HStack spacing="3px">
        <BodyBold>{amount}</BodyBold>
        <IconImg url={bibl} width="15px" height="15px"></IconImg>
      </HStack>

      {timePeriod === 0 && (
        <CaptionBold textcolor="#E62E25">xBiblx/D</CaptionBold>
      )}

      {timePeriod === 1 && (
        <CaptionBold textcolor="#E62E25">xBiblx/Mo</CaptionBold>
      )}

      {timePeriod === 2 && (
        <CaptionBold textcolor="#E62E25">xBiblx/Yr</CaptionBold>
      )}
    </VStack>
  );
}

export { BiblCounter };
