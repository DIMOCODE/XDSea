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
import "./tvlstyle.css";
import "react-dropdown/style.css";

import { InputStyled } from "../../../styles/InputStyled";
import arrowDown from "../../../images/arrowDown.png";
import editPencil from "../../../images/editPencil.png";
import crossIcon from "../../../images/crossIcon.png";
import doneIcon from "../../../images/doneIcon.png";
import { useState } from "react";
import { updateStakingPool } from "../../../API/stake";
import { ButtonIcon } from "../../../styles/Buttons/ButtonIcon";

function BlockTVL(props) {
  const options = ["hrs", "d", "mo", "yr"];
  const defaultOption = options[0];

  const { tvl, onClickAR, onClickBV, usdPrice, lockPeriod, poolId, setStakingPool } = props;
  const [newLockInPeriod, setNewLockInPeriod] = useState(0);
  const [period, setPeriod] = useState("hours");
  const [isEditingLockIn, setIsEditingLockIn] = useState(false);

  const updateLockInPeriod = async () => {
    var updatedLockInPeriod = 0;
    if (period === "hours") {
      updatedLockInPeriod = newLockInPeriod;
    } else if (period === "days") {
      updatedLockInPeriod = newLockInPeriod * 24;
    } else if (period === "months") {
      updatedLockInPeriod = newLockInPeriod * 730;
    } else if (period === "years") {
      updatedLockInPeriod = newLockInPeriod * 8760;
    }
    const updatedStakingPool = await(await updateStakingPool(poolId, updatedLockInPeriod)).data.stakingPool;
    setStakingPool(updatedStakingPool);
  }

  return (
    <VStack
      background={({ theme }) => theme.faded30}
      padding="52px 21px"
      border="6px"
      height="100%"
      width="100%"
      style={{ zIndex: 1 }}
    >
      <Spacer></Spacer>
      <HStack responsive={true} style={{ zIndex: 100 }}>
        <VStack alignment="flex-start" width="100%">
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
                : (usdPrice?.xdcPrice * Number(tvl)).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  }) || "0") + " USD"}
            </CaptionBoldShort>
          </HStack>
        </VStack>

        <VStack alignment="flex-start" width="100%">
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
                ></InputStyled>

                <Dropdown
                  options={options}
                  className="dropdown"
                  controlClassName="control"
                  menuClassName="dropmenu"
                  value={defaultOption}
                  arrowClassName="customArrows"
                  placeholder="Select an option"
                  onChange={(e) => {
                    setPeriod(e.value);
                  }}
                />

                <HStack minwidth="90px" spacing="3px" self="none">
                  <ButtonIcon
                    background={({ theme }) => theme.backElement}
                    icon={doneIcon}
                    onClick={() => {
                      updateLockInPeriod();
                      setIsEditingLockIn(false);
                    }}
                  ></ButtonIcon>

                  <ButtonIcon
                    background={({ theme }) => theme.backElement}
                    icon={crossIcon}
                    onClick={() => {
                      setIsEditingLockIn(false);
                    }}
                  ></ButtonIcon>
                </HStack>
              </>
            ) : (
              <HStack width="100%" self="none">
                <HStack
                  width="100%"
                  background={({ theme }) => theme.backElement}
                  border="6px"
                  padding="0"
                  spacing="6px"
                  height="52px"
                >
                  <TitleBold18>{lockPeriod}</TitleBold18>
                </HStack>

                <HStack>
                  <ButtonIcon
                    background={({ theme }) => theme.backElement}
                    icon={editPencil}
                    onClick={() => {
                      setNewLockInPeriod(0);
                      setPeriod("hours");
                      setIsEditingLockIn(true);
                    }}
                  ></ButtonIcon>
                </HStack>
              </HStack>
            )}
          </HStack>
        </VStack>
      </HStack>

      <HStack>
        <ButtonM
          title="Add/Remove NFT"
          background={({ theme }) => theme.blackLinear}
          textcolor="white"
          onClick={onClickAR}
          height="52px"
        ></ButtonM>
        <ButtonM
          title="Edit Backed Value"
          background={({ theme }) => theme.blackLinear}
          textcolor="white"
          onClick={onClickBV}
          height="52px"
        ></ButtonM>
      </HStack>
    </VStack>
  );
}
export { BlockTVL };
