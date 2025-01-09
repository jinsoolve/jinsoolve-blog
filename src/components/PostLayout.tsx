import { Box, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons"; // Chakra UI에서 제공하는 아이콘
import React from "react";

import Footer from "./Footer";
import Header from "./header/Header";
import MDXProvider from "./mdx/MDXProvider";
import TableOfContents from "./TableOfContents";

interface LayoutProps {
  children: React.ReactNode;
  tableOfContents?: any;
}

export default function PostLayout({ children, tableOfContents }: LayoutProps) {
  // "맨 위로 올라가기" 버튼 클릭 시 호출되는 함수
  const scrollToTop = () => {
    const scrollHeight = window.scrollY;
    const scrollSpeed = 25; // 스크롤 속도 조정 (값을 작게 하면 더 빠름)
    const scrollStep = Math.ceil(scrollHeight / scrollSpeed);

    const scrollInterval = setInterval(() => {
      if (window.scrollY <= 0) {
        clearInterval(scrollInterval);
      } else {
        window.scrollBy(0, -scrollStep); // 위로 스크롤
      }
    }, 10);
  };

  return (
    <MDXProvider>
      <Header />

      {/* Article을 화면 중앙에 고정 */}
      <Box
        as="main"
        position="relative" // TOC를 article 기준으로 배치하기 위해 relative 사용
        margin="50px auto"
        padding="20px"
        maxWidth={{ base: "750px", "1.75xl": "800px", "4xl": "880px" }}
        wordBreak="keep-all"
        overflowWrap="break-word"
        lineHeight="1.7"
        letterSpacing="-0.04px"
      >
        {children}
      </Box>

      {/* TOC를 article 기준으로 오른쪽 100px에 sticky로 위치 */}
      {tableOfContents && (
        <Box
          as="nav"
          width="300px"
          position="fixed"
          top="150px"
          right={{ base: "calc(50% - 400px - 300px)", "1.75xl": "calc(50% - 400px - 400px)"}} // article의 오른쪽 100px 위치
          height="fit-content"
          display={{ base: "none", xl: "block" }}
        >
          <TableOfContents tableOfContents={tableOfContents} />
        </Box>
      )}

      {/* 맨 위로 올라가기 버튼 */}
      <IconButton
        icon={<ArrowUpIcon />}
        aria-label="Go to top"
        position="fixed"
        bottom={{ base: "12px", sm: "15px", md: "30px" }}
        right={{ base: "12px", sm: "15px", md: "30px" }}
        size="md"
        borderRadius="full"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
        onClick={scrollToTop}
        zIndex="999"
        _light={{
          backgroundColor: "transparent",  // 기본 배경을 투명하게 설정
        }}
        _focus={{
          backgroundColor: "transparent",  // 포커스 시에도 배경 투명
        }}
        _dark={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
        transition="background-color 0.3s ease"  // 배경색 변화 부드럽게 처리
      />

      <Footer />
    </MDXProvider>
  );
}