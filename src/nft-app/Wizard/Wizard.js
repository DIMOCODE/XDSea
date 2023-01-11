import { Icon } from "@mui/material";
import React, { useState } from "react";
import { HStack, IconImg, VStack } from "../../styles/Stacks";
import { ContentSteps } from "./ContentSteps";
import { ModalWizard } from "./ModalWizard";
import { SideSteps } from "./SideSteps";
import close from "../../images/closeIcon.svg";

function Wizard() {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <HStack height="auto" width="100%" padding="90px 12px 90px 12px">
      <HStack
        height="789px"
        background="white"
        overflowx="hidden"
        border="9px"
        width="1200px"
        style={{ boxShadow: " 0px 11px 42px 0px rgba(0, 0, 0, 0.28)" }}
      >
        <SideSteps isadmin={true} isAdminSteps={true}></SideSteps>

        <ContentSteps step="admin"></ContentSteps>

        <IconImg
          style={{ position: "absolute", top: "21px", right: "21px" }}
          url={close}
          width="21px"
          height="21px"
          onClick={handleModal}
          whileHover={{ scale: 0.96 }}
        ></IconImg>

        {showModal && <ModalWizard clickCancel={handleModal}></ModalWizard>}
      </HStack>
    </HStack>
  );
}

export { Wizard };
