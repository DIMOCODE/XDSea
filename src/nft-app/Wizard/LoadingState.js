import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyMedium, TitleBold30 } from "../../styles/TextStyles";
import loading from "../../images/LoadingState.gif";
import success from "../../images/IconStaking.png";
import error from "../../images/ErrorState.gif";
import { useState } from "react";
import { ButtonM } from "../../styles/Buttons/ButtonM";

function LoadingState(props) {
  const [setStatus, setIsStatus] = useState(props.state);
  return (
    <HStack width="100%">
      <VStack maxwidth="390px" height="420px">
        {setStatus === "loading" && (
          <VStack>
            <IconImg url={loading} width="240px" height="240px"></IconImg>
            <BodyMedium> Crafting your staking pool</BodyMedium>
          </VStack>
        )}

        {setStatus === "published" && (
          <VStack width="300px" spacing="15px">
            <IconImg url={success} width="180px" height="180px"></IconImg>
            <TitleBold30>Congratulations</TitleBold30>
            <BodyMedium align="center">
              Your Staking Pool was successfully published on the marketplace
            </BodyMedium>

            <ButtonM
              width="100%"
              height="52px"
              title="Visit Staking Pool Manager"
              textcolor="white"
              background={({ theme }) => theme.blue}
            ></ButtonM>

            <ButtonM
              width="100%"
              height="52px"
              title="Visit NFT Collection"
              textcolor={({ theme }) => theme.blueText}
              background="rgba(54, 102, 255, 0.23)"
            ></ButtonM>
          </VStack>
        )}

        {setStatus === "error" && (
          <VStack width="300px">
            <IconImg url={error} width="180px" height="180px"></IconImg>
            <BodyMedium align="center">
              There was an error trying to create your Staking Pool
            </BodyMedium>

            <ButtonM
              width="100%"
              height="52px"
              title="Contact Support"
              textcolor={({ theme }) => theme.backElement}
              background={({ theme }) => theme.blue}
            ></ButtonM>
          </VStack>
        )}
      </VStack>
    </HStack>
  );
}

export { LoadingState };
