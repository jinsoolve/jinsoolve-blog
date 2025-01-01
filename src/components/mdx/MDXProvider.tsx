import React, { useState } from "react";
import { Box, useColorMode, IconButton, Tooltip } from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";

import { parseSyntaxHighlighterClassName } from "../../utils/string";
import Callout from "./Callout";
import { InternalLink } from "./InternalLink";
import YouTubePlayer from "./YouTubePlayer";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Tooltip label={copied ? "Copied!" : "Copy"} hasArrow placement="top">
      <IconButton
        icon={copied ? <FiCheck /> : <FiCopy />}
        onClick={handleCopy}
        size="md"
        position="absolute"
        top="8px"
        right="8px"
        aria-label="Copy code"
        backgroundColor="gray.900"
        color="white"
        _hover={{ backgroundColor: "gray.600" }}
        _active={{ backgroundColor: "gray.700" }}
        borderRadius="10px"
      />
    </Tooltip>
  );
};

/* 커스텀 HTML Elements */
const customComponents = {
  code: (props: { className?: string; children: React.ReactNode }) => {
    const { className, children } = props;
    const match = /language-(\w+)/.exec(className || "");
    const { colorMode } = useColorMode();
    const theme = colorMode === "dark" ? oneDark : oneLight;

    if (!match) {
      return (
        <Box
          as="code"
          sx={{
            borderRadius: "4px",
            padding: "2px 4px",
            letterSpacing: "-0.04px",
            fontWeight: "600",
            color: "gray.900",
            _dark: {
              color: "gray.50",
            },
          }}
        >
          {children}
        </Box>
      );
    }

    return (
      <Box position="relative">
        <CopyButton text={String(children).replace(/\n$/, "")} />
        <SyntaxHighlighter
          style={theme}
          customStyle={{
            margin: "20px 0px",
            borderRadius: "10px",
            boxShadow:
              colorMode === "dark"
                ? "0px 4px 12px rgba(0, 0, 0, 0.4)"
                : "0px 4px 12px rgba(0, 0, 0, 0.1)",
            fontFamily: "Fira Code, monospace",
          }}
          showLineNumbers
          PreTag="div"
          language={match[1]}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </Box>
    );
  },

  // 기존 컴포넌트 설정 유지
  Callout,
  YouTubePlayer,
};

export default function ({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={customComponents}>{children}</MDXProvider>;
}