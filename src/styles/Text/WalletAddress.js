import React from "react";
import { BodyRegular } from "../TextStyles";
import { HStack, ZStack, ZItem } from "../Stacks";
import { useState } from "react";

function WalletAddress(props) {
  const { walletAddress, width, isMobile } = props;
  const [marginLeft, setMarginLeft] = useState("0px");
  const [background, setBackground] = useState(
    "linear-gradient(90deg, transparent 80%, #11101C)"
  );

  function longPress(callback, ms = 250) {
    let timeout = null;

    const start = () => (timeout = setTimeout(callback, ms));
    const stop = () => timeout && window.clearTimeout(timeout);
    return callback
      ? {
          onMouseDown: start,
          onMouseUp: stop,
          onMouseLeave: stop,
          onTouchStart: start,
          onTouchMove: stop,
          onTouchEnd: stop,
        }
      : {};
  }

  return (
    <ZStack
      overflowx={"hidden"}
      width={width}
      onHoverStart={() => {
        setMarginLeft(`-${isMobile ? walletAddress.length * 5.8 : walletAddress.length * 4.6}px`);
        setBackground("transparent");
      }}
      onHoverEnd={() => {
        setMarginLeft("0px");
        setBackground("linear-gradient(90deg, transparent 80%, #11101C)");
      }}
    >
      <ZItem>
        <BodyRegular
          style={{
            marginLeft: marginLeft,
            "-webkit-transition": "3.3s",
            "-moz-transition": "3.3s",
            transition: "3.3s",
            "-webkit-transition-timing-function": "linear",
            "-moz-transition-timing-function": "linear",
            "transition-timing-function": "linear",
          }}
          textcolor={({ theme }) => theme.walletText}
        >
          {walletAddress}
        </BodyRegular>
      </ZItem>
      <ZItem
        {...longPress(() => {
          setMarginLeft(`-${isMobile ? walletAddress.length * 5.8 : walletAddress.length * 4.6}px`);
          setBackground("transparent");
        })}
      >
        <HStack background={background} height={"100%"}></HStack>
      </ZItem>
    </ZStack>
  );
}

export { WalletAddress };
