import { BodyRegular } from "./TextStyles";
import { appStyle } from "./AppStyles";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HStack } from "./Stacks";

function Link(props) {
  const { text } = props;
  const opacity = {
    hover: { color: "black" },
    initial: { color: "white" },
  };

  const color = {
    hover: { background: "rgba(255, 245, 245, 0.1)" },
    initial: { background: "rgba(255, 245, 245, 1)" },
  };

  const [isVisible, setIsVisible] = useState(false);
  const history = useHistory();

  /**
   * Redirect the user to a specific path
   *
   * @param {string} route path to be redirected to
   */
  function NavigateTo(route) {
    if (route === "Home") history.push("/");
    else if (route === "Create NFT") history.push("/CreateNFT");
    else if (route === "How To Start") history.push("/HowToStart");
    else history.push(`/${route}`);
  }

  return (
    <HStack
      self="none"
      height="42px"
      border="6px"
      padding="0 15px "
      cursor="pointer"
      animate={isVisible ? "initial" : "hover"}
      variants={color}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <BodyRegular
        animate={isVisible ? "hover" : "initial"}
        variants={opacity}
        textcolor={appStyle.colors.white}
        onClick={() => {
          NavigateTo(text);
        }}
        cursor="pointer"
      >
        {text}
      </BodyRegular>
    </HStack>
  );
}

export { Link };
