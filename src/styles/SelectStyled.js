import React from "react";
import styled from "styled-components";
import { IconImg, ZStack } from "./Stacks";
import arrow from "../images/arrow.png";

function SelectStyled(props) {
  const { value, onChange } = props;
  return (
    <ZStack>
      <SelectInput value={value} onChange={onChange}>
        <option value="None">None</option>
        <option value="Collection 1">Collection 1</option>
        <option value="Collection 2">Collection 2</option>
      </SelectInput>
      <IconSelect>
        <IconImg url={arrow} width="18px" height="18px"></IconImg>
      </IconSelect>
    </ZStack>
  );
}
export { SelectStyled };

const SelectInput = styled.select`
width: 100%;
height: 39px;
border-radius: 9px;
padding: 0px 45px 0px 12px;
border-style: solid;
border-color: rgba(255, 255, 255, 0);

border-size: 0px
-moz-box-sizing: border-box; 
box-sizing: border-box;
font-style: normal;
font-weight: normal;
font-size: 15px;
letter-spacing: -0.01em;
-moz-appearance:none !important;
-webkit-appearance: none !important; 
appearance: none !important;

color:${({ theme }) => theme.text};
background:${({ theme }) => theme.backElement};


`;

const IconSelect = styled.div`
  position: absolute;
  top: 11px;
  right: 15px;
`;