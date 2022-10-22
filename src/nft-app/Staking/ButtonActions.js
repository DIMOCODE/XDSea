import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack } from "../../styles/Stacks";

function ButtonActions(props) {
  const { width } = props;

  return (
    <HStack width={width || "100%"} padding=" 0 ">
      <VStack>
        <ButtonM
          title="Purchase"
          background={({ theme }) => theme.blue}
          textcolor="white"
        ></ButtonM>
      </VStack>
    </HStack>
  );
}

export { ButtonActions };
