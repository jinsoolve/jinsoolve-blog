import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import components from "./components";
import global from "./global";
import semanticTokens from "./semanticTokens";

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // 초기 색상 모드: 다크 모드
    useSystemColorMode: true, // 시스템 색상 모드 사용 여부: 비활성화
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
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  },
  components,
});

export default theme;