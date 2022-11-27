import React from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack } from "../../styles/Stacks";

function ButtonActions(props) {
  const { width, isOwner, isStake, redirect } = props;

  return (
    <HStack width={width || "100%"} padding=" 0 ">
      <VStack>
        <ButtonM
          title={isOwner ? isStake ? "Withdraw Stake" : "Stake" : "Purchase"}
          background={({ theme }) => theme.blue}
          textcolor="white"
          onClick={redirect}
        ></ButtonM>
      </VStack>
    </HStack>
  );
}

export { ButtonActions };
