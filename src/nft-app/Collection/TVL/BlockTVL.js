import React from "react";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { HStack, IconImg, Spacer, VStack } from "../../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold15,
  TitleBold18,
} from "../../../styles/TextStyles";
import xdc from "../../../images/miniXdcLogo.png";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./style.css";

function BlockTVL(props) {
  const options = ["One Day", "One Week", "One Month", "3 Months"];
  const defaultOption = options[0];

  const { tvl, onClickAR, onClickBV } = props;
  return (
    <VStack
      background={({ theme }) => theme.faded30}
      padding="52px 21px"
      border="6px"
      height="100%"
    >
      <Spacer></Spacer>
      <HStack style={{ zIndex: 100 }}>
        <VStack alignment="flex-start">
          <TitleBold15> Total Value Locked</TitleBold15>
          <HStack
            height="52px"
            background={({ theme }) => theme.backElement}
            border="6px"
          >
            <HStack spacing="6px">
              <IconImg url={xdc} width="18px" height="18px"></IconImg>
              <TitleBold18>{tvl}</TitleBold18>
            </HStack>

            <CaptionBoldShort initial={{ opacity: 0.3 }}>
              340 USD
            </CaptionBoldShort>
          </HStack>
        </VStack>

        <VStack alignment="flex-start">
          <TitleBold15>Lock Period</TitleBold15>
          <Dropdown
            options={options}
            className="dropdown"
            controlClassName="control"
            menuClassName="dropmenu"
            value={defaultOption}
            placeholder="Select an option"
          />
        </VStack>
      </HStack>

      <HStack>
        <ButtonM
          title="Add / Remove"
          background="black"
          textcolor="white"
          onClick={onClickAR}
          height="52px"
        ></ButtonM>
        <ButtonM
          title="Edit BackValue"
          background="black"
          textcolor="white"
          onClick={onClickBV}
          height="52px"
        ></ButtonM>
      </HStack>
    </VStack>
  );
}
export { BlockTVL };
