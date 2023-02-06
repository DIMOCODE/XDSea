import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack } from "../../styles/Stacks";

function ActionButtons(props) {
  const {
    grayBtn,
    blueBtn,
    onClickGray,
    onClickBlue,
    grayBtnDisabled,
    blueBtnDisabled,
  } = props;
  return (
    <HStack>
      <ButtonM
        title={grayBtn}
        background={({ theme }) => theme.faded30}
        height="52px"
        onClick={onClickGray}
        disabled={grayBtnDisabled}
      ></ButtonM>
      <ButtonM
        title={blueBtn}
        background={({ theme }) => theme.blue}
        textcolor="white"
        height="52px"
        onClick={onClickBlue}
        disabled={blueBtnDisabled}
      ></ButtonM>
    </HStack>
  );
}

export { ActionButtons };
