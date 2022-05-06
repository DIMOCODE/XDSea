import { useState } from "react";
import { useHistory } from "react-router-dom";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import userIcon from "../../images/userIcon.png";
import styled from "styled-components";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { BodyBold } from "../../styles/TextStyles";

function UserMenuButton(props) {
  const { clickOnUser, clickOnSettings, clickOnLogout } = props;

  const appear = {
    selected: { y: 0, opacity: 1 },
    normal: { y: 6, opacity: 0 },
  };
  const scale = {
    selected: { scale: 1 },
    normal: { scale: 0.9 },
  };

  const history = useHistory();

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const [showMenu, setShowMenu] = useState(false);
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
          onClick={() => NavigateTo(`UserProfile/${1}`)}
          // onClick={() => setShowMenu((showMenu) => !showMenu)}
          variants={scale}
          key={2}
          initial="normal"
          // animate={showMenu ? "normal" : "selected"}
          layoutId={2}
          exit="normal"
        >
          <IconImg url={userIcon} width="21px" height="21px"></IconImg>
        </VStack>
        {/* <AnimatePresence>
          {showMenu && (
            <ItemsMenu>
              <VStack
                background={({ theme }) => theme.backElement}
                width="200px"
                border="9px"
                spacing="0px"
                variants={appear}
                key={1}
                initial="normal"
                animate={showMenu ? "selected" : "normal"}
                layoutId={1}
                layout="position"
                exit="normal"
              >
                <HStack height="51px" onClick={clickOnUser}>
                  <BodyBold>User Profile</BodyBold>
                </HStack>
                <HStack height="51px" onClick={clickOnSettings}>
                  <BodyBold>Settings</BodyBold>
                </HStack>
                <HStack height="51px" onClick={clickOnLogout}>
                  <BodyBold>Logout</BodyBold>
                </HStack>
              </VStack>
            </ItemsMenu>
          )}
        </AnimatePresence> */}
      </UserMenu>
    </LayoutGroup>
  );
}
export { UserMenuButton };

const UserMenu = styled(motion.div)`
  position: relative;
`;

const ItemsMenu = styled(motion.div)`
  position: absolute;
  bottom: -170px;
  left: -159px;

  filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.25));
`;
