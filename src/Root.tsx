import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect } from "react";
import theme from "./chakra/theme";
import MousePointerContainer from "./components/MousePointer";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  //     const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
  //
  //     // If no color mode is stored, use the system color mode
  //     if (!storedColorMode) {
  //       localStorage.setItem("chakra-ui-color-mode", systemColorMode);
  //     }
  //   }
  // }, []);

  return (
    <ChakraProvider theme={theme}>
      <MousePointerContainer />
      {children}
    </ChakraProvider>
  );
};

export default Root;
