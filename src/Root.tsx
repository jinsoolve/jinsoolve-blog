import { ChakraProvider, extendTheme, useColorMode, ColorModeScript } from "@chakra-ui/react";
import React, { useEffect } from "react";
import theme from "./chakra/theme";
import MousePointerContainer from "./components/MousePointer";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  const SetSystemColorMode = () => {
    const { setColorMode } = useColorMode();

    useEffect(() => {
      if (typeof window !== "undefined") {
        const defaultColorMode = localStorage.getItem("chakra-ui-color-mode-default");
        if (defaultColorMode !== "set") {
          const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          setColorMode(systemColorMode); // Chakra UI에게 테마 변경 전달
        }
      }
    }, []);
    return null;
  };

  return (
    <>
      {/* Chakra UI의 초기 ColorModeScript */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <SetSystemColorMode /> {/* 시스템 컬러 모드 설정 */}
        <MousePointerContainer />
        {children}
      </ChakraProvider>
    </>
  );
};


export default Root;
