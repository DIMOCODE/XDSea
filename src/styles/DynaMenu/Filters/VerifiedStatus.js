import React from "react";
import { useState } from "react";

import { VStack, HStack, IconImg, Spacer } from "../../Stacks";
import { BodyBold, CaptionBoldShort } from "../../TextStyles";

import verifiedBlue from "../../../images/verifiedBlue.png";

function VerifiedStatus(props) {
  const { onChange, params, isVerified, setVerified } = props;
  
  return (
    <VStack width="100%" alignment="flex-start" spacing="9px">
      <CaptionBoldShort textcolor="white">
        Status
      </CaptionBoldShort>
      <HStack>
        <BodyBold textcolor="white">
          Verified Only
        </BodyBold>
        <Spacer></Spacer>
        <IconImg
          cursor="pointer"
          url={verifiedBlue}
          width="30px"
          height="30px"
          animate={isVerified ? { opacity: 1 } : { opacity: 0.3 }}
          onClick={() => {
            setVerified(!isVerified);
            if (!isVerified)
              onChange({ ...params, page: 1, verified: !isVerified });
            else onChange({ ...params, page: 1, verified: "" });
          }}
        ></IconImg>
      </HStack>
    </VStack>
  );
}

export { VerifiedStatus };
