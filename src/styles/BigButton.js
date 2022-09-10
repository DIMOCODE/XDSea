import React from "react";
import { VStack, HStack } from "./Stacks";
import { BodyRegular, TitleBold18 } from "./TextStyles";

function BigButton(props) {
  const { onClick, text, width } = props;
  return (
    <HStack
      width={width || "400px"}
      height="52px"
      border="9px"
      cursor="pointer"
      whileTap={{ scale: 0.98 }}
      background="linear-gradient(342.17deg, #0905C4 24.4%, #2D28FF 39.63%, #59E1FF 103.94%, #71FCF4 132.7%)"
    >
      <BodyRegular cursor="pointer" textcolor="white">
        {text || " Button Text"}
      </BodyRegular>
    </HStack>
  );
}

export { BigButton };
