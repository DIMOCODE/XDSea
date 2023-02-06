import React from "react";
import { VStack } from "../../../styles/Stacks";
import styled from "styled-components";
import { BodyRegular } from "../../../styles/TextStyles";

function RewardRateStep(props) {
  const { value, onChange } = props;
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <VStack maxheight="90px" alignment="flex-start" width="100%">
      <BodyRegular>Select your Reward Rate</BodyRegular>

      <Input placeholder={"000"} value={value} onChange={handleChange} />
    </VStack>
  );
}

export { RewardRateStep };

const Input = styled.input`
  background: ${({ theme }) => theme.faded30};
  border: 2px solid rgba(0, 0, 0, 0);
  height: 52px;
  width: 100%;
  padding: 9px;
  border-radius: 9px;
  outline: 0;
  text-align: center;

  &:focus {
    outline: none;
    border: 2px solid #1f42f8;
  }
`;
