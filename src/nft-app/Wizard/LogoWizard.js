import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import logoWizard from "../../images/logoWizardStake.png";
import { CaptionBold, TitleBold18 } from "../../styles/TextStyles";

function LogoWizard(props) {
  const { isWizard } = props;

  return (
    <VStack width="100%" maxheight="180px" spacing="3px">
      <IconImg url={logoWizard} width="100px" height="116px"></IconImg>
      <VStack spacing="6px" maxheight="60px">
        <TitleBold18>Staking Pool</TitleBold18>
        <HStack
          background={
            isWizard
              ? ({ theme }) => theme.blackLinear
              : ({ theme }) => theme.blue
          }
          height="26px"
          border="30px"
        >
          <CaptionBold textcolor="white">
            {isWizard ? "ADMIN" : "WIZARD"}
          </CaptionBold>
        </HStack>
      </VStack>
    </VStack>
  );
}

export { LogoWizard };
