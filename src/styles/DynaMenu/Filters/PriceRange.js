import React from "react";
import { InputStyled } from "../../InputStyled";
import { VStack, HStack } from "../../Stacks";
import { CaptionBoldShort, BodyRegular } from "../../TextStyles";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

import xdcLogo from "../../../images//miniXdcLogo.png";
import { ButtonM } from "../../Buttons/ButtonM";

function PriceRange(props) {
  const {
    color,
    oppColor,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    params,
    onChange,
  } = props;
  const blue = "#3256FF";
  const grayBar = "#C3C2C2";

  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: "blue", //color of the slider between thumbs
    "& .MuiSlider-thumb": {
      backgroundColor: "blue", //color of thumbs
    },
    "& .MuiSlider-rail": {
      color: grayBar, ////color of the slider outside  teh area between thumbs
    },
  }));

  return (
    <VStack alignment="flex-start">
      <CaptionBoldShort textcolor={color} cursor="pointer">
        Price Range
      </CaptionBoldShort>

      {/* Price Range */}
      <HStack>
        <InputStyled
          icon={xdcLogo}
          type="number"
          placeholder={minValue}
          value={minValue}
          inputId="MinFilterPrice"
          onChange={(e) => setMinValue(e.target.value)}
          background={color}
          textplace={"rgba(0,0,0,0.6)"}
          textcolor={oppColor}
        ></InputStyled>
        <InputStyled
          icon={xdcLogo}
          type="number"
          placeholder={maxValue}
          value={maxValue}
          inputId="MaxFilterPrice"
          onChange={(e) => setMaxValue(e.target.value)}
          background={color}
          textplace={"rgba(0,0,0,0.6)"}
          textcolor={oppColor}
        ></InputStyled>
      </HStack>

      {/* Slider */}
      <HStack height="60px" alignment="flex-end">
        <CustomSlider
          min={0}
          max={maxValue}
          defaultValue={[minValue, maxValue]}
          valueLabelDisplay="on"
          className="FilterPriceSlider"
        />
      </HStack>

      {/* Buttons Filters */}
      <HStack>
        <ButtonM
          textcolor={"white"}
          title="Remove"
          onClick={() => {
            onChange({
              ...params,
              page: 1,
              priceRangeStart: "",
              priceRangeEnd: "",
            });
            setMinValue(0);
            document.getElementById("MinFilterPrice").value = "";
            document.getElementById("MaxFilterPrice").value = "";
          }}
        ></ButtonM>
        <ButtonM
          background={"blue"}
          textcolor="white"
          title="Apply"
          onClick={() => {
            if (maxValue < minValue) setMaxValue(minValue);
            setMinValue(maxValue);
            setMinValue(
              document
                .getElementsByClassName("FilterPriceSlider")[0]
                .getElementsByTagName("span")[2]
                .getElementsByTagName("input")[0].value
            );
            setMaxValue(
              document
                .getElementsByClassName("FilterPriceSlider")[0]
                .getElementsByTagName("span")[6]
                .getElementsByTagName("input")[0].value
            );
            document.getElementById("MinFilterPrice").value = "";
            document.getElementById("MaxFilterPrice").value = "";
            onChange({
              ...params,
              page: 1,
              priceRangeStart: document
                .getElementsByClassName("FilterPriceSlider")[0]
                .getElementsByTagName("span")[2]
                .getElementsByTagName("input")[0].value,
              priceRangeEnd: document
                .getElementsByClassName("FilterPriceSlider")[0]
                .getElementsByTagName("span")[6]
                .getElementsByTagName("input")[0].value,
            });
          }}
        ></ButtonM>
      </HStack>
    </VStack>
  );
}

export { PriceRange };
