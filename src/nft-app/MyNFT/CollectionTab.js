import React from "react";
import { useState } from "react";
import newBlue from "../../images/newBlue.png";
import { HStack, IconImg } from "../../styles/Stacks";
import { BodyRegular } from "../../styles/TextStyles";

function CollectionTab(props) {
  const {
    onClick,
    image,
    name,
    params,
    collectionId,
    isSelected,
    filterId,
    onSelect,
  } = props;

  const color = {
    hover: { background: "rgba(0, 0, 0, 0.1)" },
    initial: { background: "rgba(255, 255, 255, 1)" },
  };

  const [isVisible, setIsVisible] = useState(false);

  return (
    <HStack
      self="none"
      background="white"
      height="48px"
      padding="0 15px 0 9px"
      border="30px"
      spacing="9px"
      cursor="pointer"
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (!isSelected) {
          onClick({
            ...params,
            page: 1,
            collectionId,
          });
          onSelect(filterId, true);
        } else {
          onClick({
            ...params,
            page: 1,
            collectionId: "",
          });
          onSelect(filterId, false);
        }
      }}
      animate={isSelected ? "initial" : isVisible ? "initial" : "hover"}
      variants={color}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <IconImg
        url={image || newBlue}
        width="36px"
        height="36px"
        backsize="cover"
        border="36px"
        cursor="pointer"
      ></IconImg>
      <BodyRegular
        cursor="pointer"
        textcolor={
          isSelected ? "black" : isVisible ? "black" : "rgba(0,0,0,0.6)"
        }
      >
        {name || "Collection Name"}
      </BodyRegular>
    </HStack>
  );
}

export { CollectionTab };
