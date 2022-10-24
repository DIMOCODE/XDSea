import { VStack, HStack, Spacer, IconImg } from "./styles/Stacks";
import styled from "styled-components";
import { motion } from "framer-motion/dist/framer-motion";
import { BodyRegular, TitleBold18, TitleBold27 } from "./styles/TextStyles";
import backBar from "./images/newBlue.png";
import { appStyle } from "./styles/AppStyles";
import Step1 from "./images/Step1v2.png";
import Step2 from "./images/Step2v2.png";
import Step3 from "./images/Step3v2.png";
import Step4 from "./images/Step4v2.png";
import useWindowSize from "./styles/useWindowSize";
import { useEffect } from "react";

function HowToStart() {
  const size = useWindowSize();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <HowToSection>
      <HStack backgroundimage={backBar}>
        <HStack width="1200px" height="258px" padding="90px 0 0 0 ">
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
          {/* Step 1 */}
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "auto"}
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
                  <BodyRegular>
                    • Click on Connect by clicking the <br></br>wallet icon in
                    the top right corner
                  </BodyRegular>
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

          {/* Step2 */}
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "auto"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
            padding="21px 0"
          >
            <VStack width="100%">
              <VStack
                width="60%"
                height={size.width < 768 ? "390" : "auto"}
                spacing="21px"
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

                  <TitleBold18>Create an NFT</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Let’s get creative
                  </TitleBold18>
                </VStack>

                <VStack alignment="flex-start" width="100%">
                  <BodyRegular>• Click on Create an NFT</BodyRegular>
                  <BodyRegular>
                    • Set up your collection by adding <br></br>the name,
                    description, a collection <br></br>banner, and a logo
                  </BodyRegular>
                  <BodyRegular>
                    • Don't forget to add your <br></br>social links!
                  </BodyRegular>
                </VStack>
              </VStack>
            </VStack>

            <VStack width="100%">
              <IconImg url={Step2} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>

          {/* Step3 */}

          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "auto"}
            background={({ theme }) => theme.backElement}
            responsive={true}
            border="15px"
            padding="21px 0"
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
                  <TitleBold18>Add your NFTs</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Time to show off
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%" maxheight="190px">
                  <BodyRegular>• Upload your digital asset</BodyRegular>
                  <BodyRegular>• Add titles and descriptions</BodyRegular>
                  <BodyRegular>
                    • Customize your NFTs with properties, <br></br>set your
                    custom secondary market <br></br>fees, and add unlockable
                    content
                  </BodyRegular>
                  <Spacer></Spacer>
                </VStack>
              </VStack>
            </VStack>
            <VStack width="100%">
              <IconImg url={Step3} width="390px" height="390px"></IconImg>
            </VStack>
          </HStack>

          {/* Step 4 */}
          <HStack
            spacing="0px"
            height={size.width < 768 ? "auto" : "auto"}
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
                  <TitleBold18>List them for Sale</TitleBold18>
                  <TitleBold18 textcolor={({ theme }) => theme.blue}>
                    Let’s make some money and change the world
                  </TitleBold18>
                </VStack>
                <VStack alignment="flex-start" width="100%">
                  <BodyRegular>• Set your custom price</BodyRegular>
                  <BodyRegular>• Click on mint your NFT</BodyRegular>
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
  padding: 0px 0;
  width: 100%;
`;

const ContentHowTo = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;
