import React from "react";
import { useState } from "react";
import { VStack, HStack, IconImg, ZItem, ZStack, Spacer } from "./Stacks";
import { TitleBold18, BodyRegular, TitleBold15 } from "./TextStyles";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { nftaddress } from "../config";
import ButtonApp from "./Buttons";

function OwnedNfts(props) {
  const { collectionGroup } = props;
  const [expand, setIsExpand] = useState(false);

  const history = useHistory();
  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  return (
    <VStack
      width="100%"
      key={"Created"}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
    >
      {collectionGroup.map((item, i) => (
        <VStack
          width="100%"
          padding="30px"
          spacing="21px"
          alignment="flex-start"
        >
          <HStack width="100%">
            <IconImg
              url={item.logo}
              width="60px"
              height="60px"
              backsize="cover"
              border="36px"
            ></IconImg>
            <VStack spacing="6px" alignment="flex-start">
              <TitleBold18>{item.name}</TitleBold18>
              <BodyRegular>{item.items} Items</BodyRegular>
            </VStack>
          </HStack>
          <HStack
            flexwrap="wrap"
            justify="flex-start"
            width="100%"
            overflowx="hidden"
            overflowy="hidden"
            height={expand ? "auto" : "199px"}
            onClick={() => setIsExpand((value) => !value)}
            padding="6px"
          >
            {item.nfts.map((nft, j) => (
              <VStack
                maxwidth="186px"
                minwidth="186px"
                height="186px"
                border="15px"
                cursor="pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  NavigateTo(`nft/${nftaddress}/${nft.tokenId}`);
                }}
              >
                <ZStack cursor={"pointer"}>
                  <CreatorTag>OWNER</CreatorTag>
                  <ZItem>
                    <IconImg
                      url={nft.image}
                      width="100%"
                      height="100%"
                      backsize="cover"
                      border="15px"
                    ></IconImg>
                  </ZItem>
                  <ZItem>
                    <VStack padding="15px">
                      <HStack>
                        <Spacer></Spacer>
                        <IconImg
                          url={nft.image}
                          width="45px"
                          height="45px"
                          backsize="cover"
                          border="45px"
                          bordersize="3px"
                          bordercolor="white"
                        ></IconImg>
                      </HStack>
                      <Spacer></Spacer>
                      <TitleBold15 textcolor={appStyle.colors.white}>
                        {nft.name}
                      </TitleBold15>
                    </VStack>
                  </ZItem>
                </ZStack>
              </VStack>
            ))}
            {/* <VStack
              maxwidth="186px"
              height="186px"
              border="15px"
              whileHover={{ scale: 1.05 }}
              background={({ theme }) => theme.backElement}
              spacing="6px"
              cursor="pointer"
              onClick={() => {
                NavigateTo(`collection/${item.name}`);
              }}
            >
              <IconImg url={seeAll} width="45px" height="45px"></IconImg>
              <BodyBold>See All</BodyBold>
            </VStack> */}
          </HStack>

          <ButtonApp
            text={expand ? "See Less" : "See More"}
            textcolor={appStyle.colors.white}
            border="30px"
            onClick={() => setIsExpand((value) => !value)}
            btnStatus={0}
          ></ButtonApp>
        </VStack>
      ))}
    </VStack>
  );
}

export { OwnedNfts };

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 10px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;
