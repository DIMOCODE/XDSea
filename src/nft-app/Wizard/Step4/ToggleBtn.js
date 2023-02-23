import React, { useState } from "react";
import { HStack, VStack } from "../../../styles/Stacks";

function ToggleBtn(props) {
  const [isActive, setIsActive] = useState(props.value);

  const handleActive = () => {
    setIsActive(!isActive);
    props.onClick();
  };

  return (
    <HStack
      background={
        isActive ? ({ theme }) => theme.blueText : ({ theme }) => theme.faded30
      }
      border="36px"
      width="90px"
      height="39px"
      padding="6px"
      onClick={handleActive}
      justify={isActive ? "flex-end" : "flex-start"}
    >
      <VStack
        maxwidth="30px"
        height="30px"
        border="30px"
        background="white"
        whileTap={{ scale: 0.96 }}
        cursor="pointer"
      ></VStack>
    </HStack>
  );
}

export { ToggleBtn };
