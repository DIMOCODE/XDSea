import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  HStack,
  IconImg,
  VStack,
  ZItem,
  ZStack,
  Spacer,
} from "../../styles/Stacks";
import {
  BodyBold,
  BodyRegular,
  TitleBold30,
  TitleBold33,
} from "../../styles/TextStyles";
import blogImage from "../../images/mountain.jpg";
import { CreatorAndShare } from "./CreatorAndShare";
import { BlogList } from "./BlogList";
import { TopPage } from "./TopPage";
import blue from "../../images/newBlue.jpg";
import { BlogContent } from "./BlogContent";
import useWindowSize from "../../styles/useWindowSize";
import { MobileMenu } from "../../styles/Buttons/MobileMenu";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import useScrollBlock from "./useScrollBlock";
import menuIcon from "../../images/menuIcon.png";
import closeIcon from "../../images/crossWhite.png";

function Blog() {
  const [blockScroll, allowScroll] = useScrollBlock();
  const [showOptions, setShowOptions] = useState(false);

  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, []);

  console.log(height);

  const size = useWindowSize();
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const listenToScroll = () => {
    let heightToHideFrom = 1600;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      isVisible && // to limit setting state only the first time
        setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const variants = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 100 },
  };

  return (
    <>
      <HStack width="100vw" height="auto" padding="0px 0 60px 0">
        <VStack width="100%">
          {/* Page Title */}

          <TopPage background={blue} title="Blog"></TopPage>

          <VStack maxwidth="1200px">
            <HStack
              width="100%"
              background={({ theme }) => theme.backElement}
              border="6px"
              spacing="0"
              ref={ref}
            >
              <BlogContent
                padding={size.width < 440 ? "30px 21px" : "42px"}
                title="The Story of the DAO — Its History and Evolution"
                image={blogImage}
                date={"22 Nov 22"}
                content="One of the most incredible concepts to be successfully
                implemented through blockchain technology is the DAO, a
                decentralized autonomous organization. Decentralized autonomous
                organizations are entities that operate through smart contracts.
                Its financial transactions and rules are encoded on a
                blockchain, effectively removing the need for a central
                governing authority — hence the descriptors “decentralized” and
                “autonomous.” 
                The Decentralized Autonomous Organization (known as The DAO) was
                meant to operate like a venture capital fund for the crypto and
                decentralized space. The lack of a centralized authority reduced
                costs and in theory provides more control and access to the
                investors.
                <br></br>
                <br></br> At the beginning of May 2016, a few members of the
                Ethereum community announced the inception of The DAO, which was
                also known as Genesis DAO.It was built as a smart contract on
                the Ethereum blockchain. The coding framework was developed open
                source by the Slock.It team but it was deployed under “The DAO”
                name by members of the Ethereum community. The DAO had a
                creation period during which anyone was allowed to send Ether to
                a unique wallet address in exchange for DAO tokens on a 1–100
                scale. The creation period was an unexpected success as it
                managed to gather 12.7M Ether (worth around $150M at the time),
                making it the biggest crowdfund ever. At some point, when Ether
                was trading at $20, the total Ether from The DAO was worth over
                $250 million.
                <br></br>
                <br></br> In essence, the platform would allow anyone with a
                project to pitch their idea to the community and potentially
                receive funding from The DAO. Anyone with DAO tokens could vote
                on plans, and would then receive rewards if the projects turned
                a profit. With the financing in place, things were looking up.
                <br></br>
                <br></br>
                However, on June 17, 2016, a hacker found a loophole in the
                coding that allowed him to drain funds from The DAO. In the
                first few hours of the attack, 3.6 million ETH were stolen, the
                equivalent of $70 million at the time. Once the hacker had done
                the damage he intended, he withdrew the attack.<br></br>
                <br></br> In this exploit, the attacker was able to “ask” the
                smart contract (DAO) to give the Ether back multiple times
                before the smart contract could update its balance. Two main
                issues made this possible: the fact that when the DAO smart
                contract was created the coders did not take into account the
                possibility of a recursive call and the fact that the smart
                contract first sent the ETH funds and then updated the internal
                token balance. <br></br>    <br></br>
                It’s important to understand that this bug did not come from
                Ethereum itself, but from this one application that was built on
                Ethereum. The code written for The DAO had multiple flaws, and
                the recursive call exploit was one of them. Another way to look
                at this situation is to compare Ethereum to the Internet and any
                application based on Ethereum to a website — If a site is not
                working, it doesn’t mean that the Internet is not working, it
                merely says that one website has a problem. The hacker stopped
                draining The DAO for unknown reasons, even though he could have
                continued to do so. The Ethereum community and team quickly took
                control of the situation and presented multiple proposals to
                deal with the exploit. However, the funds were placed into an
                account subject to a 28 day holding period so the hacker
                couldn’t complete his getaway.<br></br>
                <br></br> To refund the lost money, Ethereum hard forked to send
                the hacked funds to an account available to the original owners.
                The token owners were given an exchange rate of 1 ETH to 100 DAO
                tokens, the same rate as the initial offering."
              ></BlogContent>

              <HStack
                width="1px"
                background={({ theme }) => theme.faded30}
              ></HStack>

              {size.width > 440 ? (
                <HStack width="33%" alignment="flex-start">
                  <Sticky>
                    <BlogList></BlogList>
                  </Sticky>
                </HStack>
              ) : null}
            </HStack>
          </VStack>
        </VStack>
      </HStack>

      {size.width > 440 ? null : (
        <AnimatePresence>
          {isVisible && (
            <MenuOptions
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showOptions && (
                <VStack
                  background={({ theme }) => theme.faded60}
                  height="100vh"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Spacer></Spacer>

                  <BlogList
                    variants={item}
                    transition={{ type: "spring", duration: 0.5 }}
                  ></BlogList>
                </VStack>
              )}

              <MobileMenu
                icon={showOptions ? closeIcon : menuIcon}
                name={showOptions ? "Close Menu" : " Blog Menu"}
                position={showOptions ? 15 : 15}
                onClick={() => {
                  setShowOptions(!showOptions);
                  // blockScroll();
                }}
              ></MobileMenu>
            </MenuOptions>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export { Blog };

const MenuOptions = styled(motion.div)`
  width: 100vw;
  position: fixed;
  height: auto;

  bottom: 0px;
`;

const Sticky = styled(motion.div)`
  width: 100%;
  position: sticky;
  top: 60px;
`;
