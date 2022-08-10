import { BodyRegular } from "./TextStyles";
import { appStyle } from "./AppStyles";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function Link(props) {
  const { text } = props;
  const opacity = {
    hover: { opacity: 1, x: 6 },
    initial: { opacity: 0.6, x: 0 },
  };
  const [isVisible] = useState(false);
  const history = useHistory();

  /**
   * Redirect the user to a specific path
   * 
   * @param {string} route path to be redirected to
   */
  function NavigateTo(route) {
    if(route === "Home")
      history.push("/");
    else if(route === "Create NFT")
      history.push("/CreateNFT");
    else if(route === "How To Start")
      history.push("/HowToStart");
    else
      history.push(`/${route}`);
  }

  return (
    <BodyRegular
      animate={isVisible ? "hover" : "initial"}
      variants={opacity}
      textcolor={appStyle.colors.white}
      whileHover={{ scale: 1.2 }}
      onClick={() => {NavigateTo(text)}}
      cursor="pointer"
    >
      {text}
    </BodyRegular>
  );
}

export { Link };
