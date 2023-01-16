import React from "react";
import Countdown from "react-countdown";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import {
  BodyMedium,
  BodyRegular,
  CaptionBoldShort,
} from "../../styles/TextStyles";
import clock from "../../images/clock.png";
const Renderer = ({ hours, days, minutes, seconds }) => {
  return (
    <>
      {`0${days}`.slice(-2)}:{`0${hours}`.slice(-2)}:{`0${minutes}`.slice(-2)}:
      {`0${seconds}`.slice(-2)}
    </>
  );
};

const CounterStakeBtn = (props) => {
  const { delayMinutes, onComplete } = props;
  return (
    <HStack
      height="52px"
      width="100%"
      background={({ theme }) => theme.faded}
      padding="0 15px"
      border="6px"
      whileTap={{ scale: 0.96 }}
      spacing="9px"
      cursor="not-allowed"
    >
      <IconImg
        cursor="not-allowed"
        url={clock}
        width="26px"
        height="26px"
      ></IconImg>
      <VStack height="50%" spacing="0px">
        <BodyRegular cursor="not-allowed" textcolor="grey">
          <span>dd:hh:mm:ss</span>
        </BodyRegular>
        <BodyMedium cursor="not-allowed">
          <Countdown
            date={Date.now() + delayMinutes * 60 * 1000}
            renderer={Renderer}
            onComplete={onComplete}
          />
        </BodyMedium>
      </VStack>
    </HStack>
  );
};

export { CounterStakeBtn };
