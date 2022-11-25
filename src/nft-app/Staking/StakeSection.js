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
import { BlockTVL } from "../Collection/TVL/BlockTVL";
import { TokenSelector } from "../Collection/TokenSelector/TokenSelector";
import { HolderSection } from "../Collection/HoldersSection";
import { TopInventory } from "../Collection/Inventory/TopInventory";

function StakeSection(props) {
  const { nfts, usdPrice, stakingPool, stakes, onClickAR, onClickBV, setStakingPool, wallet, isCreator, nftsCount } = props;

  const parseLockPeriod = (hours) => {
    if (hours === 1) {
      return "1 hrs";
    } else if (hours < 24) {
      return hours + " hrs";
    } else if (hours === 24) {
      return "1 d";
    } else if (hours / 24 < 30) {
      return hours / 24 + " d";
    } else if (hours / 730 === 1) {
      return "1 mo";
    } else if (hours / 730 < 12) {
      return hours / 730 + " mo";
    } else if (hours / 8760 === 1) {
      return "1 yr";
    } else {
      return hours / 8760 + " yr";
    }
  };

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
    <VStack padding="12px">
      <VStack width="100%">
        {/* TVl & Token Selector */}
        <HStack responsive={true} style={{ zIndex: 100 }}>
          <BlockTVL
            tvl={stakingPool?.totalValueLocked || 0}
            usdPrice={usdPrice}
            lockPeriod={parseLockPeriod(stakingPool?.lockPeriod)}
            onClickAR={onClickAR}
            onClickBV={onClickBV}
            poolId={stakingPool?._id}
            setStakingPool={setStakingPool}
            wallet={wallet}
            isCreator={isCreator}
          ></BlockTVL>
          <TokenSelector rewardRates={stakingPool?.rewardRates} isCreator={isCreator} wallet={wallet} stakingPool={stakingPool} setStakingPool={setStakingPool}></TokenSelector>
        </HStack>

        {/* Top Inventory and HolerSection */}
        {/* <HStack responsive={true} width="100%" alignment="flex-start">
          <TopInventory></TopInventory>
          <HolderSection></HolderSection>
        </HStack> */}
      </VStack>
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
        {nfts?.map((nft, i) => (
          <>
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
