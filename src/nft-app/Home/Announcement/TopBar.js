import React from "react";
import cross from "../../../images/blueCross.png";
import speaker from "../../../images/speaker.png";
import { HStack, Spacer, IconImg } from "../../../styles/Stacks";
import { TitleBold18 } from "../../../styles/TextStyles";

function TopBar(props) {
  const { onClick } = props;
  return (
    <HStack height="52px" background="#A6FF61" width="100%" padding="15px">
      <Spacer></Spacer>

      <HStack spacing="9px" cursor="pointer">
        <IconImg
          url={speaker}
          width="21px"
          height="21px"
          backsize="cover"
          cursor="pointer"
        ></IconImg>

        <TitleBold18 cursor="pointer" textcolor="#193477">
          ANNOUNCEMENTS
        </TitleBold18>
      </HStack>

      <Spacer></Spacer>
      <IconImg
        url={cross}
        width="21px"
        height="21px"
        backsize="cover"
        cursor="pointer"
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
      ></IconImg>
    </HStack>
  );
}

export { TopBar };
