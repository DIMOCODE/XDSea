import { 
  IconImg, 
  VStack 
} from "../../styles/Stacks";
import userIcon from "../../images/userIcon.png";
import styled from "styled-components";
import { 
  LayoutGroup, 
  motion 
} from "framer-motion/dist/framer-motion";
import { 
  LS, 
  LS_ROOT_KEY 
} from "../../constant";

/**
 * User Profile button shown on the Top Bar
 * 
 * @param {*} props 
 * @returns User Menu Button Component
 */
function UserMenuButton(props) {
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
          onClick={props?.handleChange}
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
