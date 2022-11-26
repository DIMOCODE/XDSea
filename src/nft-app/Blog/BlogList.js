import React from "react";
import { Separator, VStack, Spacer, HStack } from "../../styles/Stacks";
import { BodyBold } from "../../styles/TextStyles";
import { ThumbBlog } from "./ThumbBlog";
import thumb from "../../images/mountain.jpg";

function BlogList(props) {
  const { variants, transition } = props;

  return (
    <VStack
      width="100%"
      spacing="0px"
      background={({ theme }) => theme.backElement}
      padding="0 0 60px 0"
      height="auto"
      variants={variants}
      transition={transition}
    >
      <HStack height="90px">
        <BodyBold>MORE FROM THIS BLOG</BodyBold>
      </HStack>

      <Separator></Separator>

      <ThumbBlog
        image={thumb}
        title="New Challenges for the NFT Space"
        date="20 Nov 22"
      ></ThumbBlog>
      <Separator></Separator>
      <ThumbBlog
        image={thumb}
        title="The bullmarket is coming be ready"
        date="22 Nov 22"
      ></ThumbBlog>
    </VStack>
  );
}

export { BlogList };
