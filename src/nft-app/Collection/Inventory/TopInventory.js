import React from "react";
import { Separator, VStack } from "../../../styles/Stacks";
import { TitleBold15 } from "../../../styles/TextStyles";
import { Holder } from "./Holder";
import mountain from "../../../images/mountain.jpg";

function TopInventory() {
  return (
    <VStack
      width="100%"
      background={({ theme }) => theme.backElement}
      padding="21px"
      border="6px"
      alignment="flex-start"
    >
      <TitleBold15> Top Inventory Stakers</TitleBold15>
      <VStack width="100%">
        <Holder
          image={mountain}
          hasdomain={false}
          address="xdc73...379848"
          percent="50%"
        ></Holder>

        <Separator></Separator>
        <Holder
          image={mountain}
          hasdomain={true}
          domain="mountains.xdc"
          address="xdc73...379848"
          percent="50%"
        ></Holder>
      </VStack>
    </VStack>
  );
}

export { TopInventory };
