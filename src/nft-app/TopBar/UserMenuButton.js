// import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IconImg, VStack } from "../../styles/Stacks";
import userIcon from "../../images/userIcon.png";
import styled from "styled-components";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { isXdc, fromXdc } from "../../common/common";
import { LS, LS_ROOT_KEY } from "../../constant";

function UserMenuButton(props) {
  const {
    // clickOnUser,
    // clickOnSettings,
    // clickOnLogout,
    wallet,
  } = props;
  // const appear = {
  //   selected: { y: 0, opacity: 1 },
  //   normal: { y: 0, opacity: 0 },
  // };
  // const scale = {
  //   selected: { scale: 1 },
  //   normal: { scale: 1 },
  // };

  return (
    <LayoutGroup id="usermenu">
      <UserMenu>
        <VStack
          background={({ theme }) => theme.backElement}
          minwidth="39px"
          maxwidth="39px"
          height="39px"
          border="27px"
          bordercolor="#99A2AF"
          bordersize="3px"
          whileTap={{ scale: 0.9 }}
          onClick={async () => {
            const userId = await LS.get(LS_ROOT_KEY).user._id;
            props.redirect(`UserProfile/${userId}`);
          }}
          cursor={"pointer"}
          exit="normal"
        >
          <IconImg
            cursor={"pointer"}
            url={userIcon}
            width="21px"
            height="21px"
          ></IconImg>
        </VStack>
      </UserMenu>
    </LayoutGroup>
  );
}

export { UserMenuButton };

const UserMenu = styled(motion.div)`
  position: relative;
`;
