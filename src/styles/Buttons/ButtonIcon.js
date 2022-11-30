import React from "react";
import { HStack, IconImg } from "../Stacks";

function ButtonIcon(props) {
  const { icon, onClick, background } = props;

  return (
    <HStack
      background={background}
      width="39px"
      height="39px"
      border="20px"
      cursor="pointer"
      onClick={onClick}
      self="none"
      whileTap={{ scale: 0.96 }}
      style={{
        boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <IconImg url={icon} width="15px" height="15px" cursor="pointer"></IconImg>
    </HStack>
  );
}

export { ButtonIcon };
