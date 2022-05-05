import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import { BodyBold, BodyRegular } from "./TextStyles";
import transferIcon from "../images/transferIcon.png";
import star from "../images/starColor.png";
import xdclogo from "../images/miniXdcLogo.png";

function TableActivityNft() {
  const widthRow = "264px";
  const debugColor = "transparent";
  const heightRow = "49px";

  const [arrayRows, setArrayRows] = useState([
    {
      id: 1,
      event: "Transfer",
      price: "",
      from: "Yoselin",
      to: "Lia",
      date: "9 April 2022",
    },
    {
      id: 2,
      event: "Price",
      price: "10,000",
      from: "Paul ",
      to: "Yoselin",
      date: "10 april 2022",
    },
  ]);

  return (
    <VStack
      width="100%"
      background={({ theme }) => theme.backElement}
      border="9px"
      spacing="3px"
    >
      {/* Table Head*/}
      <HStack width="100%" height={heightRow}>
        <Spacer></Spacer>
        <HStack background={debugColor} width={widthRow}>
          <BodyBold>EVENT</BodyBold>
        </HStack>

        <Spacer></Spacer>
        <HStack background={debugColor} width={widthRow}>
          <BodyBold>PRICE</BodyBold>
        </HStack>
        <Spacer></Spacer>
        <HStack background={debugColor} width={widthRow}>
          <BodyBold>FROM</BodyBold>
        </HStack>
        <Spacer></Spacer>
        <HStack background={debugColor} width={widthRow}>
          <BodyBold>TO</BodyBold>
        </HStack>
        <Spacer></Spacer>
        <HStack background={debugColor} width={widthRow}>
          <BodyBold>DATE</BodyBold>
        </HStack>
        <Spacer></Spacer>
      </HStack>
      <Divider></Divider>

      {arrayRows.map((item) => (
        <HStack width="100%" height={heightRow}>
          <Spacer></Spacer>
          <HStack spacing="6px" width={widthRow} background={debugColor}>
            <IconImg
              url={
                item.event === "Transfer"
                  ? transferIcon
                  : item.event === "Price"
                  ? star
                  : null
              }
              width="18px"
              height="18px"
              border="30px"
            ></IconImg>

            <BodyRegular>{item.event}</BodyRegular>
          </HStack>
          <Spacer></Spacer>
          <HStack width={widthRow} background={debugColor}>
            {item.event === "Transfer" ? (
              <BodyBold></BodyBold>
            ) : (
              <HStack spacing="6px">
                <IconImg url={xdclogo} width="18px" height="18px"></IconImg>
                <BodyRegular>{item.price}</BodyRegular>
              </HStack>
            )}
          </HStack>

          <Spacer></Spacer>
          <HStack spacing="6px" width={widthRow} background={debugColor}>
            <IconImg
              url={""}
              width="18px"
              height="18px"
              border="30px"
            ></IconImg>

            <BodyRegular>TeamAzuki</BodyRegular>
          </HStack>
          <Spacer></Spacer>
          <HStack spacing="6px" width={widthRow} background={debugColor}>
            <IconImg
              url={""}
              width="18px"
              height="18px"
              border="30px"
            ></IconImg>

            <BodyRegular>TeamMoar</BodyRegular>
          </HStack>
          <Spacer></Spacer>
          <HStack background={debugColor} width={widthRow}>
            <BodyRegular>10 days ago</BodyRegular>
          </HStack>
          <Spacer></Spacer>
        </HStack>
      ))}

      {/* Table Content */}
    </VStack>
  );
}
export { TableActivityNft };
