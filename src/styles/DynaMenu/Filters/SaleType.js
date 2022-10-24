import React from "react";
import { useState } from "react";

import { VStack, HStack, IconImg, Spacer } from "../../Stacks";
import { CaptionBoldShort } from "../../TextStyles";

import notforsale from "../../../images/notforsale.png";
import relist from "../../../images/relist.png";
import sold from "../../../images/sold.png";
import sale from "../../../images/sale.png";

import { ButtonM } from "../../Buttons/ButtonM";

function SaleType() {
  const activated = {
    on: {
      opacity: 1,
      scale: 1,
    },
    off: {
      opacity: 0.3,
      scale: 0.96,
    },
  };

  const [btnSale, setBtnSale] = useState(false);
  const [btnSold, setBtnSold] = useState(false);
  const [btnRelist, setBtnRelist] = useState(false);
  const [btnNFS, setBtnNFS] = useState(false);

  return (
    <VStack width="100%" alignment="flex-start" spacing="15px">
      <HStack width="100%" spacing="15px">
        <CaptionBoldShort cursor="pointer">Sale Type</CaptionBoldShort>

        <Spacer></Spacer>
        <IconImg
          url={sale}
          width="36px"
          height="36px"
          cursor="pointer"
          onTapStart={() => {
            if (!btnSold || !btnRelist || !btnNFS) setBtnSale(!btnSale);
          }}
          variants={activated}
          animate={btnSale ? "off" : "on"}
        ></IconImg>

        <IconImg
          url={sold}
          width="36px"
          height="36px"
          cursor="pointer"
          onTapStart={() => {
            if (!btnSale || !btnRelist || !btnNFS) setBtnSold(!btnSold);
          }}
          variants={activated}
          animate={btnSold ? "off" : "on"}
        ></IconImg>

        <IconImg
          url={relist}
          width="36px"
          height="36px"
          cursor="pointer"
          onTapStart={() => {
            if (!btnSold || !btnSale || !btnNFS) setBtnRelist(!btnRelist);
          }}
          variants={activated}
          animate={btnRelist ? "off" : "on"}
        ></IconImg>

        <IconImg
          url={notforsale}
          width="36px"
          height="36px"
          cursor="pointer"
          onTapStart={() => {
            if (!btnSold || !btnRelist || !btnSale) setBtnNFS(!btnNFS);
          }}
          variants={activated}
          animate={btnNFS ? "off" : "on"}
        ></IconImg>
      </HStack>

      <HStack>
        <ButtonM
          background={({ theme }) => theme.faded30}
          title="Remove"
        ></ButtonM>
        <ButtonM
          background={({ theme }) => theme.blue}
          textcolor="white"
          title="Apply"
        ></ButtonM>
      </HStack>
    </VStack>
  );
}

export { SaleType };
