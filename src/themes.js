import XDSeaLightLogo from "./images/xdsea_logo_light.svg";
import XDSeaDarklogo from "./images/xdsea_logo.svg";

{
  /* Light and Dark theme style attributes */
}

export const lightTheme = {
  body: "#FFF",
  text: "#363537",
  toggleBorder: "#FFF",
  blue: "#3256FF",
  logo: XDSeaLightLogo,
  background: "rgba(0, 0, 0, 0.0)",
  backElement: "#FFF",
  hover: "#E3E3E3",
  walletButton: "#20222D",
  walletText: "#FFF",

  faded: "rgba(0, 0, 0, 0.03)",
  faded30: "rgba(0, 0, 0, 0.1)",
  faded60: "rgba(0, 0, 0, 0.3)",
  topbar:
    "linear-gradient(180deg, rgba(21, 35, 51, 0.78) 0%, rgba(24, 33, 44, 0) 267.5%)",
  backgroundModal: "rgba(214, 214, 219, 0.84)",
  menu: "#5C6976",
  fadedlocked: "rgba(30, 32, 42, 0.9)",
  searchInput: "rgba(0,0,0,0.3)",
};

export const darkTheme = {
  body: "#363537",
  text: "#FAFAFA",
  blue: "#2E81FD",
  logo: XDSeaDarklogo,
  toggleBorder: "#6B8096",
  background: "#20222D",
  walletButton: "#FFF",
  walletText: "#20222D",
  backElement: "#292D41",
  hover: "#292D41",
  topbar: "rgba(0, 0, 0, 0.06)",
  faded: "rgba(255, 255, 255, 0.09)",
  faded30: "rgba(255, 255, 255, 0.3)",
  faded60: "rgba(255, 255, 255, 0.6)",

  backgroundModal: "rgba(18, 18, 18, 1)",
  menu: "white",
  fadedlocked: "rgba(41, 45, 65, 0.9)",
  searchInput: "rgba(0,0,0,0.8)",
};
