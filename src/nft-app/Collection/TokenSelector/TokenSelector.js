import React from "react";
import { useState } from "react";
import {
  HStack,
  Separator,
  IconImg,
  Spacer,
  VStack,
} from "../../../styles/Stacks";
import { TabToken } from "./TabToken";
import xdc from "../../../images/miniXdcLogo.png";

import {
  CaptionTiny,
  TitleBold15,
  TitleBold18,
} from "../../../styles/TextStyles";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { EarningRate } from "../../Staking/EarningRate";
import { TokenInfo } from "./TokenInfo";
import { TokenCreator } from "./TokenCreator";

function TokenSelector(props) {
  const { rewardRate, hideButtons } = props;

  const [newToken, setNewToken] = useState(false);
  return (
    <VStack
      background={({ theme }) => theme.backElement}
      padding="21px"
      border="6px"
      width="100%"
    >
      {newToken ? (
        <TokenCreator onClickCancel={() => setNewToken(false)}></TokenCreator>
      ) : (
        <>
          <HStack>
            <TabToken image={xdc} name="XDC"></TabToken>
            <Spacer></Spacer>
            <ButtonM
              title="Add Token"
              background="black"
              textcolor="white"
              width="90px"
              border="90px"
              onClick={() => setNewToken(true)}
            ></ButtonM>
          </HStack>
          <Separator></Separator>

          <TokenInfo
            hideButtons={hideButtons}
            logo={xdc}
            rewardRate={rewardRate}
          ></TokenInfo>
        </>
      )}
    </VStack>
  );
}

export { TokenSelector };
