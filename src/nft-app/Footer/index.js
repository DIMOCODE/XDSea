import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import XDSeaWhite from "../../images/logoXDSEAWhite.png";
import twitter from "../../images/twitterLogoWhite.png";
import instagram from "../../images/InstagramLogoWhite.png";
import mail from "../../images/mailWhite.png";
import {
  BodyRegular,
  TitleRegular21,
  TitleRegular18,
  CaptionBoldShort,
  CaptionBold,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Link } from "../../styles/Link";
import useWindowSize from "../../styles/useWindowSize";
import styled from "styled-components";
import footerBanner from "../../images/FooterImage.webp";
import logoOutline from "../../images/XDSeaOutlines.webp";
import instaIcon from "../../images/instaIconFooter.png";
import twitterIcon from "../../images/twitterIconFooter.png";
import mailIcon from "../../images/mailIconFooter.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { createRequest } from "../../API";
import { HTTP_METHODS } from "../../constant";

function Footer(props) {
  const size = useWindowSize();
  const [instagramFollowers, setInstagramFollowers] = useState(4237);
  const [twitterFollowers, setTwitterFollowers] = useState(0);

  const getTwitterData = async () => {
    const twitterData = await createRequest(HTTP_METHODS.get, "spotlightList/socialMedia", null, null);
    setTwitterFollowers(twitterData.data.socialMediaMetrics.twitter);
  }

  const getInstagramData = async () => {
    
  }

  useEffect(() => {
    getTwitterData();
    getInstagramData();
  }, [])

  return (
    <FooterSection size={"cover"}>
      <FooterContent>
        <LayoutGroup id="footer">
          <VStack spacing="30px">
            <HStack
              responsive={true}
              alignment="flex-start"
              padding={size.width < 768 ? "0 60px" : "0 30px"}
            >
              {/* Footer Logo */}
              <VStack
                alignment="flex-start"
                spacing="6px"
                onClick={() => props.redirect("")}
              >
                <IconImg
                  url={logoOutline}
                  width={size.width < 768 ? "120px" : "180px"}
                  height={size.width < 768 ? "120px" : "180px"}
                  cursor={"pointer"}
                ></IconImg>
              </VStack>

              {/* Marketplace Quick Links */}
              <VStack alignment="flex-start">
                <TitleRegular21 textcolor={appStyle.colors.white}>
                  Marketplace
                </TitleRegular21>

                <Link cursor={"pointer"} text="Home"></Link>
                <Link cursor={"pointer"} text="Discover"></Link>
                <Link cursor={"pointer"} text="How To Start"></Link>

                <Spacer></Spacer>
              </VStack>

              {/* Account Quick Links */}
              <VStack alignment="flex-start">
                <TitleRegular21 textcolor={appStyle.colors.white}>
                  Account
                </TitleRegular21>

                <Link text="Create NFT"></Link>

                <Spacer></Spacer>
              </VStack>

              {/* Social Links */}
              <VStack alignment="flex-start">
                <TitleRegular21 textcolor={appStyle.colors.white}>
                  Social
                </TitleRegular21>

                <a href="https://twitter.com/XDSeaNFT">
                  <HStack
                    background="white"
                    border="6px"
                    height="52px"
                    padding="0 12px"
                    self="none"
                    cursor="pointer"
                  >
                    <IconImg
                      url={twitterIcon}
                      width="30px"
                      height="30px"
                      cursor="pointer"
                    ></IconImg>
                    <VStack spacing="0px" alignment="3px" cursor="pointer">
                      <TitleRegular18 cursor="pointer">
                        @XDSeaNFT
                      </TitleRegular18>
                      <CaptionBold textcolor="#0471C0" cursor="pointer">
                        {Number(twitterFollowers) > 1000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 1,
                            }).format(Number(twitterFollowers))
                          : Number(twitterFollowers).toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 1,
                              }
                            ) || "0"} FOLLOWERS
                      </CaptionBold>
                    </VStack>
                  </HStack>
                </a>

                <a href="https://www.instagram.com/xdsea.nft/">
                  <HStack
                    background="white"
                    border="6px"
                    height="52px"
                    padding="0 12px"
                    self="none"
                    cursor="pointer"
                  >
                    <IconImg
                      url={instaIcon}
                      width="30px"
                      height="30px"
                      cursor="pointer"
                    ></IconImg>
                    <VStack spacing="0px" alignment="3px" cursor="pointer">
                      <TitleRegular18 cursor="pointer">
                        @xdsea.nft
                      </TitleRegular18>
                      <CaptionBold textcolor="#DD4280" cursor="pointer">
                        {Number(instagramFollowers) > 1000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 1,
                            }).format(Number(instagramFollowers))
                          : Number(instagramFollowers).toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 1,
                              }
                            ) || "0"} FOLLOWERS
                      </CaptionBold>
                    </VStack>
                  </HStack>
                </a>

                <a href="mailto:support@xdsea.com">
                  <HStack
                    background="white"
                    border="6px"
                    height="52px"
                    padding="0 12px"
                    self="none"
                    cursor="pointer"
                  >
                    <IconImg
                      url={mailIcon}
                      width="30px"
                      height="30px"
                      cursor="pointer"
                    ></IconImg>
                    <VStack spacing="0px" alignment="3px" cursor="pointer">
                      <TitleRegular18 cursor="pointer">
                        support@xdsea.com
                      </TitleRegular18>
                    </VStack>
                  </HStack>
                </a>

                <Spacer></Spacer>
              </VStack>
            </HStack>

            {/* Copyright Information */}
            <HStack padding="0 30px">
              <HStack
                background={appStyle.colors.darkgrey30}
                padding="6px 6px"
                border="6px"
                height="42px"
                width="100%"
              >
                <BodyRegular textcolor="white" align="center">
                  Copyright © 2022 XDSea All Rights Reserved
                </BodyRegular>
              </HStack>
            </HStack>
          </VStack>
        </LayoutGroup>
      </FooterContent>
    </FooterSection>
  );
}

export { Footer };

const FooterSection = styled(motion.div)`
  padding: 150px 0 90px 0;
  width: 100%;

  background-image: url(${footerBanner});
  background-size: ${(props) => props.size};
  background-repeat: no-repeat;
`;

const FooterContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;
