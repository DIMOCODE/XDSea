import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import XDSeaWhite from "../../images/logoXDSEAWhite.png";
import twitter from "../../images/twitterLogoWhite.png";
import instagram from "../../images/InstagramLogoWhite.png";
import mail from "../../images/mailWhite.png";
import { BodyRegular, TitleBold21, TitleBold27 } from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Link } from "../../styles/Link";
import useWindowSize from "../../styles/useWindowSize";
import styled from "styled-components";

function Footer(props) {
  const size = useWindowSize();

  return (
    <FooterSection>
      <FooterContent>
        <LayoutGroup id="footer">
          <VStack>
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
                  url={XDSeaWhite}
                  width={size.width < 768 ? "60px" : "90px"}
                  height={size.width < 768 ? "60px" : "90px"}
                  cursor={"pointer"}
                ></IconImg>
                <TitleBold27 textcolor={appStyle.colors.white}>
                  XDSea
                </TitleBold27>
                <BodyRegular textcolor={appStyle.colors.white}>
                  NFT Marketplace
                </BodyRegular>
                <Spacer></Spacer>
              </VStack>

              {/* Marketplace Quick Links */}
              <VStack alignment="flex-start">
                <TitleBold21 textcolor={appStyle.colors.white}>
                  Marketplace
                </TitleBold21>
                <LayoutGroup id="MarketPlaceLink">
                  <Link cursor={"pointer"} text="Home"></Link>
                  <Link cursor={"pointer"} text="Discover"></Link>
                  <Link cursor={"pointer"} text="How To Start"></Link>
                </LayoutGroup>
                <Spacer></Spacer>
              </VStack>

              {/* Account Quick Links */}
              <VStack alignment="flex-start">
                <TitleBold21 textcolor={appStyle.colors.white}>
                  Account
                </TitleBold21>

                <Link text="Create NFT"></Link>

                <Spacer></Spacer>
              </VStack>

              {/* Social Links */}
              <VStack alignment="flex-start">
                <TitleBold21 textcolor={appStyle.colors.white}>
                  Social
                </TitleBold21>
                <HStack justify="flex-start">
                  <a href="https://www.instagram.com/xdsea.nft/">
                    <IconImg
                      url={instagram}
                      width="52px"
                      height="52px"
                      cursor="pointer"
                    ></IconImg>
                  </a>
                  <a href="https://twitter.com/XDSeaNFT">
                    <IconImg
                      url={twitter}
                      width="52px"
                      height="52px"
                      cursor="pointer"
                    ></IconImg>
                  </a>
                  <a href="mailto:support@xdsea.com">
                    <IconImg
                      url={mail}
                      width="52px"
                      height="52px"
                      cursor="pointer"
                    ></IconImg>
                  </a>
                </HStack>
                <Spacer></Spacer>
              </VStack>
            </HStack>

            {/* Copyright Information */}
            <VStack
              background={appStyle.colors.darkgrey30}
              padding="6px 6px"
              border="6px"
            >
              <BodyRegular textcolor="white" align="center">
                Copyright © 2022 XDSea All Rights Reserved
              </BodyRegular>
            </VStack>
          </VStack>
        </LayoutGroup>
      </FooterContent>
    </FooterSection>
  );
}

export { Footer };

const FooterSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: linear-gradient(180deg, #182c3d 0%, #0c1823 100%); ;
`;

const FooterContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;
