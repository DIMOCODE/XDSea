import React, { useState, useEffect } from "react";
import { getRewardTypes } from "../../../API/stake";
import { HOURS_BY_TIME } from "../../../constant";

import { VStack, HStack } from "../../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../../styles/TextStyles";
import { ActionButtons } from "../ActionButtons";
import { CreatedToken } from "./CreatedToken";
import { CreateNewToken } from "./CreateNewToken";
import { RewardFrequencyStep } from "./RewardFrequencyStep";
import { RewardRateStep } from "./RewardRateStep";
import { TokenGrid } from "./TokenGrid";

function Step3(props) {
  const { onComplete, onBack, onNext } = props;
  const [setStep, setIsStep] = useState(3); //al inicio con formulario de creacion
  const [rewardTypes, setRewardTypes] = useState([]);
  const [rewardRates, setRewardRates] = useState([]);
  const [rewardRateSelected, setRewardRateSelected] = useState(null);

  // states for form of new rewardRate
  const [coinSelected, setCoinSelected] = useState(null);
  const [rewardRateInput, setRewardRateInput] = useState("");
  const [rewardFrecuencyAmount, setRewardFrecuencyAmount] = useState("");
  const [rewardFrecuencyType, setRewardFrecuencyType] = useState("HOUR");
  const [newRewardRardRateFromIsValid, setNewRewardRardRateFromIsValid] =
    useState(false);
  const [idEditingRewardRate, setIdEditingRewardRate] = useState("");

  useEffect(() => {
    fetchRewardTypes();
  }, []);

  useEffect(() => {
    setNewRewardRardRateFromIsValid(
      coinSelected &&
        rewardRateInput &&
        rewardFrecuencyAmount &&
        rewardFrecuencyType
    );
  }, [
    coinSelected,
    rewardRateInput,
    rewardFrecuencyAmount,
    rewardFrecuencyType,
  ]);

  useEffect(() => {
    console.log(rewardRates);
  }, [rewardRates]);

  const fetchRewardTypes = async () => {
    try {
      const { data } = await getRewardTypes();
      const { rewardTypes } = data;
      setRewardTypes(rewardTypes);
    } catch (error) {
      console.dir(error);
    }
  };

  const cleanRewardRateForm = () => {
    setCoinSelected("");
    setRewardRateInput("");
    setRewardFrecuencyAmount("");
    setRewardFrecuencyType("HOUR");
    setIdEditingRewardRate("");
  };

  const editRewardRate = (RRid) => {
    const RR = rewardRates.find((r) => r._id === RRid);
    setCoinSelected(RRid);
    setRewardRateInput(RR.amount);
    setRewardFrecuencyAmount(RR.rewardFrecuency);
    setRewardFrecuencyType("HOUR");
    setIdEditingRewardRate(RRid);
    setIsStep(1);
  };
  const saveNewRewardRate = () => {
    const coinFound = rewardTypes.find((c) => c._id === coinSelected);

    let newRR = {
      ...coinFound,
      rewardFrecuency:
        Number(rewardFrecuencyAmount) * HOURS_BY_TIME[rewardFrecuencyType],
      amount: rewardRateInput,
    };

    if (idEditingRewardRate) {
      const updatedRRs = rewardRates.map((rr) =>
        rr._id === idEditingRewardRate ? newRR : rr
      );
      setRewardRates(updatedRRs);
      setIdEditingRewardRate("");
    } else {
      setRewardRates([...rewardRates, newRR]);
    }
    cleanRewardRateForm();
    setIsStep(3);
  };

  const saveNewCoin = (coin) => {
    setRewardTypes([...rewardTypes, coin]);
    setCoinSelected(coin._id);
    setIsStep(1);
  };
  const cancelRewardRatesForm = () => {
    cleanRewardRateForm();
    setIsStep(3);
  };

  return (
    <HStack width="100%">
      <VStack background="transparent" maxwidth="390px" alignment="flex-start">
        <TitleBold30>Step 3</TitleBold30>
        {setStep === 1 && (
          <>
            <BodyRegular>Choose a reward token or add one</BodyRegular>

            <TokenGrid
              rewardTypes={rewardTypes}
              didSelect={(idCoin) => setCoinSelected(idCoin)}
              didLaunchCreator={() => {
                setIsStep(2);
              }}
            ></TokenGrid>

            <RewardRateStep
              value={rewardRateInput}
              onChange={setRewardRateInput}
            />

            <RewardFrequencyStep
              time={rewardFrecuencyAmount}
              headerLabel="Choose your Reward Frequency"
              timeType={rewardFrecuencyType}
              onChangeTime={setRewardFrecuencyAmount}
              onChangeTimeType={setRewardFrecuencyType}
            />

            <ActionButtons
              grayBtn="Go Back"
              blueBtn="Continue"
              onClickBlue={saveNewRewardRate}
              onClickGray={cancelRewardRatesForm}
              blueBtnDisabled={!newRewardRardRateFromIsValid}
            ></ActionButtons>
          </>
        )}

        {setStep === 2 && (
          <CreateNewToken
            onClickCancel={() => setIsStep(1)}
            onSave={saveNewCoin}
          ></CreateNewToken>
        )}

        {setStep === 3 && (
          <CreatedToken
            rewardRates={rewardRates}
            onCreateRewardRate={() => setIsStep(1)}
            onEditRewardRate={editRewardRate}
            onBack={onBack}
            onNext={() => {
              onComplete(true, rewardRates);
              onNext();
            }}
          ></CreatedToken>
        )}
      </VStack>
    </HStack>
  );
}

export { Step3 };
