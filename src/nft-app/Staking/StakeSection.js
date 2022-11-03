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
  TitleBold27,
} from "../../styles/TextStyles";
import { StakeRow } from "./StakeRow";
import { TopBarStake } from "./TopBarStake";

function StakeSection(props) {
  const { nfts, usdPrice, stakingPool, stakes } = props;

  const getStake = (id) => {
    var stake = {};
    console.log(stakes)
    if(stakes?.stakes?.length !== 0) {
      stakes?.stakes?.map((stakeData) => {
        if(stakeData.nftId._id === id) {
          stake = stakeData;
        }
      });
      return stake;
    }
  };

  return (
    <VStack
      background={({ theme }) => theme.backElement}
      border="6px"
      padding="30px 15px 30px 15px"
      spacing="26px"
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
  );
}

export { StakeSection };
