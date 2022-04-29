import styled from "styled-components";
import { appStyle } from "./AppStyles";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

// export const TitleBold60 = styled.h1`
//   font-style: normal;
//   font-weight: 600;
//   font-size: 66px;
//   line-height: 100%;
//   letter-spacing: -0.06em;
//   color: #ffffff;
// `;

export const TitleBold60 = styled(motion.h1).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: 600;
  font-size: 66px;
  line-height: 100%;
  letter-spacing: -0.06em;
  color: ${(props) => props.textcolor};
`;

export const TitleBold54 = styled(motion.h1).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "left",
}))`
  font-style: normal;
  font-weight: 600;
  font-size: 54px;
  line-height: 100%;
  letter-spacing: -0.06em;
  color: ${(props) => props.textcolor};
  text-align: ${(props) => props.align};
`;

export const TitleBold30 = styled(motion.h1).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 30px;
  color: ${(props) => props.textcolor};
`;

export const TitleBold33 = styled(motion.h1).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 33px;
  line-height: 33px;
  color: ${(props) => props.textcolor};
`;

export const TitleRegular33 = styled(motion.h1).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: 400;
  font-size: 33px;
  line-height: 33px;
  color: ${(props) => props.textcolor};
`;

export const TitleBold27 = styled(motion.h2).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 27px;
  letter-spacing: -0.03em;
  line-height: 33px;
  color: ${(props) => props.textcolor};
`;

export const TitleBold21 = styled(motion.h2).attrs((props) => ({
  textcolor: props.textcolor || appStyle.colors.white,
  display: props.display,
  clamp: props.clamp,
  orient: props.orient,
  overflow: props.overflow,
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  color: ${(props) => props.textcolor};
  display: ${(props) => props.display};
  -webkit-line-clamp: ${(props) => props.clamp};
  -webkit-box-orient: ${(props) => props.orient};
  overflow: ${(props) => props.overflow};
`;

export const TitleBold18 = styled(motion.h3).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: bold;
  letter-spacing: -0.04em;
  font-size: 18px;
  color: ${(props) => props.textcolor};
`;

export const TitleRegular18 = styled(motion.h3).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  width: props.width || "auto",
  align: props.align || "left",
}))`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.04em;
  line-height: 30px;
  text-align: ${(props) => props.align};
  width: ${(props) => props.width};
  color: ${(props) => props.textcolor};
`;

export const TitleBold15 = styled(motion.h3).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  width: props.width || "auto",
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  width: ${(props) => props.width};
  letter-spacing: -0.01em;
  color: ${(props) => props.textcolor};
`;

export const TitleSemiBold15 = styled(motion.h3).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
}))`
  font-style: normal;
  font-weight: semibold;
  font-size: 15px;

  letter-spacing: -0.04em;
  color: ${(props) => props.textcolor};
`;

export const BodyBold = styled(motion.p).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  marginBottom: props.marginBottom || "0px",
}))`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: -0.01em;
  text-align: ${(props) => props.align};
  color: ${(props) => props.textcolor};
  margin-bottom: ${(props) => props.marginBottom};
`;

export const BodyRegular = styled(motion.p).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  padding: props.padding || "0px",
  marginTop: props.marginTop || "0px",
  marginBottom: props.marginBottom || "0px",
  display: props.display,
  clamp: props.clamp,
  orient: props.orient,
  overflow: props.overflow,
}))`
  text-align: ${(props) => props.align};
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  letter-spacing: -0.01em;
  line-height: 21px;
  padding: ${(props) => props.padding};
  color: ${(props) => props.textcolor};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  display: ${(props) => props.display};
  -webkit-line-clamp: ${(props) => props.clamp};
  -webkit-box-orient: ${(props) => props.orient};
  overflow: ${(props) => props.overflow};
`;

export const CaptionBold = styled(motion.p).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  padding: props.padding || "0px",
  marginBottom: props.marginBottom || "0px",
}))`
  text-align: ${(props) => props.align};
  font-weight: 800;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.12em;
  padding: ${(props) => props.padding};
  color: ${(props) => props.textcolor};
  margin-bottom: ${(props) => props.marginBottom};
`;

export const CaptionBoldShort = styled(motion.p).attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  padding: props.padding || "0px",
}))`
  text-align: ${(props) => props.align};
  font-weight: 800;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.01em;
  padding: ${(props) => props.padding};
  color: ${(props) => props.textcolor};
`;

export const CaptionRegular = styled.p.attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  padding: props.padding || "0px",
  marginTop: props.marginTop || "0px",
}))`
  text-align: ${(props) => props.align};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.01em;
  padding: ${(props) => props.padding};
  color: ${(props) => props.textcolor};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: 2px;
`;

export const CaptionCrypto = styled.p.attrs((props) => ({
  textcolor: props.textcolor || props.theme.text,
  align: props.align || "Left",
  padding: props.padding || "0px",
}))`
  text-align: ${(props) => props.align};
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.01em;
  padding: ${(props) => props.padding};
  color: ${(props) => props.textcolor};
`;