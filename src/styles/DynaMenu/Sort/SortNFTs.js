import React from "react";
import { useState } from "react";
import { VStack, HStack } from "../../Stacks";
import { BodyRegular } from "../../TextStyles";

function SortNFTs(props) {
  const { onChange, params, isSearchPage } = props;
  const [isSelected, setIsSelected] = useState(isSearchPage ? 2 : 0);
  const [isOld, setIsOld] = useState(false);
  const [isTopPrice, setIsTopPrice] = useState(false);

  const [isTopOffer, setIsTopOffer] = useState(false);

  const [isAtoZ, setIsAtoZ] = useState(false);

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
              isSelected === 2 ? ({ theme }) => theme.blue : "transparent"
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
              textcolor={isSelected === 2 ? "white" : ({ theme }) => theme.text}
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              isSelected === 0
                ? isOld
                  ? "white"
                  : ({ theme }) => theme.text
                : ({ theme }) => theme.text
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              isSelected === 0
                ? isOld
                  ? ({ theme }) => theme.text
                  : "white"
                : ({ theme }) => theme.text
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
                ? ({ theme }) => theme.blue
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
              isSelected === 1
                ? isTopPrice
                  ? "white"
                  : ({ theme }) => theme.text
                : ({ theme }) => theme.text
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
                : ({ theme }) => theme.blue
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
              isSelected === 1
                ? isTopPrice
                  ? ({ theme }) => theme.text
                  : "white"
                : ({ theme }) => theme.text
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
                ? ({ theme }) => theme.blue
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
              isSelected === 3
                ? isTopOffer
                  ? "white"
                  : ({ theme }) => theme.text
                : ({ theme }) => theme.text
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
                : ({ theme }) => theme.blue
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
              isSelected === 3
                ? isTopOffer
                  ? ({ theme }) => theme.text
                  : "white"
                : ({ theme }) => theme.text
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              isSelected === 4
                ? isAtoZ
                  ? "white"
                  : ({ theme }) => theme.text
                : ({ theme }) => theme.text
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
          <BodyRegular
            cursor="pointer"
            textcolor={
              isSelected === 4
                ? isAtoZ
                  ? ({ theme }) => theme.text
                  : "white"
                : ({ theme }) => theme.text
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
