import React from "react";
import { HStack, VStack } from "../../../styles/Stacks";
import { BodyRegular, CaptionBoldShort } from "../../../styles/TextStyles";
import styled from "styled-components";
import { TimeSelector } from "./TimeSelector";

function RewardFrequencyStep(props) {
  const { time, timeType, onChangeTime, onChangeTimeType, headerLabel } = props;

  const handleChangeInput = (event) => {
    const { value } = event.target;
    console.log(typeof value);
    if (value === "" || value > 0) {
      onChangeTime(value);
    }
  };
  return (
    <VStack
      maxheight="90px"
      alignment="flex-start"
      width="100%"
      style={{ zIndex: 10 }}
    >
      <BodyRegular>{headerLabel}</BodyRegular>

      <HStack>
        <VStack maxwidth="30%">
          <CaptionBoldShort
            style={{ position: "absolute", top: "19px", left: "15px" }}
          >
            TIME
          </CaptionBoldShort>
          <Input
            placeholder={"01"}
            type="number"
            value={time}
            onChange={handleChangeInput}
          />
        </VStack>

        <TimeSelector
          selectedValue={timeType}
          onChangeSelectedValue={onChangeTimeType}
        />
      </HStack>
    </VStack>
  );
}

export { RewardFrequencyStep };

const Input = styled.input`
  background: ${({ theme }) => theme.faded30};
  border: 2px solid rgba(0, 0, 0, 0);
  height: 52px;
  width: 100%;
  padding: 9px 9px 9px 21px;
  border-radius: 9px;
  outline: 0;
  text-align: center;

  &:focus {
    outline: none;
    border: 2px solid #1f42f8;
  }
`;
