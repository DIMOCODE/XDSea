import React from "react";
import { InputStyled } from "../../InputStyled";
import { VStack, HStack } from "../../Stacks";
import { CaptionBoldShort, BodyRegular } from "../../TextStyles";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

import xdcLogo from "../../../images//miniXdcLogo.png";
import { ButtonM } from "../../Buttons/ButtonM";

function PriceRange() {
  const blue = "#3256FF";
  const grayBar = "#C3C2C2";

  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: blue, //color of the slider between thumbs
    "& .MuiSlider-thumb": {
      backgroundColor: blue, //color of thumbs
    },
    "& .MuiSlider-rail": {
      color: grayBar, ////color of the slider outside  teh area between thumbs
    },
  }));

  return (
    <VStack alignment="flex-start">
      <CaptionBoldShort cursor="pointer">Price Range</CaptionBoldShort>

      {/* Price Range */}
      <HStack>
        <InputStyled
          icon={xdcLogo}
          type="number"
          placeholder="000"
          value="000"
          inputId="MinFilterPrice"
          background={({ theme }) => theme.faded}
          textplace={"rgba(0,0,0,0.6)"}
        ></InputStyled>
        <InputStyled
          icon={xdcLogo}
          type="number"
          placeholder="000"
          value="000"
          inputId="MaxFilterPrice"
          background={({ theme }) => theme.faded}
          textplace={"rgba(0,0,0,0.6)"}
        ></InputStyled>
      </HStack>

      {/* Slider */}

      <HStack height="60px" alignment="flex-end">
        <CustomSlider
          min={1}
          max={100}
          // step={300000}
          defaultValue={50}
          valueLabelDisplay="on"
          className="FilterPriceSlider"
        />
      </HStack>

      {/* Buttons Filters */}
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

export { PriceRange };
