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
  const { image, title, price, collection } = props;

  return (
    <VStack
      background={({ theme }) => theme.backElement}
      border="6px"
      padding="30px 15px 60px 15px"
      spacing="26px"
    >
      {/* Collection Title  with back button*/}
      <TopBarStake collection={collection}></TopBarStake>

      {/* NFTS with Staking Option */}
      <StakeRow
        image={image}
        title={title}
        price={price}
        oneToken={true}
      ></StakeRow>

      <Separator></Separator>
      <StakeRow
        image={image}
        title={title}
        price={price}
        oneToken={false}
      ></StakeRow>
    </VStack>
  );
}

export { StakeSection };
