import {
  Box,
  Spacer,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";

import ThemeToggler from "../theme-toggle/ThemeToggler";
import About from "./About";
import Logo from "./Logo";
import Portfolio from "./Portfolio";
import Tags from "./Tags";
import Categories from "./Categories";
import Search from "./Search";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 스크롤 시 헤더 상태 변경
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      display="flex"
      alignItems="center"
      width="100%"
      height="70px"
      paddingLeft={5}
      paddingRight={5}
      columnGap={4}
      zIndex="5"
      transition="box-shadow 0.3s ease"
      shadow={isSticky ? "sm" : "none"}
      backgroundColor="white"
      _dark={{ backgroundColor: "gray.800" }}
    >
      <Logo isOpen={isOpen} onClose={onClose} />
      <Spacer />

      {/* 데스크톱 전용 네비게이션 (md 이상에서만 보임) */}
      <Box display={{ base: "none", md: "flex" }} alignItems="center" columnGap={4}>
        <Categories />
        <Tags />
        <Portfolio />
        <About />
        <Search />
        <ThemeToggler />
      </Box>

      {/* 모바일 전용 컨트롤 (md 미만에서만 보임) */}
      <Box display={{ base: "flex", md: "none" }} alignItems="center" gap="2">
        <ThemeToggler />
        <IconButton
          aria-label="Toggle menu"
          icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon />}
          variant="outline"
          onClick={isOpen ? onClose : onOpen}
        />
      </Box>

      {/* 모바일 메뉴 오버레이 (md 미만에서만 표시) */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="absolute"
          top="70px"
          left="0"
          width="100%"
          height="calc(100vh - 70px)"
          bg="white"
          _dark={{ bg: "gray.800" }}
          zIndex="10"
          p={4}
          overflowY="auto"
          role="dialog"
          aria-modal="true"
        >
          <VStack align="stretch" spacing={0}>
            <Box>
              <Search />
            </Box>
            <Box ml={5}>
              <Box mt={16}>
                <Categories fontSize="lg" />
              </Box>
              <Box mt={8}>
                <Tags fontSize="lg" />
              </Box>
              <Box mt={10}>
                <Portfolio fontSize="lg" />
              </Box>
              <Box mt={8}>
                <About fontSize="lg" />
              </Box>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Header;