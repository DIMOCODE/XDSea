import React from "react";
import { HStack, Separator, VStack, Spacer } from "../../../styles/Stacks";
import { TitleBold15 } from "../../../styles/TextStyles";
import { Holder } from "./Holder";
import mountain from "../../../images/mountain.jpg";

function TopInventory() {
  return (
    <HStack width="100%">
      <VStack
        width="100%"
        background={({ theme }) => theme.backElement}
        padding="21px 6px 0 21px"
        border="6px"
        alignment="flex-start"
      >
        <TitleBold15> Top Inventory Stakers</TitleBold15>
        <HStack
          width="100%"
          height="290px"
          padding="0 15px 21px  0"
          overflowy="scroll"
          alignment="flex-start"
        >
          <VStack width="100%" height="auto" spacing="15px">
            {Array.from({ length: 20 }, (_, i) => (
              <>
                <Separator></Separator>
                <Holder
                  image={mountain}
                  hasdomain={true}
                  domain="mountains.xdc"
                  address="xdc73...379848"
                  percent="50%"
                ></Holder>
              </>
            ))}
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
}

export { TopInventory };
