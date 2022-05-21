import { VStack, HStack, Spacer, IconImg } from "./styles/Stacks";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import {
  BodyRegular,
  TitleBold18,
  TitleBold27,
} from "./styles/TextStyles";
import backBar from "./images/DiscoverBar.png";
import { appStyle } from "./styles/AppStyles";
import Step1 from "./images/Step1v2.png";
import Step2 from "./images/Step2v2.png";
import Step3 from "./images/Step3v2.png";
import Step4 from "./images/Step4v2.png";
import useWindowSize from "./styles/useWindowSize";

function HowToStart() {
  const size = useWindowSize();
  
  return (
    <HowToSection>
      <HStack backgroundimage={backBar}>
        <HStack width="1200px" height="157px" padding="0px 30px">
          <VStack>
            <TitleBold27 textcolor={appStyle.colors.white}>
              Want to Get Started?
            </TitleBold27>
            <TitleBold18 textcolor={appStyle.colors.white}>
              Here is how you do it
            </TitleBold18>
          </VStack>
        </HStack>
      </HStack>
      <ContentHowTo>
        <VStack padding="30px 30px">
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "390px"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
          >
            <VStack width="100%">
              <VStack width="60%">
                <VStack alignment="flex-start" width="100%" maxheight="auto">
                  <Spacer></Spacer>
                  <VStack
                    background={({ theme }) => theme.blue}
                    width="30px"
                    maxheight="30px"
                    minheight="30px"
                    border="27px"
                  >
                    <BodyRegular textcolor={appStyle.colors.white}>
                      1
                    </BodyRegular>
                  </VStack>
                  <TitleBold18>Setup your Wallet</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Safety First
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%">
                  <BodyRegular>• Setup the wallet of your choice</BodyRegular>
                  <BodyRegular>• Click on Connect</BodyRegular>
                  <BodyRegular>
                    • You're now connected to the <br></br>XDSea NFT Marketplace
                  </BodyRegular>
                  <Spacer></Spacer>
                </VStack>
              </VStack>
            </VStack>
            <VStack width="100%">
              <IconImg url={Step1} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "390px"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
          >
            <VStack width="100%">
              <VStack
                width="60%"
                height={size.width < 768 ? "390px" : "auto"}
                spacing="30px"
              >
                <VStack alignment="flex-start" width="100%" maxheight="120px">
                  <VStack
                    background={({ theme }) => theme.blue}
                    width="30px"
                    maxheight="30px"
                    minheight="30px"
                    border="27px"
                  >
                    <BodyRegular textcolor={appStyle.colors.white}>
                      2
                    </BodyRegular>
                  </VStack>
                  <TitleBold18>Create your Collection</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Let’s get creative
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%" maxheight="120px">
                  <BodyRegular>
                    • Click on create and select Collection
                  </BodyRegular>
                  <BodyRegular>
                    • Add a collection name and description
                  </BodyRegular>
                  <BodyRegular>• Upload a Banner Image</BodyRegular>
                  <BodyRegular>
                    • Set your custom secondary market fees
                  </BodyRegular>
                </VStack>
              </VStack>
            </VStack>
            <VStack width="100%">
              <IconImg url={Step2} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "390px"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
          >
            <VStack width="100%">
              <VStack
                width="60%"
                height={size.width < 768 ? "390px" : "auto"}
                spacing="30px"
              >
                <VStack alignment="flex-start" width="100%" maxheight="120px">
                  <VStack
                    background={({ theme }) => theme.blue}
                    width="30px"
                    maxheight="30px"
                    minheight="30px"
                    border="27px"
                  >
                    <BodyRegular textcolor={appStyle.colors.white}>
                      3
                    </BodyRegular>
                  </VStack>
                  <TitleBold18>Add your NFT’s</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Time to show off
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%" maxheight="160px">
                  <BodyRegular>• Click on create and select NFT</BodyRegular>
                  <BodyRegular>
                    • Add your amazing artwork with description and title
                  </BodyRegular>
                  <BodyRegular>
                    • Create the properties that makes it rare
                  </BodyRegular>
                  <BodyRegular>
                    • Pick your collection name and upload your NFT artwork
                  </BodyRegular>
                  <Spacer></Spacer>
                </VStack>
              </VStack>
            </VStack>
            <VStack width="100%">
              <IconImg url={Step3} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "390px"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
          >
            <VStack width="100%">
              <VStack width="60%">
                <VStack alignment="flex-start" width="100%" maxheight="auto">
                  <Spacer></Spacer>
                  <VStack
                    background={({ theme }) => theme.blue}
                    width="30px"
                    maxheight="30px"
                    minheight="30px"
                    border="27px"
                  >
                    <BodyRegular textcolor={appStyle.colors.white}>
                      4
                    </BodyRegular>
                  </VStack>
                  <TitleBold18>List them to Sale</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Let’s make some money and change the world
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%">
                  <BodyRegular>• Set your custom price and mint it</BodyRegular>
                  <BodyRegular>• Wait for the magic to happen</BodyRegular>
                  <Spacer></Spacer>
                </VStack>
              </VStack>
            </VStack>
            <VStack width="100%">
              <IconImg url={Step4} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>
        </VStack>
      </ContentHowTo>
    </HowToSection>
  );
}

export { HowToStart };

const HowToSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentHowTo = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;
