import React, { useState } from "react";
import { IconImg, VStack } from "./Stacks";
import sun from "../images/sun.png";
import moon from "../images/moon.png";

function SwitchButton(props) {
  const { clickOnSwitch } = props;
  const [isVisible, setIsVisible] = useState(false);
  const scaleContainer = {
    sun: {
      background: "#FFFFFF",
      scale: 0.9,
    },

    moon: {
      background: "#2E334D",
      scale: 1,
    },
  };

  const creator = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 0 },
  };

  return (
    <VStack
      onClick={clickOnSwitch}
      maxwidth="39px"
      minwidth="39px"
      height="39px"
    >
      <VStack
        border="90px"
        maxwidth="39px"
        minwidth="39px"
        height="39px"
        animate={isVisible ? "sun" : "moon"}
        variants={scaleContainer}
        onTap={() => setIsVisible((isVisible) => !isVisible)}
      >
        {isVisible ? (
          <IconImg url={sun} width="18px" height="18px"></IconImg>
        ) : (
          <IconImg url={moon} width="18px" height="18px"></IconImg>
        )}
      </VStack>
    </VStack>
  );
}
export { SwitchButton };
