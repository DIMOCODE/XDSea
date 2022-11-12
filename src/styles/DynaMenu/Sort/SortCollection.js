import React from "react";
import { useState } from "react";
import { VStack, HStack } from "../../Stacks";
import { BodyRegular } from "../../TextStyles";

function SortCollection(props) {
  const {
    onChange,
    params,
    isSearchPage,
    isSelected,
    setIsSelected,
    isOld,
    setIsOld,
    isVolumeTop,
    setIsVolumeTop,
    isTopOwners,
    setIsTopOwners,
    isTopFloor,
    setIsTopFloor,
    isTopQuantity,
    setIsTopQuantity,
    isAtoZ,
    setIsAtoZ,
  } = props;

  return (
    <VStack width="100%">
      {/* Relevance */}
      {isSearchPage ? (
        <VStack
          minheight="49px"
          background="rgba(255, 255, 255, 0.06)"
          border="6px"
          spacing="6px"
          onClick={() => {
            setIsSelected(6);
          }}
          padding="3px"
          width="100%"
        >
          {/* Option1  */}
          <HStack
            background={
              isSelected === 6 ? ({ theme }) => theme.blue : "transparent"
            }
            width="100%"
            border="6px"
            cursor="pointer"
            height="43px"
            onClick={() => {
              onChange({
                ...params,
                page: 1,
                sortBy: "relevance",
                sortDirection: 1,
              });
            }}
          >
            <BodyRegular cursor="pointer" textcolor={"white"}>
              Most Relevance
            </BodyRegular>
          </HStack>
        </VStack>
      ) : null}

      {/* Publication */}
      <HStack
        height="49px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(0);
        }}
        padding="3px"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 0
              ? isOld
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsOld(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "publication",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Oldest
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 0
              ? isOld
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsOld(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "publication",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Newest
          </BodyRegular>
        </HStack>
      </HStack>

      {/* Volume */}
      <HStack
        height="49px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(1);
        }}
        padding="3px"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 1
              ? isVolumeTop
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsVolumeTop(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "volumeTrade",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Greatest Volume
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 1
              ? isVolumeTop
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsVolumeTop(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "volumeTrade",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Least Volume
          </BodyRegular>
        </HStack>
      </HStack>

      {/* Owners */}
      <HStack
        height="49px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(2);
        }}
        padding="3px"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 2
              ? isTopOwners
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsTopOwners(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "owners",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Most Owners
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 2
              ? isTopOwners
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsTopOwners(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "owners",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Least Owners
          </BodyRegular>
        </HStack>
      </HStack>

      {/*  Floor Price  */}
      <VStack
        minheight="98px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(3);
        }}
        padding="3px"
        width="100%"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 3
              ? isTopFloor
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          height="43px"
          onClick={() => {
            setIsTopFloor(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "floorPrice",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Highest Floor Price
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 3
              ? isTopFloor
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsTopFloor(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "floorPrice",
              sortDirection: 1,
            });
          }}
          height="43px"
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Lowest Floor Price
          </BodyRegular>
        </HStack>
      </VStack>

      {/* NFT Quantity */}
      <HStack
        height="49px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(4);
        }}
        padding="3px"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 4
              ? isTopQuantity
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsTopQuantity(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "nfts",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Most NFTs
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 4
              ? isTopQuantity
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsTopQuantity(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "nfts",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Least NFTs
          </BodyRegular>
        </HStack>
      </HStack>

      {/* Alphabetical */}
      <HStack
        height="49px"
        background="rgba(255, 255, 255, 0.06)"
        border="6px"
        spacing="6px"
        onClick={() => {
          setIsSelected(5);
        }}
        padding="3px"
      >
        {/* Option1  */}
        <HStack
          background={
            isSelected === 5
              ? isAtoZ
                ? ({ theme }) => theme.blue
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsAtoZ(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "alphabetical",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            A to Z
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 5
              ? isAtoZ
                ? "transparent"
                : ({ theme }) => theme.blue
              : null
          }
          onClick={() => {
            setIsAtoZ(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "alphabetical",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular cursor="pointer" textcolor={"white"}>
            Z to A
          </BodyRegular>
        </HStack>
      </HStack>
    </VStack>
  );
}

export { SortCollection };