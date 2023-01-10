import React from "react";
import { HStack } from "../../styles/Stacks";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";

function ContentSteps(props) {
  const { step } = props;

  switch (step) {
    case "step1":
      return <Step1></Step1>;
    case "step2":
      return <Step2></Step2>;
    case "step3":
      return <div>Option 3 selected</div>;
    case "step4":
      return <div>Option 3 selected</div>;
    case "step5":
      return <div>Option 3 selected</div>;
    case "publishing":
      return <div>Option 3 selected</div>;
    case "admin":
      return <div>Option 3 selected</div>;
    default:
      return <div>No option selected</div>;
  }
}

export { ContentSteps };
