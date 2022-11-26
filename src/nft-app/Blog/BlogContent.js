import React from "react";
import { VStack, IconImg } from "../../styles/Stacks";
import { BodyRegular, TitleBold30 } from "../../styles/TextStyles";
import { CreatorAndShare } from "./CreatorAndShare";

function BlogContent(props) {
  const { title, image, date, content, padding } = props;
  return (
    <VStack
      padding={padding || "42px"}
      spacing="30px"
      width="100%"
      alignment="flex-start"
    >
      <TitleBold30>{title}</TitleBold30>

      <IconImg
        url={image}
        width="100%"
        height="360px"
        backsize="cover"
        border="6px"
      ></IconImg>

      <CreatorAndShare date={date}></CreatorAndShare>

      <BodyRegular>{content}</BodyRegular>
    </VStack>
  );
}

export { BlogContent };
