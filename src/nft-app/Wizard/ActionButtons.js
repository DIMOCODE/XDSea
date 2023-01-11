import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack } from "../../styles/Stacks";

function ActionButtons(props) {
  return (
    <HStack>
      <ButtonM
        title={props.grayBtn}
        background={({ theme }) => theme.faded30}
        height="52px"
        onClick={props.onClickGray}
      ></ButtonM>
      <ButtonM
        title={props.blueBtn}
        background={({ theme }) => theme.blue}
        textcolor="white"
        height="52px"
        onClick={props.onClickBlue}
      ></ButtonM>
    </HStack>
  );
}

export { ActionButtons };
