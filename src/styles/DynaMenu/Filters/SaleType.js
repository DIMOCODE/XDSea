import React from "react";
import { useState } from "react";

import { VStack, HStack, IconImg, Spacer } from "../../Stacks";
import { CaptionBoldShort } from "../../TextStyles";

import notforsale from "../../../images/notforsale.png";
import relist from "../../../images/relist.png";
import sold from "../../../images/sold.png";
import sale from "../../../images/sale.png";

import { ButtonM } from "../../Buttons/ButtonM";

function SaleType(props) {
  const {
    onChange,
    params,
    btnSale,
    setBtnSale,
    btnRelist,
    setBtnRelist,
    btnNFS,
    setBtnNFS,
    btnSold,
    setBtnSold,
  } = props;
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

  return (
    <VStack width="100%" alignment="flex-start" spacing="15px">
      <HStack width="100%" spacing="15px">
        <CaptionBoldShort textcolor="white" cursor="pointer">
          Sale Type
        </CaptionBoldShort>

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
          textcolor={"white"}
          title="Remove"
          background={"rgba(255, 255, 255, 0.06)"}
          onClick={() => {
            onChange({
              ...params,
              page: 1,
              saleType1: "",
              saleType2: "",
              saleType3: "",
              saleType4: "",
            });
            setBtnSold(false);
            setBtnSale(false);
            setBtnNFS(false);
            setBtnRelist(false);
          }}
        ></ButtonM>
        <ButtonM
          background={({ theme }) => theme.blue}
          textcolor="white"
          title="Apply"
          onClick={() => {
            onChange({
              ...params,
              page: 1,
              saleType1: !btnSale ? "SALE" : "",
              saleType2: !btnRelist ? "RELIST" : "",
              saleType3: !btnSold ? "SOLD" : "",
              saleType4: !btnNFS ? "NOT_SALE" : "",
            });
          }}
        ></ButtonM>
      </HStack>
    </VStack>
  );
}

export { SaleType };
