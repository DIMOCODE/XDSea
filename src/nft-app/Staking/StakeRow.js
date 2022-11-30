import React from "react";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyBold,
  CaptionBold,
  CaptionBoldShort,
} from "../../styles/TextStyles";
import useWindowSize from "../../styles/useWindowSize";
import { ButtonActions } from "./ButtonActions";

import { EarningRate } from "./EarningRate";

import { NftMiniDetails } from "./NftMiniDetails";
import { PendingClaimed } from "./PendingClaimed";

function StakeRow(props) {
  const size = useWindowSize();
  const { image, title, price, backedValue, rewardRate, startDate, rewardFrequency, oneToken, usdPrice, stakeData, redirect, isCreator, isOwner, isStake } = props;

  return (
    <HStack responsive={true} spacing="21px" 
    padding="30px 15px 30px 15px"
    width="100%">
      {/* NFT with Stake */}
      <NftMiniDetails
        width={size.width > 428 ? "72%" : "100%"}
        image={image}
        title={title}
        price={price}
        usdPrice={usdPrice}
        redirect={redirect}
      ></NftMiniDetails>

      {/* Earning Rate */}
      <EarningRate onlyOneToken={oneToken} rewardRate={rewardRate} rewardFrequency={rewardFrequency} backedValue={backedValue}></EarningRate>

      {/* Pending Claimed */}
      <PendingClaimed onlyOneToken={oneToken} stakeData={stakeData} rewardRate={rewardRate} backedValue={backedValue}></PendingClaimed>

      {/* Actions */}
      {!isCreator && 
      <ButtonActions isOwner={isOwner} isStake={isStake} width={size.width > 428 ? "42%" : "100%"} redirect={redirect}></ButtonActions>}
    </HStack>
  );
}

export { StakeRow };
