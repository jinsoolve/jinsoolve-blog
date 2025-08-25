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
    const [isMobile, setIsMobile] = useState(true);

    // 화면 너비 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 630); // 580px 이하에서 모바일 메뉴로 전환
        };

        // 초기 상태 설정
        handleResize();

        // 윈도우 크기 변경 이벤트 리스너 추가
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 스크롤 시 헤더 상태 변경
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
      <Box
        as="header"
        position="sticky"
        top="0"
        display="flex"
        paddingLeft={5}
        paddingRight={5}
        columnGap={4}
        zIndex="5"
        alignItems="center"
        width="100%"
        height="70px"
        transition="box-shadow 0.3s ease"
        shadow={isSticky ? "sm" : "none"}
        backgroundColor="white"
        _dark={{
            backgroundColor: "gray.800",
        }}
      >
          <Logo isOpen={isOpen} onClose={onClose} />
          <Spacer />

          {isMobile ? (
            <>
                <Box display="flex" alignItems="center" gap="2">
                    <ThemeToggler />
                    <IconButton
                      aria-label="Toggle menu"
                      icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon />}
                      variant="outline"
                      onClick={isOpen ? onClose : onOpen}
                    />
                </Box>
                {isOpen && (
                  <Box
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
                  >
                      <VStack align="stretch" spacing={0}>
                          <Box>
                              <Search />
                          </Box>
                          <Box ml={5}>
                              <Box mt={16} >
                                  <Categories fontSize={"lg"} />
                              </Box>
                              <Box mt={8}>
                                  <Tags fontSize={"lg"} />
                              </Box>
                              <Box mt={10}>
                                  <Portfolio fontSize={"lg"} />
                              </Box>
                              <Box mt={8}>
                                  <About fontSize={"lg"} />
                              </Box>
                          </Box>

                      </VStack>
                  </Box>
                )}
            </>
          ) : (
            <>
                <Categories />
                <Tags />
                <Portfolio />
                <About />
                <Search />
                <ThemeToggler />
            </>
          )}
      </Box>
    );
};

export default Header;