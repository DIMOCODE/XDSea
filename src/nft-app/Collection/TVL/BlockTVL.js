import React from "react";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { HStack, IconImg, Spacer, VStack } from "../../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold15,
  TitleBold18,
  BodyRegular,
} from "../../../styles/TextStyles";
import xdc from "../../../images/miniXdcLogo.png";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./style.css";
import { InputStyled } from "../../../styles/InputStyled";
import arrowDown from "../../../images/arrowDown.png";
import editPencil from "../../../images/editPencil.png";
import crossIcon from "../../../images/crossIcon.png";
import doneIcon from "../../../images/doneIcon.png";
import { useState } from "react";

function BlockTVL(props) {
  const options = ["hours", "days", "months", "years"];
  const defaultOption = options[0];

  const { tvl, onClickAR, onClickBV, usdPrice, lockPeriod } = props;
  const [newLockInPeriod, setNewLockInPeriod] = useState(0);
  const [period, setPeriod] = useState("hours");
  const [isEditingLockIn, setIsEditingLockIn] = useState(false);

  const updateLockInPeriod = () => {
    var updatedLockInPeriod = 0;
    if(period === "hours") {
      updatedLockInPeriod = newLockInPeriod;
    }
    else if(period === "days") {
      updatedLockInPeriod = newLockInPeriod * 24;
    }
    else if(period === "months") {
      updatedLockInPeriod = newLockInPeriod * 730;
    }
    else if(period === "years"){
      updatedLockInPeriod = newLockInPeriod * 8760;
    }
    console.log(updatedLockInPeriod);
  }

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
              {(usdPrice?.xdcPrice * Number(tvl) > 100000
                ? Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 2,
                  }).format(usdPrice?.xdcPrice * Number(tvl))
                : (usdPrice?.xdcPrice * Number(tvl)).toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    }
                  ) || "0") + " USD"}
            </CaptionBoldShort>
          </HStack>
        </VStack>

        <VStack alignment="flex-start">
          <TitleBold15>Lock Period</TitleBold15>
          <HStack spacing="6px">
            {isEditingLockIn ? (
              <>
                <InputStyled 
                  propertyKey={"edit-lock-period"}
                  type="number"
                  input={newLockInPeriod}
                  onChange={(event) => {
                    setNewLockInPeriod(event.target.value);
                  }}
                  textplace={"rgba(0,0,0,0.6)"}
                  padding={"0 12px 0 12px"}
                  height="52px"
                >
                </InputStyled>
                <Dropdown
                  options={options}
                  className="dropdown"
                  controlClassName="control"
                  menuClassName="dropmenu"
                  value={defaultOption}
                  placeholder="Select an option"
                  onChange={(e) => {
                    setPeriod(e.value);
                  }}
                />
                <HStack background={({ theme }) => theme.backElement}
                  width="50%"
                  border="20px"
                  cursor="pointer"
                  onClick={() => {
                    updateLockInPeriod();
                    setIsEditingLockIn(false);
                  }}>
                  <IconImg url={doneIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
                <HStack background={({ theme }) => theme.backElement}
                  width="50%"
                  border="20px"
                  cursor="pointer"
                  onClick={() => {
                    setIsEditingLockIn(false);
                  }}>
                  <IconImg url={crossIcon} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
            ) : (
              <>
                <HStack
                  width="80%"
                  background={({ theme }) => theme.backElement}
                  border="6px"
                  padding="9px 60px 9px 60px"
                  spacing="6px"
                  height="52px"
                >
                  <TitleBold18>
                    {lockPeriod}
                  </TitleBold18>
                </HStack>
                <HStack
                  width="20%"
                  height="52px"
                  background={({ theme }) => theme.backElement}
                  border="52px"
                  cursor="pointer"
                  onClick={() => {
                    setNewLockInPeriod(0);
                    setPeriod("hours");
                    setIsEditingLockIn(true);
                  }}
                >
                  <IconImg url={editPencil} width="15px" height="15px" cursor="pointer"></IconImg>
                </HStack>
              </>
            )}
          </HStack>
        </VStack>
      </HStack>

      <HStack>
        <ButtonM
          title="Add/Remove NFT"
          background="black"
          textcolor="white"
          onClick={onClickAR}
          height="52px"
        ></ButtonM>
        <ButtonM
          title="Edit Backed Value"
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
