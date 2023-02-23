import React, { useEffect } from "react";
import { HStack, VStack } from "../../styles/Stacks";
import { BodyRegular, TitleBold15 } from "../../styles/TextStyles";
import { Checkmark } from "./Checkmark";

function StepWiz(props) {
  const { title, description, selected, completed, didSelect } = props;

  return (
    <HStack
      padding="6px 30px"
      background={selected ? "white" : "transparent"}
      height="100%"
      // whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
      cursor="pointer"
      onClick={didSelect}
    >
      <Checkmark selected={selected} completed={completed} />
      <VStack spacing="0px" alignment="flex-start" cursor="pointer">
        <TitleBold15 cursor="pointer">{title}</TitleBold15>
        <BodyRegular cursor="pointer">{description}</BodyRegular>
      </VStack>
    </HStack>
  );
}

export { StepWiz };
