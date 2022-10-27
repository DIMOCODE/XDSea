import React from "react";
import { HStack, IconImg, Spacer } from "../Stacks";
import { TitleRegular18 } from "../TextStyles";

function SlideMenuTabletButton(props) {
  const { showMenu, setShowMenu, redirect, title, icon, isDivider } = props;

  return (
    <>
      <HStack
        minheight="42px"
        cursor="pointer"
        onClick={() => {
          setShowMenu(!showMenu);
          redirect();
        }}
      >
        <TitleRegular18 textcolor={({ theme }) => theme.text}>
          {title}
        </TitleRegular18>
        <Spacer></Spacer>

        <IconImg
          cursor="pointer"
          url={icon}
          width="42px"
          height="42px"
          border="42px"
          bordersize="3px"
          bordercolor="white"
          backsize="cover"
          whileTap={{ scale: 0.96 }}
        ></IconImg>
      </HStack>

      {isDivider && (
        <HStack
          background="rgba(0,0,0, 0.15)"
          minheight="1px"
          width="100%"
        ></HStack>
      )}
    </>
  );
}

export { SlideMenuTabletButton };
