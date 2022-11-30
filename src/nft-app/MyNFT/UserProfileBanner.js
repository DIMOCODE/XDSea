import React from "react";
import { VStack, IconImg } from "../../styles/Stacks";

function UserProfileBanner(props) {
  const { height, url } = props;
  return (
    <VStack width="100%" height={height} justify="flex-start">
      <IconImg url={url} backsize="cover" width="100%" height="100%"></IconImg>
    </VStack>
  );
}

export { UserProfileBanner };
