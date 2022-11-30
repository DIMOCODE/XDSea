import React from "react";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";
import { ButtonM } from "../../styles/Buttons/ButtonM";
import {
  HStack,
  VStack,
  IconImg,
  Separator,
  Spacer,
} from "../../styles/Stacks";
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
import { getNFT, getNFTs } from "../../API/NFT";
import { useClickAway } from "react-use";
import { useRef } from "react";
import xdc from "../../images/miniXdcLogo.png";
import { updateBackedValueByNFT } from "../../API/stake";
import { UpdateBackedValues } from "../../common";
import { stakingaddress } from "../../config";
import { fromXdc, isXdc } from "../../common/common";

function BackedValueModal(props) {
  const size = useWindowSize();

  const { setBackedValueModal, nftContract, collectionId, stakingPool, setNfts, setNftsCount, stakingParams, setStakingParams } = props;

  const [tokenId, setTokenId] = useState(0);
  const [showNFTInfo, setNFTInfo] = useState(false);
  const [nft, setNft] = useState({});
  const [showNFTError, setNFTError] = useState(false);
  const [newBackedValue, setNewBackedValue] = useState(0);
  const ref = useRef(null);

  const updateBackedValue = async () => {
    try{
      const success = await UpdateBackedValues(stakingaddress, isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address, tokenId, newBackedValue);
      if(success) {
        const updatedBackedValue = await updateBackedValueByNFT(nft?._id, stakingPool?._id, newBackedValue);
        const stakingNFTsData = await(await getNFTs({
          ...stakingParams,
          page: 1,
        })).data;
        setNfts(stakingNFTsData.nfts);
        setNftsCount(stakingNFTsData.nftsAmount);
        setStakingParams({
          ...stakingParams,
          page: 2,
        });
      }
    } catch (err) {
      console.log(err);
    }
    setBackedValueModal(false);
  }

  useClickAway(ref, () => setBackedValueModal(false));

  useEffect(() => {
    setNFTInfo(false);
    setNFTError(false);
    const delayDebounceFn = setTimeout(async () => {
      if (tokenId !== 0) {
        try {
          const nftData = await (await getNFT(nftContract, tokenId)).data;
          if (
            nftData?.nft?.collectionId?._id === collectionId &&
            nftData?.nft?.isStakeable
          ) {
            setNft(nftData.nft);
            setNewBackedValue(nftData.nft.backedValue);
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
            <TitleBold18>Edit Backed Value</TitleBold18>
            <BodyRegular>
              Enter the token ID of the NFT for which to update backed value:
            </BodyRegular>
          </VStack>

          <InputStyled
            propertyKey={"edit-token-backed-value"}
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
              <HStack responsive={true}>
                <VStack justify="flex-end" spacing="9px">
                  <IconImg
                    url={nft?.urlFile.thumbnail}
                    width={size.width > 423 ? "260px" : "90px"}
                    height={size.width > 423 ? "260px" : "90px"}
                    border="9px"
                  ></IconImg>
                </VStack>

                <VStack width="100%" spacing="15px">
                  <TitleBold18 textcolor="black">{nft?.name}</TitleBold18>
                  <VStack spacing="9px" width="100%">
                    <TitleBold15 textcolor={({ theme }) => theme.faded60}>
                      BACKED VALUE
                    </TitleBold15>
                    <HStack
                      spacing="6px"
                      background={({ theme }) => theme.faded}
                      height="52px"
                      border="6px"
                      width="100%"
                      padding="0 30px 0 15px"
                    >
                      <IconImg url={xdc} width="18px" height="18px"></IconImg>
                      <Spacer></Spacer>
                      <TitleBold18 textcolor="black">
                        {nft?.backedValue}
                      </TitleBold18>
                      <Spacer></Spacer>
                    </HStack>
                  </VStack>

                  <Separator></Separator>

                  <VStack spacing="9px" width="100%">
                    <TitleBold15 textcolor={({ theme }) => theme.faded60}>
                      ENTER NEW BACKED VALUE:
                    </TitleBold15>
                    <InputStyled
                      propertyKey={"edit-token-new-backed-value"}
                      type="number"
                      input={newBackedValue}
                      onChange={(event) => {
                        setNewBackedValue(event.target.value);
                      }}
                      textplace={"rgba(0,0,0,0.6)"}
                      padding={"0 12px 2px 32px"}
                      height="52px"
                      background={({ theme }) => theme.faded}
                      width="100%"
                      icon={xdc}
                      iconLeft={"15px"}
                      iconTop={"18px"}
                      textalign="center"
                      fontsize="18px"
                      weight="bold"
                    ></InputStyled>
                  </VStack>
                </VStack>
              </HStack>
              <HStack>
                <ButtonM
                  background={({ theme }) => theme.faded30}
                  title="Cancel"
                  onClick={() => setBackedValueModal(false)}
                ></ButtonM>
                <ButtonM
                  title={"Update"}
                  textcolor="white"
                  background={({ theme }) => theme.blue}
                  onClick={() => {
                    updateBackedValue();
                  }}
                ></ButtonM>
              </HStack>
            </>
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
                The token ID you entered is not a part of this staking pool and
                hence, cannot have the backed value updated.
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
        ref={ref}
      >
        <HStack>
          <TitleBold21 textcolor="black" style={{ "white-space": "nowrap" }}>
            Enter the token ID of the NFT for which to update backed value:
          </TitleBold21>
        </HStack>
        <InputStyled
          propertyKey={"edit-token-backed-value"}
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
                <TitleBold18 textcolor={({ theme }) => theme.faded60}>
                  BACKED VALUE
                </TitleBold18>
                <HStack spacing="6px">
                  <IconImg url={xdc} width="18px" height="18px"></IconImg>
                  <TitleBold18 textcolor="black">
                    {nft?.backedValue}
                  </TitleBold18>
                </HStack>
                <TitleBold18 textcolor={({ theme }) => theme.faded60}>
                  Enter new backed value:
                </TitleBold18>
                <InputStyled
                  propertyKey={"edit-token-new-backed-value"}
                  type="number"
                  input={newBackedValue}
                  onChange={(event) => {
                    setNewBackedValue(event.target.value);
                  }}
                  textplace={"rgba(0,0,0,0.6)"}
                  padding={"0 12px 2px 32px"}
                  height="40px"
                  background={({ theme }) => theme.faded}
                  width="100%"
                  icon={xdc}
                  iconLeft={"10px"}
                ></InputStyled>
              </VStack>
            </HStack>
            <HStack>
              <ButtonM
                background={({ theme }) => theme.faded30}
                title="Cancel"
                onClick={() => setBackedValueModal(false)}
              ></ButtonM>
              <ButtonM
                title={"Update"}
                textcolor="white"
                background={({ theme }) => theme.blue}
                onClick={() => {
                  //Update Backed Value
                }}
              ></ButtonM>
            </HStack>
          </>
        )}
        {showNFTError && (
          <TitleBold15 textcolor="black">
            The token ID you entered is not a part of this staking pool and
            hence, cannot have the backed value updated.
          </TitleBold15>
        )}
      </VStack> */}
    </Modal>
  );
}

export { BackedValueModal };

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
