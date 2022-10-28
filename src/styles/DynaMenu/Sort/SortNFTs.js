import React from "react";
import { useState } from "react";
import { VStack, HStack } from "../../Stacks";
import { BodyRegular } from "../../TextStyles";

function SortNFTs(props) {
  const {
    onChange,
    params,
    isSearchPage,
    isSelected,
    setIsSelected,
    isOld,
    setIsOld,
    isTopPrice,
    setIsTopPrice,
    isTopOffer,
    setIsTopOffer,
    isAtoZ,
    setIsAtoZ,
  } = props;

  return (
    <VStack width="100%">
      {/* Relevance */}
      {isSearchPage ? (
        <VStack
          minheight="49px"
          background={({ theme }) => theme.faded}
          border="6px"
          spacing="6px"
          onClick={() => {
            setIsSelected(2);
          }}
          padding="3px"
          width="100%"
        >
          {/* Option1  */}
          <HStack
            background={
              isSelected === 2 ? "blue" : "transparent"
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
            <BodyRegular
              cursor="pointer"
              textcolor={"white"}
            >
              Most Relevance
            </BodyRegular>
          </HStack>
        </VStack>
      ) : null}

      {/* Publication */}
      <HStack
        height="49px"
        background={({ theme }) => theme.faded}
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
                ? "blue"
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
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
                : "blue"
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Newest
          </BodyRegular>
        </HStack>
      </HStack>

      {/* Price */}
      <HStack
        height="49px"
        background={({ theme }) => theme.faded}
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
              ? isTopPrice
                ? "blue"
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          onClick={() => {
            setIsTopPrice(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "price",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Highest Price
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 1
              ? isTopPrice
                ? "transparent"
                : "blue"
              : null
          }
          onClick={() => {
            setIsTopPrice(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "price",
              sortDirection: 1,
            });
          }}
        >
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Lowest Price
          </BodyRegular>
        </HStack>
      </HStack>

      {/*  NFT Quantity  */}
      <VStack
        minheight="98px"
        background={({ theme }) => theme.faded}
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
              ? isTopOffer
                ? "blue"
                : "transparent"
              : null
          }
          width="100%"
          border="6px"
          cursor="pointer"
          height="43px"
          onClick={() => {
            setIsTopOffer(true);
            onChange({
              ...params,
              page: 1,
              sortBy: "offersAmount",
              sortDirection: -1,
            });
          }}
        >
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Most Offers
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 3
              ? isTopOffer
                ? "transparent"
                : "blue"
              : null
          }
          onClick={() => {
            setIsTopOffer(false);
            onChange({
              ...params,
              page: 1,
              sortBy: "offersAmount",
              sortDirection: 1,
            });
          }}
          height="43px"
        >
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Least Offers
          </BodyRegular>
        </HStack>
      </VStack>

      {/* Alphabetical */}
      <HStack
        height="49px"
        background={({ theme }) => theme.faded}
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
              ? isAtoZ
                ? "blue"
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            A to Z
          </BodyRegular>
        </HStack>

        {/* Option2  */}
        <HStack
          cursor="pointer"
          width="100%"
          border="6px"
          background={
            isSelected === 4
              ? isAtoZ
                ? "transparent"
                : "blue"
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              "white"
            }
          >
            Z to A
          </BodyRegular>
        </HStack>
      </HStack>
    </VStack>
  );
}

export { SortNFTs };
