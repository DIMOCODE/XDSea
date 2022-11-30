import React from "react";
import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { BodyBold, BodyRegular } from "./TextStyles";
import { HStack, IconImg } from "./Stacks";
import { RingSpinner } from "react-spinners-kit";
import successIcon from "../images/successIcon.png";
import failIcon from "../images/cancelIcon.png";

export default function ButtonApp(props) {
  const {
    text,
    onClick,
    background,
    padding,
    width,
    textcolor,
    height,
    border,
    icon,
    iconWidth,
    iconHeight,
    cursor,
    buttonId,
    btnStatus,
    hasImage,
    func,
  } = props;

  return (
    <ButtonView
      onClick={btnStatus === 0 ? onClick : null}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.96 }}
      width={width}
      height={height}
      background={background}
      padding={padding}
      textcolor={textcolor}
      border={border}
      transition={{ ease: "easeOut", duration: 0.2 }}
      cursor={cursor}
      id={buttonId}
    >
      {btnStatus === 1 ? (
        func === "Mint" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>Minting</BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "Buy" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>Buying</BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "Offer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Placing Offer
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "Withdraw" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawing Listing
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "Edit" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Editing Listing
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "List" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Listing NFT
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "Transfer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Transferring
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "WithdrawOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawing Offer
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "AcceptOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Accepting Offer
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : func === "WithdrawStake" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawing Stake
            </BodyRegular>
            <RingSpinner
              size={21}
              color={appStyle.colors.white}
              loading={true}
            />
          </HStack>
        ) : null
      ) : btnStatus === 2 ? (
        <HStack spacing="6px">
          <BodyRegular textcolor={appStyle.colors.white}>
            Updating Ledger
          </BodyRegular>
          <RingSpinner size={21} color={appStyle.colors.white} loading={true} />
        </HStack>
      ) : btnStatus === 3 ? (
        func === "Mint" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>Minted</BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Buy" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>Bought</BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Offer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Offer Placed
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Withdraw" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Listing Withdrawn
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Edit" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Listing Edited
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "List" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              NFT Listed
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Transfer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              NFT Transferred
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "WithdrawOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Offer Withdrawn
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "AcceptOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Offer Accepted
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "WithdrawStake" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Stake Withdrawn
            </BodyRegular>
            <IconImg url={successIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : null
      ) : btnStatus === 4 ? (
        func === "Mint" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Mint Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Buy" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Buying Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Offer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Offer Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Withdraw" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawal Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Edit" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Editing Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "List" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Listing Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "Transfer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Transfer Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "WithdrawOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawal Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "AcceptOffer" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Acceptance Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : func === "WithdrawStake" ? (
          <HStack spacing="6px">
            <BodyRegular textcolor={appStyle.colors.white}>
              Withdrawal Failed
            </BodyRegular>
            <IconImg url={failIcon} width="21px" height="21px"></IconImg>
          </HStack>
        ) : null
      ) : (
        <>
          {hasImage ? (
            <IconImg url={icon} width={iconWidth} height={iconHeight}></IconImg>
          ) : (
            <BodyBold
              cursor={btnStatus === -1 ? "default" : "pointer"}
              textcolor={textcolor}
            >
              {text}
            </BodyBold>
          )}
        </>
      )}
    </ButtonView>
  );
}

const ButtonView = styled(motion.div).attrs((props) => ({
  background: props.background || appStyle.colors.blue,
  padding: props.padding || "0px 21px 0 21px",
  width: props.width || "auto",
  height: props.height || "52px",
  textcolor: props.textcolor || appStyle.colors.white,
  border: props.border || "6px",
  cursor: props.cursor || "default",
}))`
  display: flex;
  flex-direction: row;
  font-weight: 500;
  gap: 6px;
  align-items: center;
  color: ${(props) => props.textcolor};
  border-radius: ${(props) => props.border};
  padding: ${(props) => props.padding};
  background: ${(props) => props.background};
  min-height: ${(props) => props.height};
  justify-content: center;
  width: ${(props) => props.width};
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
    supported by Chrome, Edge, Opera and Firefox */
  cursor: ${(props) => props.cursor};
`;
