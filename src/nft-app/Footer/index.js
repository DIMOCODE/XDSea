import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import XuppiWhite from "../../images/logoXuppiWhite.png";
import twitter from "../../images/twitterLogoWhite.png";
import instagram from "../../images/InstagramLogoWhite.png";
import mail from "../../images/mailWhite.png";
import { BodyRegular, TitleBold21, TitleBold27 } from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Link } from "../../styles/Link";
import useWindowSize from "../../styles/useWindowSize";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

function Footer(props) {
  const size = useWindowSize();
  const history = useHistory();

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

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
              <VStack
                alignment="flex-start"
                spacing="6px"
                onClick={() => NavigateTo("")}
              >
                <IconImg
                  url={XuppiWhite}
                  width={size.width < 768 ? "60px" : "90px"}
                  height={size.width < 768 ? "60px" : "90px"}
                  cursor={"pointer"}
                ></IconImg>
                <TitleBold27 textcolor={appStyle.colors.white}>
                  Xuppi
                </TitleBold27>
                <BodyRegular textcolor={appStyle.colors.white}>
                  NFT Marketplace
                </BodyRegular>
                <Spacer></Spacer>
              </VStack>
              <VStack alignment="flex-start">
                <TitleBold21 textcolor={appStyle.colors.white}>
                  Marketplace
                </TitleBold21>
                <LayoutGroup id="MarketPlaceLink">
                  <Link cursor={"pointer"} text="Home"></Link>
                  <Link cursor={"pointer"} text="Discover"></Link>
                  <Link cursor={"pointer"} text="How To Start"></Link>
                  {/* <Link text="Terms of Service"></Link>
                <Link text="Build on Xinfin"></Link> */}
                </LayoutGroup>
                <Spacer></Spacer>
              </VStack>
              <VStack alignment="flex-start">
                <TitleBold21 textcolor={appStyle.colors.white}>
                  Account
                </TitleBold21>
                {/* <Link text="Sync XDCPay"></Link> */}
                <Link text="Create NFT"></Link>
                {/* <Link text="User Profile"></Link> */}
                {/* <Link text="Collections"></Link> */}
                <Spacer></Spacer>
              </VStack>
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
                  {/* <IconImg url={discord} width="52px" height="52px"></IconImg> */}
                </HStack>
                <Spacer></Spacer>
              </VStack>
            </HStack>
            <VStack
              background={appStyle.colors.darkgrey30}
              padding="6px 6px"
              border="6px"
            >
              <BodyRegular textcolor="white" align="center">
                Powered by XDSea Copyright © 2022 Razrcorp Group Limited All Rights Reserved
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
  background: #20222d;
`;

const FooterContent = styled(motion.div)`
  max-width: 1200px;

  margin: 0 auto;
`;
