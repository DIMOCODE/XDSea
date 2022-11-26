import React from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { BodyBold, CaptionRegular, TitleBold18 } from "../../styles/TextStyles";

function ThumbBlog(props) {
  const { image, title, date } = props;

  return (
    <HStack padding="30px" cursor="pointer" whileTap={{ scale: 0.96 }}>
      <VStack alignment="flex-start" spacing="3px" cursor="pointer">
        <TitleBold18 cursor="pointer">{title}</TitleBold18>
        <CaptionRegular cursor="pointer">{date}</CaptionRegular>
      </VStack>

      <IconImg
        url={image}
        width="52px"
        height="52px"
        border="6px"
        backsize="cover"
        cursor="pointer"
      ></IconImg>
    </HStack>
  );
}

export { ThumbBlog };
