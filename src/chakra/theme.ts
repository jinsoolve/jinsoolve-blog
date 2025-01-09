import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import components from "./components";
import global from "./global";
import semanticTokens from "./semanticTokens";

const defaultColorMode = typeof window !== "undefined" ? localStorage.getItem("chakra-ui-color-mode-default") : null;

const theme = extendTheme({
  config: {
    useSystemColorMode: defaultColorMode !== "set", // "set"이 아닐 경우 systemColorMode를 사용
  },
  styles: {
    global,
  },
  colors,
  semanticTokens: {
    colors: semanticTokens,
  },
  breakpoints: {
    sm: "320px",
    sm_md: "660px",
    md: "768px",
    md_lg: "850px",
    lg: "960px",
    lg_xl: "1000px",
    xl: "1200px",
    "1.5xl": "1350px",
    "1.75xl": "1525px",
    "2xl": "1536px",
    "4xl": "1800px",
  },
  components,
});

export default theme;