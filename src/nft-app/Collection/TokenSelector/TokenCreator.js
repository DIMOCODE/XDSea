import React from "react";
import { useState } from "react";

import { HStack, IconImg, Separator, VStack } from "../../../styles/Stacks";
import {
  CaptionBold,
  CaptionBoldShort,
  TitleBold15,
} from "../../../styles/TextStyles";
import photo from "../../../images/photoIcon.png";
import { InputStyled } from "../../../styles/InputStyled";
import { ButtonM } from "../../../styles/Buttons/ButtonM";
import { HexColorPicker } from "powerful-color-picker";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import "./color.css";

function TokenCreator(props) {
  const { newname, onClickCancel } = props;
  const [color, setColor] = useState("blue");
  const [isColor, setIsColor] = useState(false);

  return (
    <VStack width="100%">
      <TitleBold15>Fill up token creation</TitleBold15>
      <Separator></Separator>
      <HStack style={{ zIndex: 100 }}>
        {/* Token Image */}
        <VStack spacing="6px" maxwidth="120px">
          <TitleBold15>Token Image</TitleBold15>
          <VStack
            width="57px"
            minheight="57px"
            border="57px"
            background={({ theme }) => theme.faded30}
          >
            <IconImg url={photo} width="21px" height="21px"></IconImg>
          </VStack>
        </VStack>

        {/* Token Name */}
        <VStack alignment="flex-start" spacing="9px">
          <TitleBold15> Token Name</TitleBold15>
          <HStack height="52px" border="6px" padding="0 12px">
            <InputStyled
              fontsize="18px"
              background={({ theme }) => theme.faded30}
              width="100%"
              height="52px"
              iconWidth="1px"
              padding="0 12px"
              weight="bold"
              placeholder="Write your token name ex (XDC)"
              textalign="center"
              textcolor={color}
              textplace="rgba(0, 0, 0, 0.3)"
            ></InputStyled>
            {isColor ? (
              <>
                <VStack minwidth="33px" height="33px">
                  <CaptionBold textcolor="transparent">0</CaptionBold>
                </VStack>
                <AbsoluteColor className="small example">
                  <HexColorPicker color={color} onChange={setColor} />
                  <ButtonM
                    background={color}
                    textcolor="white"
                    title="Set Color"
                    onClick={() => setIsColor(false)}
                  ></ButtonM>
                </AbsoluteColor>
              </>
            ) : (
              <VStack
                border="6px"
                minwidth="33px"
                height="33px"
                background={color}
                bordercolor="white"
                bordersize="3px"
                whileTap={{ scale: 0.96 }}
                cursor="pointer"
                onClick={() => setIsColor(true)}
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CaptionBold textcolor="transparent">0</CaptionBold>
              </VStack>
            )}
            {/* https://github.com/Chi-Thang/powerful-color-picker */}
          </HStack>
        </VStack>
      </HStack>
      <Separator></Separator>

      {/* Contract Address Section */}
      <VStack alignment="flex-start" spacing="9px" width="100%">
        <TitleBold15> Contract Address</TitleBold15>
        <HStack height="52px" border="6px">
          <InputStyled
            fontsize="18px"
            background={({ theme }) => theme.faded30}
            width="100%"
            height="52px"
            iconWidth="1px"
            padding="0 12px"
            weight="bold"
            placeholder="Paste your contract address"
            textalign="center"
            textplace="rgba(0, 0, 0, 0.3)"
          ></InputStyled>
        </HStack>
      </VStack>

      <Separator></Separator>

      {/* Action Buttons */}

      <HStack>
        <ButtonM
          background="#CCD8F8"
          textcolor={({ theme }) => theme.blue}
          title="Cancel"
          height="52px"
          onClick={onClickCancel}
        ></ButtonM>{" "}
        <ButtonM
          textcolor="white"
          background={({ theme }) => theme.blue}
          title="Add Token"
          height="52px"
        ></ButtonM>
      </HStack>
    </VStack>
  );
}

export { TokenCreator };

const AbsoluteColor = styled(motion.div)`
  position: absolute;
  z-index: 100;
  right: 0;
`;
