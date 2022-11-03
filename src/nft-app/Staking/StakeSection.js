import { Divider } from "@mui/material";
import React from "react";
import { StakeOptions } from "../../styles/Collections/StakeOptions";
import {
  HStack,
  VStack,
  IconImg,
  Separator,
  Spacer,
} from "../../styles/Stacks";
import {
  BodyMedium,
  CaptionBoldShort,
  CaptionMedium,
  TitleBold18,
  TitleBold21,
  TitleBold27,
  BodyRegular,
} from "../../styles/TextStyles";
import { StakeRow } from "./StakeRow";
import { TopBarStake } from "./TopBarStake";
import xdc from "../../images/miniXdcLogo.png";
import { InputStyled } from "../../styles/InputStyled";
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import arrowDown from "../../images/arrowDown.png";
import editPencil from "../../images/editPencil.png";
import crossIcon from "../../images/crossIcon.png";
import doneIcon from "../../images/doneIcon.png";
import { Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

function StakeSection(props) {
  const { nfts, usdPrice, stakingPool, stakes } = props;

  const [newLockInPeriod, setNewLockInPeriod] = useState(0);
  const [lockInPeriod, setLockInPeriod] = useState(0);
  const [isEditingLockIn, setIsEditingLockIn] = useState(false);

  const parseLockPeriod = (hours) => {
    if(hours === 1) {
      return "1 hour";
    }
    else if(hours < 24) {
      return hours + "hours";
    }
    else if(hours === 24) {
      return "1 day";
    }
    else if(hours / 24 < 30) {
      return (hours / 24) + "days";
    }
    else if(hours / 720 === 1) {
      return "1 month";
    }
    else if(hours / 720 < 12) {
      return (hours / 720) + "months";
    }
    else if(hours / 8760 === 1) {
      return "1 year";
    }
    else {
      return (hours / 8760) + "years";
    }
  }

  const getStake = (id) => {
    var stake = {};
    console.log(stakes);
    if (stakes?.stakes?.length !== 0) {
      stakes?.stakes?.map((stakeData) => {
        if (stakeData.nftId._id === id) {
          stake = stakeData;
        }
      });
      return stake;
    }
  };

  return (
    <VStack>
      <HStack width="100%" height="260px">
        <HStack
          width="50%"
          background={({ theme }) => theme.faded}
          border="6px"
          padding="30px 15px 30px 15px"
        >
          <VStack width="100%" alignment="flex-start">
            <TitleBold18>
              Total Value Locked
            </TitleBold18>
            <HStack
              width="100%"
              background={({ theme }) => theme.backElement}
              border="6px"
              padding="9px 60px 9px 60px"
              spacing="6px"
              height="39px"
            >
              <IconImg
                cursor="pointer"
                url={xdc}
                width="18px"
                height="18px"
              ></IconImg>
              <TitleBold18>
                {stakingPool?.totalValueLocked}
              </TitleBold18>
              <CaptionBoldShort
                cursor="pointer"
                initial={{ opacity: 0.6 }}
                style={{ fontSize: "15px" }}
              >
                (
                {(usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked) > 100000
                  ? Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked))
                  : (usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked)).toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    ) || "0") + " USD"}
                )
              </CaptionBoldShort>
            </HStack>
            <HStack width="100%" background={"black"} border="6px" padding="12px 60px 12px 60px">
              <TitleBold18 textcolor={({ theme }) => theme.backElement}>
                Add/Remove NFT
              </TitleBold18>
            </HStack>
          </VStack>
          <VStack width="100%" alignment="flex-start">
            <TitleBold18>
              Lock Period
            </TitleBold18>
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
                  >
                  </InputStyled>
                  <HStack
                    background={({ theme }) => theme.backElement}
                    border="6px"
                    height="39px"
                    // onClick={toggleLockPeriodSelector}
                    padding="0 15px"
                    width="40%"
                  >
                    <BodyRegular>hours</BodyRegular>
                    <Spacer></Spacer>
                    <IconImg
                      url={arrowDown}
                      width="15px"
                      height="15px"
                    ></IconImg>
                  </HStack>
                  {/* <DropDownListContainer></DropDownListContainer> */}
                  <HStack background={({ theme }) => theme.backElement}
                    width="50%"
                    border="20px"
                    cursor="pointer"
                    onClick={() => {
                      //Call smart contract
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
                    width="85%"
                    background={({ theme }) => theme.backElement}
                    border="6px"
                    padding="9px 60px 9px 60px"
                    spacing="6px"
                    height="39px"
                  >
                    <TitleBold18>
                      {parseLockPeriod(stakingPool?.lockPeriod)}
                    </TitleBold18>
                  </HStack>
                  <HStack
                    width="15%"
                    height="39px"
                    background={({ theme }) => theme.backElement}
                    border="20px"
                    cursor="pointer"
                    onClick={() => {
                      setIsEditingLockIn(true);
                    }}
                  >
                    <IconImg url={editPencil} width="15px" height="15px" cursor="pointer"></IconImg>
                  </HStack>
                </>
              )}
            </HStack>
            <HStack width="100%" background={"black"} border="6px" padding="12px 60px 12px 60px">
              <TitleBold18 textcolor={({ theme }) => theme.backElement}>
                Edit Backed Value
              </TitleBold18>
            </HStack>
          </VStack>
        </HStack>
        <VStack
          width="50%"
          background={({ theme }) => theme.backElement}
          border="6px"
          padding="18px"
          spacing="9px"
        >
          <HStack width="100%">
            <Swiper
              spaceBetween={0}
              slidesPerView={"auto"}
              grabCursor={true}
              style={{
                width: "80%",
                margin: "0 0 0 0",
              }}
              mousewheel={true}
              modules={[Mousewheel]}
            >
              {stakingPool?.rewardRates?.length !== 0 && stakingPool?.rewardRates.map((reward) => (
                <SwiperSlide
                  style={{
                    width: "auto",
                    padding: "0 12px",
                    height: "39px",
                    background: "transparent",
                  }}
                >
                  <HStack spacing="6px">
                    {reward.rewardTypeId?.addressContract === "0x0000000000000000000000000000000000000000" ? (
                      <IconImg url={xdc} width="18px" height="18px"></IconImg>
                    ) : (
                      <IconImg url={reward.rewardTypeId?.url} width="18px" height="18px"></IconImg>
                    )}
                    <TitleBold21 textcolor={({ theme }) => theme.text} style={{marginBottom: "4px"}}>
                      {reward.rewardTypeId?.name}
                    </TitleBold21>
                  </HStack>
                </SwiperSlide>
              ))}
            </Swiper>
            <HStack height="39px" width="20%" background={"black"} border="25px">
              <TitleBold18 textcolor={({ theme }) => theme.backElement}>
                Add Token
              </TitleBold18>
            </HStack>
          </HStack>
          <Separator></Separator>
          <HStack width="100%" padding = "9px 0 0 0">
            <VStack width="100%" alignment="flex-start">
              <TitleBold18>
                Reward Rate
              </TitleBold18>
              <HStack
                width="100%"
                background={({ theme }) => theme.faded30}
                border="6px"
                padding="9px 60px 9px 60px"
                spacing="6px"
                height="39px"
              >
                <IconImg
                  cursor="pointer"
                  url={xdc}
                  width="18px"
                  height="18px"
                ></IconImg>
                <TitleBold18>
                  {stakingPool?.totalValueLocked}
                </TitleBold18>
                <CaptionBoldShort
                  cursor="pointer"
                  initial={{ opacity: 0.6 }}
                  style={{ fontSize: "15px" }}
                >
                  (
                  {(usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked) > 100000
                    ? Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked))
                    : (usdPrice?.xdcPrice * Number(stakingPool?.totalValueLocked)).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      ) || "0") + " USD"}
                  )
                </CaptionBoldShort>
              </HStack>
              <HStack width="100%" background={"black"} border="6px" padding="12px 60px 12px 60px">
                <TitleBold18 textcolor={({ theme }) => theme.backElement}>
                  Add/Remove NFT
                </TitleBold18>
              </HStack>
            </VStack>
            <VStack width="100%" alignment="flex-start">
              <TitleBold18>
                Lock Period
              </TitleBold18>
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
                    >
                    </InputStyled>
                    <HStack
                      background={({ theme }) => theme.backElement}
                      border="6px"
                      height="39px"
                      // onClick={toggleLockPeriodSelector}
                      padding="0 15px"
                      width="40%"
                    >
                      <BodyRegular>hours</BodyRegular>
                      <Spacer></Spacer>
                      <IconImg
                        url={arrowDown}
                        width="15px"
                        height="15px"
                      ></IconImg>
                    </HStack>
                    {/* <DropDownListContainer></DropDownListContainer> */}
                    <HStack background={({ theme }) => theme.backElement}
                      width="50%"
                      border="20px"
                      cursor="pointer"
                      onClick={() => {
                        //Call smart contract
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
                      width="85%"
                      background={({ theme }) => theme.backElement}
                      border="6px"
                      padding="9px 60px 9px 60px"
                      spacing="6px"
                      height="39px"
                    >
                      <TitleBold18>
                        {parseLockPeriod(stakingPool?.lockPeriod)}
                      </TitleBold18>
                    </HStack>
                    <HStack
                      width="15%"
                      height="39px"
                      background={({ theme }) => theme.backElement}
                      border="20px"
                      cursor="pointer"
                      onClick={() => {
                        setIsEditingLockIn(true);
                      }}
                    >
                      <IconImg url={editPencil} width="15px" height="15px" cursor="pointer"></IconImg>
                    </HStack>
                  </>
                )}
              </HStack>
              <HStack width="100%" background={"black"} border="6px" padding="12px 60px 12px 60px">
                <TitleBold18 textcolor={({ theme }) => theme.backElement}>
                  Edit Backed Value
                </TitleBold18>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
      <VStack
        background={({ theme }) => theme.backElement}
        border="6px"
        padding="30px 15px 30px 15px"
        spacing="26px"
        width="100%"
      >
        {/* Collection Title  with back button*/}
        {/* <TopBarStake collection={collection}></TopBarStake> */}

        {/* NFTS with Staking Option */}
        {nfts.map((nft, i) => (
          <>
            {console.log(getStake(nft._id))}
            <StakeRow
              image={nft.urlFile.v0}
              title={nft.name}
              price={nft.price}
              backedValue={stakingPool?.isBackedValue ? nft.backedValue : 1}
              oneToken={stakingPool?.rewardRates?.length > 1 ? false : true}
              rewardRate={stakingPool?.rewardRates}
              startDate={stakingPool?.createdAt}
              rewardFrequency={stakingPool?.rewardFrecuency}
              usdPrice={usdPrice}
              stakeData={getStake(nft._id)}
            ></StakeRow>

            {i !== nfts.length - 1 && <Separator></Separator>}
          </>
        ))}
      </VStack>
    </VStack>
  );
}

export { StakeSection };

const DropDownListContainer = styled(motion.div)`
  position: absolute;
  top: 52px;
  width: 100%;
  z-index: 10000;
`;
