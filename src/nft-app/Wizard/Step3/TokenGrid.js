import React, { useState } from "react";
import { HStack, IconImg, VStack } from "../../../styles/Stacks";
import { BodyMedium } from "../../../styles/TextStyles";
import xdc from "../../../images/xdcLogo.png";
import addToken from "../../../images/AddTokenIcon.svg";
import { ThemeConsumer } from "styled-components";

function Token(props) {
  const { isDefault, onClick, image, id, name, coinSelected } = props;
  const handleActive = () => {
    onClick();
  };

  return (
    <VStack
      spacing="6px"
      padding="3px"
      maxwidth="90px"
      height="111px"
      border="9px"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.08)" }}
      bordercolor={
        !isDefault && coinSelected === id
          ? ({ theme }) => theme.blueText
          : "transparent"
      }
      bordersize={"2px"}
      onClick={handleActive}
      cursor="pointer"
    >
      <IconImg
        url={image}
        width="52px"
        height="52px"
        cursor="pointer"
      ></IconImg>
      <BodyMedium cursor="pointer">{name}</BodyMedium>
    </VStack>
  );
}

function TokenGrid(props) {
  const { rewardTypes, didSelect, didLaunchCreator } = props;
  const [coinSelected, setCoinSelected] = useState(null);
  const handleDidSelect = (idCoin) => {
    setCoinSelected(idCoin);
    didSelect(idCoin);
  };
  return (
    <HStack flexwrap="wrap" justify="flex-start" spacing="18px">
      {rewardTypes.map((t) => (
        <Token
          key={t._id}
          id={t._id}
          image={t.iconUrl}
          name={t.name}
          coinSelected={coinSelected}
          onClick={() => handleDidSelect(t._id)}
        ></Token>
      ))}
      <Token
        isDefault
        image={addToken}
        name="Add Token"
        onClick={didLaunchCreator}
      ></Token>
    </HStack>
  );
}

export { TokenGrid };
