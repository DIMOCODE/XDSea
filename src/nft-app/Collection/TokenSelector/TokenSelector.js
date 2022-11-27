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
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper";

function TokenSelector(props) {
  const { rewardRates, isCreator, wallet, setStakingPool, stakingPool, setWithdrawModal, setDepositModal } = props;

  const parseRewardFrequency = (hours) => {
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

  const [newToken, setNewToken] = useState(false);
  const [currentTokenIcon, setCurrentTokenIcon] = useState(
    rewardRates !== undefined ? rewardRates[0]?.rewardTypeId?.url || xdc : ""
  );
  const [currentTokenReward, setCurrentTokenReward] = useState(
    rewardRates !== undefined ? rewardRates[0]?.amount : 0
  );
  const [currentTokenRewardFrequency, setCurrentTokenRewardFrequency] =
    useState(
      rewardRates !== undefined
        ? parseRewardFrequency(rewardRates[0]?.rewardFrecuency)
        : 0
    );
  const [currentTokenContract, setCurrentTokenContract] = useState(
    rewardRates !== undefined ? rewardRates[0]?.rewardTypeId?.addressContract : "0x0000000000000000000000000000000000000000"
  );

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
            <Swiper
              spaceBetween={0}
              slidesPerView={"auto"}
              grabCursor={true}
              style={{
                width: "100%",
                margin: "0 0 0 0",
              }}
              mousewheel={true}
              modules={[Mousewheel]}
            >
              {rewardRates?.length !== 0 &&
                rewardRates?.map((reward) => (
                  <SwiperSlide
                    style={{
                      width: "auto",
                      padding: "0 12px",
                      height: "39px",
                      background: "transparent",
                    }}
                  >
                    <TabToken
                      image={
                        reward.rewardTypeId?.addressContract ===
                        "0x0000000000000000000000000000000000000000"
                          ? xdc
                          : reward.rewardTypeId?.url
                      }
                      name={reward.rewardTypeId?.name}
                    ></TabToken>
                  </SwiperSlide>
                ))}
            </Swiper>
            {/* {isCreator && (
              <ButtonM
                title="Add Token"
                background={({ theme }) => theme.blackLinear}
                textcolor="white"
                width="90px"
                border="90px"
                onClick={() => setNewToken(true)}
              ></ButtonM>
            )} */}
          </HStack>
          <Separator></Separator>

          <TokenInfo
            isCreator={isCreator}
            logo={currentTokenIcon}
            rewardRate={currentTokenReward}
            rewardFrequency={currentTokenRewardFrequency}
            unparsedRewardFrequency={rewardRates[0]?.rewardFrecuency}
            wallet={wallet}
            tokenContract={currentTokenContract}
            stakingPool={stakingPool}
            setStakingPool={setStakingPool}
            setWithdrawModal={setWithdrawModal}
            setDepositModal={setDepositModal}
          ></TokenInfo>
        </>
      )}
    </VStack>
  );
}

export { TokenSelector };
