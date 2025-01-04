import { Box } from "@chakra-ui/react";
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
  return (
    <MDXProvider>
      <Header />

      {/* Article을 화면 중앙에 고정 */}
      <Box
        as="main"
        position="relative" // TOC를 article 기준으로 배치하기 위해 relative 사용
        margin="50px auto"
        padding="20px"
        maxWidth="900px"
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
          right="calc(50% - 400px - 400px)" // article의 오른쪽 100px 위치
          height="fit-content"
          display={{ base: "none", xl: "block" }}
        >
          <TableOfContents tableOfContents={tableOfContents} />
        </Box>
      )}

      <Footer />
    </MDXProvider>
  );
}