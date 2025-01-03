import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";

import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";

type ThemeModeTogglerProps = Omit<IconButtonProps, "aria-label">;

const ThemeToggler: React.FC<ThemeModeTogglerProps> = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  const handleToggle = () => {
    toggleColorMode();
    // localStorage에 값 설정
    localStorage.setItem("chakra-ui-color-mode-default", "set");
  };

  return (
    <IconButton
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontSize="2xl"
      borderRadius="3xl"
      variant="unstyled"
      onClick={handleToggle} // 수정된 핸들러
      icon={<SwitchIcon />}
      _hover={{
        bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200",
      }}
      _active={{ bg: "transparent" }}
      aria-label="darkmode toggle button"
    />
  );
};

export default ThemeToggler;