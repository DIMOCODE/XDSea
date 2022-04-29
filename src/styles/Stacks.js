import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { motion } from "framer-motion/dist/framer-motion";

// Spacer pushes the elements
export const Spacer = styled.div`
  flex: 1;
`;
// VStack organize elements in vertical
export const VStack = styled(motion.div).attrs((props) => ({
  background: props.background || "rgba(255, 255, 255, 0)",
  alignment: props.alignment || "center",
  content: props.content || "center",
  spacing: props.spacing || "15px",
  padding: props.padding || "0",
  maxwidth: props.maxwidth || "auto",
  minwidth: props.minwidth || "auto",
  maxheight: props.maxheight || "auto",
  minheight: props.minheight || "auto",
  width: props.width || "auto",
  height: props.height || "100%",
  overflow: props.overflow || "visible",
  border: props.border || "0",
  bordersize: props.bordersize || "0",
  bordercolor: props.bordercolor || "rgba(255, 255, 255, 0)",
  flexwrap: props.flexwrap || "nowrap",
  direction: props.direction || "column",
  responsive: props.responsive ?? false,
  justify: props.justify || "center",
  marginTop: props.marginTop || "0px",
}))`
  display: flex;
  flex: 1;
  flex-direction: ${(props) => props.direction};
  flex-wrap: ${(props) => props.flexwrap};
  align-items: ${(props) => props.alignment};
  align-content: ${(props) => props.content};
  justify-content: ${(props) => props.justify};
  height: ${(props) => props.height};
  max-height: ${(props) => props.maxheight};
  min-height: ${(props) => props.minheight};
  gap: ${(props) => props.spacing};
  background: ${(props) => props.background};
  padding: ${(props) => props.padding};
  max-width: ${(props) => props.maxwidth};
  min-width: ${(props) => props.minwidth};
  width: ${(props) => props.width};
  border-radius: ${(props) => props.border};
  overflow: ${(props) => props.overflow};
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-style: solid;
  border-color: ${(props) => props.bordercolor};
  border-width: ${(props) => props.bordersize};
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  @media (max-width: 768px) {
    flex-direction: ${(props) => (props.responsive ? "row" : "column")};
  }
  margin-top: ${(props) => (props.marginTop)};
`;

// HStack organize elements in Horizontal
export const HStack = styled(motion.div).attrs((props) => ({
  backgroundimage: props.backgroundimage || "rgba(255, 255, 255, 0)",
  background: props.background || "rgba(255, 255, 255, 0)",
  alignment: props.alignment || "center",
  spacing: props.spacing || "15px",
  height: props.height || "auto",
  width: props.width || "auto",
  minheight: props.minheight || "auto",
  self: props.self || "stretch",
  padding: props.padding || "0px",
  color: props.textcolor || appStyle.colors.darkgrey,
  border: props.border || "0",
  bordersize: props.bordersize || "0",
  bordercolor: props.bordercolor || "rgba(255, 255, 255, 0)",
  overflow: props.overflow || "visible",
  overflowx: props.overflowx || "visible",
  overflowy: props.overflowy || "visible",
  justify: props.justify || "center",
  responsive: props.responsive ?? false,
  flexwrap: props.flexwrap || "nowrap",
  cursor: props.cursor || "default"
}))`
  display: flex;
  flex-wrap: ${(props) => props.flexwrap};
  border-radius: ${(props) => props.border};
  align-self: ${(props) => props.self};
  align-items: ${(props) => props.alignment};
  justify-content: ${(props) => props.justify};
  gap: ${(props) => props.spacing};
  flex-direction: row;
  background: ${(props) => props.background};
  background-image: url(${(props) => props.backgroundimage});
  background-size: cover;
  height: ${(props) => props.height};
  min-height: ${(props) => props.minheight};
  width: ${(props) => props.width};
  padding: ${(props) => props.padding};
  color: ${(props) => props.color};
  overflow: ${(props) => props.overflow};
  border-style: solid;
  border-color: ${(props) => props.bordercolor};
  border-width: ${(props) => props.bordersize};
  cursor: ${(props) => props.cursor};

  overflow-x: ${(props) => props.overflowx};
  overflow-y: ${(props) => props.overflowy};

  @media (max-width: 768px) {
    flex-direction: ${(props) => (props.responsive ? "column" : "row")};
  }
`;

// ZStack organize elements with dept
export const ZStack = styled(motion.div).attrs((props) => ({
  background: props.background || "rgba(255, 255, 255, 0)",
  padding: props.padding || "0",
  height: props.height || "100%",
  overflow: props.overflow || "visible",
  border: props.border || "0",
}))`
  position: relative;
  display: grid;
  overflow: ${(props) => props.overflow};
  justify-items: strech;
  align-items: strech;
  width: 100%;
  height: 100%;
  background: ${(props) => props.background};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding}px;
  border-radius: ${(props) => props.border};
`;

// ZItem

export const ZItem = styled(motion.div).attrs((props) => ({
  zindex: props.zindex || "0",
  // heigth: props.height || "auto",
  // width: props.width || "auto",
}))`
  grid-area: 1 / 1 / 1 / 1;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.zindex};
`;

// Divider
export const Divider = styled.div`
  min-height: 1px;
  width: 100%;
  background: rgba(153, 162, 175, 0.36);
`;

// Icon Image
export const IconImg = styled(motion.div).attrs((props) => ({
  url: props.url,
  height: props.height || "auto",
  width: props.width || "auto",
  backsize: props.backsize || "contain",
  border: props.border || "0px",
  scale: props.scale || "1",
  bordersize: props.bordersize || "0",
  bordercolor: props.bordercolor || "rgba(255, 255, 255, 0)",
  cursor: props.cursor || "default",
}))`
  background-image: url(${(props) => props.url});
  background-size: ${(props) => props.backsize};
  scale: ${(props) => props.scale};
  background-repeat: no-repeat, repeat;
  background-position: 50% 50%;
  border-radius: ${(props) => props.border};
  min-height: ${(props) => props.height};
  min-width: ${(props) => props.width};
  border-style: solid;
  border-color: ${(props) => props.bordercolor};
  border-width: ${(props) => props.bordersize};
  cursor: ${(props) => props.cursor};
`;

// Example of Styled Component with attributes
export const StyledContainer = styled.section.attrs((props) => ({
  width: props.width || "500px",
  hasPadding: props.hasPadding || false,
  background: props.background || "red",
}))`
  --container-padding: 200px;
  background: ${(props) => props.background};
  width: ${(props) => props.width}; // Falls back to 100%
  padding: ${(props) =>
    (props.hasPadding && "var(--container-padding)") || "none"};
`;