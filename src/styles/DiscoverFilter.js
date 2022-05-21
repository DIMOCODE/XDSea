import React from "react";
import { HStack, IconImg } from "./Stacks";
import Recent from "../images/recent.png";
import Top from "../images/top.png";
import Low from "../images/low.png";
import { BodyRegular } from "./TextStyles";

function DiscoverFilter(props) {
  const { textcolor, background } = props;
  
  return (
    <HStack
      spacing="36px"
      background={background}
      border="9px"
      width="425px"
      height="49px"
    >
      <HStack>
        <BodyRegular textcolor={textcolor}>Recent</BodyRegular>
        <IconImg url={Recent} width="21px" height="21px"></IconImg>
      </HStack>
      <HStack>
        <BodyRegular textcolor={textcolor}>Top Price</BodyRegular>
        <IconImg url={Top} width="21px" height="21px"></IconImg>
      </HStack>
      <HStack>
        <BodyRegular textcolor={textcolor}>Low Price</BodyRegular>
        <IconImg url={Low} width="21px" height="21px"></IconImg>
      </HStack>
    </HStack>
  );
}

export { DiscoverFilter };
