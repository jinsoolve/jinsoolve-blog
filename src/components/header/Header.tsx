import {
    Box,
    Spacer,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Stack
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";

import RSS from "../rss";
import ThemeToggler from "../theme-toggle/ThemeToggler";
import About from "./About";
import Logo from "./Logo";
import Portfoilo from "./Portfolio";
import Tags from "./Tags";
import Categories from "./Categories";
import Search from "./Search";

const Header = () => {
    const [isSticky, setIsSticky] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile, setIsMobile] = useState(false);

    // 화면 너비 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 580); // 768px 이하에서 모바일 메뉴로 전환
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
        // overflow="hidden" 제거
      >
          <Logo />
          <Spacer />

          {isMobile ? (
            <>
                <Box display="flex" alignItems="center" gap="2">
                    <ThemeToggler />
                    <IconButton
                      aria-label="Open menu"
                      icon={<HamburgerIcon />}
                      variant="outline"
                      onClick={onOpen}
                    />
                </Box>
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent background="gray.100" _dark={{ backgroundColor: "gray.800" }}>
                        <DrawerCloseButton />
                        <DrawerHeader>Menu</DrawerHeader>
                        <DrawerBody>
                            <Box mb="4">
                                <Categories />
                            </Box>
                            <Box mb="4">
                                <Tags />
                            </Box>
                            <Box mt="6" mb="2">
                                <Portfoilo />
                            </Box>
                            <Box mb="2">
                                <About />
                            </Box>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
          ) : (
            <>
                <Categories />
                <Tags />
                <Portfoilo />
                <About />
                <Search />
                <ThemeToggler />
                {/* Search 컴포넌트 */}

            </>
          )}
      </Box>
    );
};

export default Header;