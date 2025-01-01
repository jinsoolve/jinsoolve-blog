import React, { useState } from "react";
import type { BoxProps, ComponentDefaultProps, HeadingProps, TextProps } from "@chakra-ui/react";
import { Box, Heading, Text, useColorMode, Button } from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
    <Button
      size="sm"
      position="absolute"
      top="8px"
      right="8px"
      onClick={handleCopy}
      backgroundColor="blue.500"
      color="white"
      _hover={{ backgroundColor: "blue.600" }}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

/* 커스텀 HTML Elements */
const customComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" fontSize={36} mt="80px" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" fontSize={32} mt="80px" mb="40px" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" fontSize={24} mt="60px" mb="30px" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" fontSize={20} mt="40px" mb="20px" {...props} />,
  p: (props: TextProps) => <Text fontSize={16} mt="16px" lineHeight="2" {...props} />,

  li: (props: BoxProps) => (
    <Box
      as="li"
      sx={{
        listStyleType: "none",
        _before: {
          content: '"•"',
          fontSize: "20px",
          color: "gray.300",
          width: "20px",
          display: "inline-block",
        },
      }}
      fontSize={16}
      {...props}
    />
  ),

  ol: (props: BoxProps) => <Box as="ol" fontSize={16} mt="16px" listStylePos="inside" {...props} />,
  ul: (props: BoxProps) => (
    <Box
      as="ul"
      sx={{
        "* > ul": {
          margin: 0,
          marginLeft: "20px",
        },
      }}
      fontSize={16}
      mt="16px"
      listStylePos="inside"
      {...props}
    />
  ),

  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const ariaHidden = props["aria-hidden"];
    const isInternalLink = props.href?.startsWith("/");
    const href = props.href;

    if (!href) return <a {...props} />;

    if (isInternalLink) {
      return <InternalLink to={href}>{props.children}</InternalLink>;
    }

    return (
      <Box
        as="span"
        _hover={{
          textDecoration: "underline",
        }}
      >
        <a
          style={{
            fontWeight: 600,
            color: "var(--chakra-colors-blue-400)",
          }}
          target={!ariaHidden ? "_blank" : undefined}
          {...props}
        />
      </Box>
    );
  },

  blockquote: (props: ComponentDefaultProps) => {
    const children = props.children;
    return <Callout>{children}</Callout>;
  },

  code: (props: ComponentDefaultProps) => {
    const { className, children } = props;
    const match = /language-(\w+)/.exec(className || "");
    const { colorMode } = useColorMode();
    const theme = colorMode === "dark" ? oneDark : oneLight;

    if (!match) {
      return (
        <Text
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
        </Text>
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

  Callout,
  YouTubePlayer,
};

export default function ({ children }: PropsWithChildren) {
  return <MDXProvider components={customComponents as any}>{children}</MDXProvider>;
}