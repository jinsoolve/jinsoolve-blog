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
    window.scrollTo({ top: 0, behavior: "auto" });
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
        bottom="30px"
        right="30px"
        size="md"
        borderRadius="full"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
        onClick={scrollToTop}
        zIndex="999"
        _dark={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      />

      <Footer />
    </MDXProvider>
  );
}