import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { VStack, HStack, Spacer, ZItem, ZStack } from "../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold27,
  TitleRegular27,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";

import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import DiscoverBar from "../../images/DiscoverBar.png";

import { FilterCollections } from "../../styles/FilterCollections";
import useWindowSize from "../../styles/useWindowSize";
import { FilterNFT } from "../../styles/FilterNFT";

function SearchPage() {
  const [isSelected, setIsSelected] = useState(true);
  const size = useWindowSize();

  return (
    <SearchSection id="scrollableDiv">
      {/* Top Banner */}
      <HStack backgroundimage={DiscoverBar}>
        <HStack
          width="1200px"
          height="157px"
          padding="0px 30px"
          alignment="center"
          responsive="true"
        >
          <HStack>
            <TitleRegular27 textcolor={appStyle.colors.white}>
              Search results for:
            </TitleRegular27>
            <TitleBold27 textcolor={appStyle.colors.white}>"Lu"</TitleBold27>
          </HStack>

          {size.width > 425 && <Spacer></Spacer>}

          <HStack
            background="rgb(255,255,255,0.1)"
            padding="3px"
            border="6px"
            height="49px"
            self="none"
            spacing="3px"
            blur="10px"
          >
            <ZStack>
              <ZItem>
                {/* Selector */}
                <HStack
                  height="43px"
                  self="none"
                  spacing="3px"
                  justify={isSelected ? "flex-start" : "flex-end"}
                >
                  <HStack
                    width="96px"
                    background="white"
                    border="6px"
                    layout
                  ></HStack>
                </HStack>
              </ZItem>
              <ZItem>
                <HStack height="43px" self="none" spacing="3px">
                  <HStack
                    width="96px"
                    onClick={() => setIsSelected(true)}
                    cursor="pointer"
                  >
                    <CaptionBoldShort
                      textcolor={isSelected ? "black" : "white"}
                      cursor="pointer"
                    >
                      Collections
                    </CaptionBoldShort>
                  </HStack>

                  <HStack
                    width="96px"
                    cursor="pointer"
                    onClick={() => setIsSelected(false)}
                  >
                    <CaptionBoldShort
                      textcolor={isSelected ? "white" : "black"}
                      cursor="pointer"
                    >
                      NFTs
                    </CaptionBoldShort>
                  </HStack>
                </HStack>
              </ZItem>
            </ZStack>
          </HStack>
        </HStack>
      </HStack>

      <ContentSearch id="scrollableDiv">
        {isSelected ? (
          <VStack style={{ zIndex: "20" }}>
            <FilterCollections style={{ zIndex: "60" }}></FilterCollections>

            <VStack
              padding="30px"
              width="100%"
              background={({ theme }) => theme.faded}
              style={{ zIndex: "-50" }}
            >
              Collections Goes Here
            </VStack>
          </VStack>
        ) : (
          <VStack>
            <FilterNFT></FilterNFT>
            <VStack
              padding="30px"
              width="100%"
              background={({ theme }) => theme.faded}
              style={{ zIndex: "-50" }}
            >
              NFT Goes Here{" "}
            </VStack>
          </VStack>
        )}
      </ContentSearch>
    </SearchSection>
  );
}

export { SearchPage };

const SearchSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentSearch = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;
