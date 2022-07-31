import React from "react";
import { HStack, IconImg, VStack, Spacer, Divider } from "./Stacks";
import { BodyBold, BodyRegular, CaptionRegular } from "./TextStyles";
import transferIcon from "../images/transferIcon.png";
import star from "../images/starColor.png";
import xdclogo from "../images/miniXdcLogo.png";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";

function TableActivityNft(props) {
  const widthRow = "264px";
  const debugColor = "transparent";
  const heightRow = "49px";
  const loadingEvents = [
    { id: 1, name: "Event 1" },
    { id: 2, name: "Event 2" },
    { id: 3, name: "Event 3" },
    { id: 4, name: "Event 4" },
    { id: 5, name: "Event 5" },
    { id: 6, name: "Event 6" },
  ];

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
  }

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  return (
    <VStack width="100%" height="100%" spacing="3px">
      {props?.loading
        ? loadingEvents.map((item) => (
            <>
              <Divider></Divider>
              <VStack width="100%" spacing="0px">
                <HStack key={item.id} width="100%" height={heightRow}>
                  <HStack width={widthRow} background={debugColor}>
                    <TitleLoading
                      key="Offerer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: 0.6,
                      }}
                    ></TitleLoading>
                  </HStack>

                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                  >
                    <TitleLoading
                      key="Offerer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: 0.6,
                      }}
                    ></TitleLoading>
                  </HStack>

                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                  >
                    <TitleLoading
                      key="Offerer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: 0.6,
                      }}
                    ></TitleLoading>
                  </HStack>

                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                  >
                    <TitleLoading
                      key="Offerer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: 0.6,
                      }}
                    ></TitleLoading>
                  </HStack>

                  <HStack background={debugColor} width={widthRow}>
                    <TitleLoading
                      key="Offerer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: 0.6,
                      }}
                    ></TitleLoading>
                  </HStack>
                </HStack>
              </VStack>
            </>
          ))
        : props?.activity.map((item) => (
            <>
              <Divider></Divider>
              <VStack width="100%" spacing="0">
                <HStack key={item.id} width="100%" height={heightRow}>
                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                    justify="flex-start"
                  >
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
                    {item.event.props.children[1].props.children ===
                      "Transfer" ||
                    item.event.props.children[1].props.children === "Mint" ||
                    item.event.props.children[1].props.children ===
                      "Withdraw Listing" ||
                    item.event.props.children[1].props.children ===
                      "Offer Withdrawn" ? (
                      <BodyBold></BodyBold>
                    ) : (
                      <HStack padding="0" width="130px">
                        <VStack spacing="6px">
                          <VStack spacing="0px">
                            <HStack spacing="6px">
                              <IconImg
                                url={xdclogo}
                                width="18px"
                                height="18px"
                              ></IconImg>
                              <BodyRegular>
                                {Number(item.price) > 100000
                                  ? Intl.NumberFormat("en-US", {
                                      notation: "compact",
                                      maximumFractionDigits: 2,
                                    }).format(Number(item.price))
                                  : Number(item.price).toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                      }
                                    ) || "0"}
                              </BodyRegular>
                            </HStack>

                            <CaptionRegular>{`(${
                              props.xdc.xdcPrice * Number(item.price) > 100000
                                ? Intl.NumberFormat("en-US", {
                                    notation: "compact",
                                    maximumFractionDigits: 2,
                                  }).format(
                                    props.xdc.xdcPrice * Number(item.price)
                                  )
                                : (
                                    props.xdc.xdcPrice * Number(item.price)
                                  ).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  }) || "0"
                            } USD)`}</CaptionRegular>
                          </VStack>
                        </VStack>
                      </HStack>
                    )}
                  </HStack>
                  <Spacer></Spacer>
                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                  >
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
                  <HStack
                    spacing="6px"
                    width={widthRow}
                    background={debugColor}
                  >
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
                      title={new Date(item.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    >
                      <BodyRegular>
                        {item.event.props.children[1].props.children !== "Mint"
                          ? determineAgoTime(new Date(item.date))
                          : null}
                      </BodyRegular>
                    </Tooltip>
                  </HStack>
                </HStack>
              </VStack>
            </>
          ))}
    </VStack>
  );
}

export { TableActivityNft };

const TitleLoading = styled(motion.div)`
  width: 150px;
  height: 26px;
  border-radius: 6px;
  background: rgba(153, 162, 175, 0.21);
`;
