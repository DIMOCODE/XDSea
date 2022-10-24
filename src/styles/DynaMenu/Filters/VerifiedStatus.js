import React from "react";
import { useState } from "react";

import { VStack, HStack, IconImg, Spacer } from "../../Stacks";
import { BodyBold, CaptionBoldShort } from "../../TextStyles";

import verifiedBlue from "../../../images/verifiedBlue.png";

function VerifiedStatus() {
  const [btnVerified, setBtnVerified] = useState(false);
  return (
    <VStack width="100%" alignment="flex-start" spacing="9px" cursor="pointer">
      <CaptionBoldShort cursor="pointer">Status</CaptionBoldShort>
      <HStack cursor="pointer">
        <BodyBold cursor="pointer">Verified Only</BodyBold>
        <Spacer></Spacer>
        <IconImg
          cursor="pointer"
          url={verifiedBlue}
          width="30px"
          height="30px"
          animate={btnVerified ? { opacity: 1 } : { opacity: 0.3 }}
          onClick={() => {
            setBtnVerified(!btnVerified);
          }}
        ></IconImg>
      </HStack>
    </VStack>
  );
}

export { VerifiedStatus };
