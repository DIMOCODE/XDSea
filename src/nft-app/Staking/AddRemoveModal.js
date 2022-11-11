import React from "react";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import { HStack, VStack, IconImg, Separator } from "../../styles/Stacks";
import {
  BodyRegular,
  TitleBold15,
  TitleBold18,
  TitleBold21,
} from "../../styles/TextStyles";
import { EarningRate } from "./EarningRate";
import { PendingClaimed } from "./PendingClaimed";
import styled from "styled-components";
import jojo from "../../images/exampleJojo.png";
import useWindowSize from "../../styles/useWindowSize";
import { InputStyled } from "../../styles/InputStyled";
import { useState } from "react";
import { useEffect } from "react";
import { getNFT } from "../../API/NFT";
import { useClickAway } from "react-use";
import { useRef } from "react";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { LoopLogo } from "../../styles/LoopLogo";

function AddRemoveModal(props) {
  const size = useWindowSize();

  const { oneToken, setAddRemoveModal, nftContract, collectionId } = props;

  const [tokenId, setTokenId] = useState(0);
  const [showNFTInfo, setNFTInfo] = useState(false);
  const [nft, setNft] = useState({});
  const [showNFTError, setNFTError] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setAddRemoveModal(false));

  useEffect(() => {
    setNFTInfo(false);
    setNFTError(false);
    const delayDebounceFn = setTimeout(async () => {
      if (tokenId !== 0) {
        try {
          const nftData = await (await getNFT(nftContract, tokenId)).data;
          if (nftData?.nft?.collectionId?._id === collectionId) {
            setNft(nftData.nft);
            setNFTInfo(true);
          } else {
            setNFTError(true);
          }
        } catch (e) {
          setNFTError(true);
        }
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [tokenId]);

  return (
    <Modal>
      <HStack height="100%" padding="15px">
        <VStack
          padding="30px"
          maxwidth="600px"
          height="auto"
          background={({ theme }) => theme.backElement}
          border="6px"
          ref={ref}
        >
          <VStack>
            <TitleBold18>Add / Remove NFT</TitleBold18>
            <BodyRegular> Enter the token ID of the NFT to edit:</BodyRegular>
          </VStack>
          <InputStyled
            propertyKey={"edit-token-eligibility"}
            type="number"
            input={tokenId}
            onChange={(event) => {
              setTokenId(event.target.value);
            }}
            textplace={"rgba(0,0,0,0.6)"}
            padding={"0 12px 0 12px"}
            height="62px"
            background={({ theme }) => theme.faded}
            width="100%"
          ></InputStyled>
          {showNFTInfo ? (
            <>
              <HStack responsive={true}>
                <VStack justify="flex-end" width="100%">
                  <IconImg
                    url={nft?.urlFile.thumbnail}
                    width={size.width > 423 ? "260px" : "90px"}
                    height={size.width > 423 ? "260px" : "90px"}
                    border="9px"
                  ></IconImg>
                </VStack>

                <VStack width="100%" spacing="6px">
                  <TitleBold18 textcolor="black">{nft?.name}</TitleBold18>
                  <EarningRate onlyOneToken={oneToken}></EarningRate>
                  <PendingClaimed onlyOneToken={oneToken}></PendingClaimed>
                </VStack>
              </HStack>

              <Separator></Separator>

              <HStack>
                <ButtonM
                  background={({ theme }) => theme.faded30}
                  title="Cancel"
                  onClick={() => setAddRemoveModal(false)}
                ></ButtonM>
                <ButtonM
                  title={nft?.isStakeable ? "Remove from pool" : "Add to pool"}
                  textcolor="white"
                  background={({ theme }) => theme.blue}
                  onClick={() => {
                    //Update eligibility of the token
                  }}
                ></ButtonM>
              </HStack>
            </>
          ) : (
            <HStack initial={{ scale: 0.9 }} padding="30px 0 0 0">
              <LoopLogo></LoopLogo>
            </HStack>
          )}
          {showNFTError && (
            <HStack
              background={({ theme }) => theme.error}
              padding="12px"
              border="6px"
            >
              <BodyRegular
                textcolor="black"
                initial={{ opacity: 0.6 }}
                align="center"
              >
                The token ID you entered is not a part of this collection and
                hence, cannot be added to the staking pool.
              </BodyRegular>
            </HStack>
          )}
        </VStack>
      </HStack>

      {/* <VStack
        responsive="true"
        background={({ theme }) => theme.backElement}
        border="6px"
        padding="30px 21px"
        self="none"
        height={size.width > 428 ? "auto" : "100vh"}
        width={size.width > 428 ? "50%" : "100vw"}
        spacing="21px"
        style={{ top: "25%", left: "25%" }}
      >
        <HStack>
          <TitleBold21 textcolor="black" style={{ "white-space": "nowrap" }}>
            Enter the token ID of the NFT to edit:
          </TitleBold21>
        </HStack>
        <InputStyled
          propertyKey={"edit-token-eligibility"}
          type="number"
          input={tokenId}
          onChange={(event) => {
            setTokenId(event.target.value);
          }}
          textplace={"rgba(0,0,0,0.6)"}
          padding={"0 12px 0 12px"}
          height="62px"
          background={({ theme }) => theme.faded}
          width="100%"
        ></InputStyled>
        {showNFTInfo && (
          <>
            <HStack>
              <VStack justify="flex-end">
                <IconImg
                  url={nft?.urlFile.thumbnail}
                  width={size.width > 423 ? "360px" : "260px"}
                  height={size.width > 423 ? "360px" : "260px"}
                  border="9px"
                ></IconImg>
              </VStack>

              <VStack width="370px" spacing="21px">
                <TitleBold21 textcolor="black">{nft?.name}</TitleBold21>
                <EarningRate onlyOneToken={oneToken}></EarningRate>
                <PendingClaimed onlyOneToken={oneToken}></PendingClaimed>
              </VStack>
            </HStack>
            <HStack>
              <ButtonM
                background={({ theme }) => theme.faded30}
                title="Cancel"
                onClick={() => setAddRemoveModal(false)}
              ></ButtonM>
              <ButtonM
                title={nft?.isStakeable ? "Remove from pool" : "Add to pool"}
                textcolor="white"
                background={({ theme }) => theme.blue}
                onClick={() => {
                  //Update eligibility of the token
                }}
              ></ButtonM>
            </HStack>
          </>
        )}
        {showNFTError && (
          <TitleBold15 textcolor="black">
            The token ID you entered is not a part of this collection and hence,
            cannot be added to the staking pool.
          </TitleBold15>
        )}
      </VStack> */}
    </Modal>
  );
}

export { AddRemoveModal };

const Modal = styled(motion.div)`
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;

  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;
