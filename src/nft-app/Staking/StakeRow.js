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
  const { image, title, price, oneToken } = props;

  return (
    <HStack responsive={true} spacing="21px">
      {/* NFT with Stake */}
      <NftMiniDetails
        width={size.width > 428 ? "72%" : "100%"}
        image={image}
        title={title}
        price={price}
      ></NftMiniDetails>

      {/* Earning Rate */}
      <EarningRate onlyOneToken={oneToken}></EarningRate>

      {/* Pending Claimed */}
      <PendingClaimed onlyOneToken={oneToken}></PendingClaimed>

      {/* Actions */}
      <ButtonActions width={size.width > 428 ? "42%" : "100%"}></ButtonActions>
    </HStack>
  );
}

export { StakeRow };
