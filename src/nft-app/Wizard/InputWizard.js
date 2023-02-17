import React, { useState } from "react";
import styled from "styled-components";
import { VStack } from "../../styles/Stacks";
//TODO: example

function InputWizard({ valueIn, onComplete, onChange }) {
  const [value, setValue] = useState(valueIn);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);

  let text;

  if (error) {
    text = "Check Again";
  } else if (valid) {
    text = "Valid Contract";
  } else {
    text = "43 Characters";
  }

  function handleChange(event) {
    setValue(event.target.value);
    onChange(event.target.value);
    if (event.target.value.length >= 42 && event.target.value.length <= 43) {
      setValid(true);
      onComplete(true);
      setError(false);
    } else {
      setValid(false);
      onComplete(false);
      setError(event.target.value.length > 43);
    }
  }

  return (
    <VStack width="100%" maxheight="90px">
      <Input
        error={error}
        valid={valid}
        onChange={handleChange}
        value={value}
        placeholder="Contract Address"
      />
      <Text error={error} valid={valid}>
        {text}
      </Text>
    </VStack>
  );
}

export { InputWizard };

const Input = styled.input`
  border: 2px solid
    ${(props) => {
      if (props.error) return "red";
      if (props.valid) return "green";
      return "#1F42F8";
    }};
  height: 52px;
  width: 100%;
  padding: 9px;
  border-radius: 9px;
  outline: 0;

  &:focus {
    border-color: ${(props) => {
      if (props.error) return "red";
      if (props.valid) return "green";
      return "#1F42F8";
    }};
    outline: 0;
  }
`;

const Text = styled.div`
  background: ${(props) => {
    if (props.error) return "red";
    if (props.valid) return "green";
    return "#1F42F8";
  }};
  border-radius: 6px;
  padding: 0 9px;
  color: white;
  font-size: 15px;
  position: absolute;
  right: 6px;
  top: 10px;
`;
