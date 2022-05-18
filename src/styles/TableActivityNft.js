import React from "react";
import { useState } from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import { BodyBold, BodyRegular } from "./TextStyles";
import transferIcon from "../images/transferIcon.png";
import star from "../images/starColor.png";
import xdclogo from "../images/miniXdcLogo.png";
import Tooltip from "@mui/material/Tooltip";

function TableActivityNft(props) {
  const widthRow = "264px";
  const debugColor = "transparent";
  const heightRow = "49px";

  function determineAgoTime(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

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

      {props?.activity.map((item) => (
        <HStack key={item.id} width="100%" height={heightRow}>
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
            {item.event === "Transfer" || item.event === "Mint" || item.event === "Withdraw Listing" || item.event === "Offer Withdrawn" ? (
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
            <Tooltip title={item.from}>
              <BodyRegular>{truncateAddress(item.from)}</BodyRegular>
            </Tooltip>
          </HStack>
          <Spacer></Spacer>
          <HStack spacing="6px" width={widthRow} background={debugColor}>
            <IconImg
              url={""}
              width="18px"
              height="18px"
              border="30px"
            ></IconImg>
            <Tooltip title={item.to}>
              <BodyRegular>{truncateAddress(item.to)}</BodyRegular>
            </Tooltip>
          </HStack>
          <Spacer></Spacer>
          <HStack background={debugColor} width={widthRow}>
            <Tooltip
              title={new Date(item.date * 1000).toLocaleDateString("en-US", { 
                day: "2-digit", 
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            >
              <BodyRegular>{determineAgoTime(new Date(item.date * 1000))}</BodyRegular>
            </Tooltip>
          </HStack>
          <Spacer></Spacer>
        </HStack>
      ))}

      {/* Table Content */}
    </VStack>
  );
}
export { TableActivityNft };