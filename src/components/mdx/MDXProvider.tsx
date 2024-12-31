import type { BoxProps, ComponentDefaultProps, HeadingProps, TextProps } from "@chakra-ui/react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useColorMode } from "@chakra-ui/react";

import { parseSyntaxHighlighterClassName } from "../../utils/string";
import Callout from "./Callout";
import { InternalLink } from "./InternalLink";
import YouTubePlayer from "./YouTubePlayer";


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

  img: (props: { src: string; alt: string }) => {
    const isGif = props.src?.includes(".gif");
    const { src, alt } = props;
    if (isGif) {
      return (
        <Box margin="25px 0px" maxWidth="800px">
          <img src={src} alt={alt} />
          <Text
            as="figcaption"
            fontSize="14px"
            textAlign="center"
            marginTop="16px"
            color="gray.500"
          >
            {alt}
          </Text>
        </Box>
      );
    }
  },

  blockquote: (props: ComponentDefaultProps) => {
    const children = props.children;
    return <Callout>{children}</Callout>;
  },

  katex: (props: ComponentDefaultProps) => {
    const { children } = props;

    return (
      <Box
        className="katex-container"
        sx={{
          border: "1px solid white", // border 스타일
          borderRadius: "8px", // 추가 스타일
          padding: "16px",
          backgroundColor: "gray.50",
          overflow: "auto", // 가로 스크롤 허용
          whiteSpace: "nowrap", // 내용이 줄바꿈되지 않도록 설정
          _dark: {
            backgroundColor: "gray.900", // 다크 모드 배경
          },
        }}
      >
        {children}
      </Box>
    );
  },

  // NOTE: match하면 code block, match하지 않으면 inline code
  code: (props: ComponentDefaultProps) => {
    const { className, children } = props;
    const match = /language-(\w+)/.exec(className || "");


    if (!match) {
      return (
        <Text
          as="code"
          sx={{
            borderRadius: "4px",
            padding: "2px 4px",
            letterSpacing: "-0.04px",
            fontWeight: "600",
            // backgroundColor: "gray.200",
            color: "gray.900",

            // borderColor: "gray.400", // 기본 테두리 색상
            _dark: {
              // backgroundColor: "gray.900",
              color: "gray.50",
              // border: "0.5px solid", // 기본 테두리
              // borderColor: "gray.50", // 다크 모드에서 테두리 색상 변경
            },
          }}
        >
          {children}
        </Text>
      );
    }

    // NOTE: jsx,1-2&4-6,7-8
    const { addLines, removeLines } = parseSyntaxHighlighterClassName(className);
    const { colorMode } = useColorMode();
    const theme = colorMode === "dark" ? oneDark : oneLight;
    return (
      <SyntaxHighlighter
        style={theme}
        customStyle={{
          margin: "20px 0px", borderRadius: "10px",
          boxShadow: colorMode === "dark"
            ? "0px 4px 12px rgba(0, 0, 0, 0.4)" // 다크모드 음영
            : "0px 4px 12px rgba(0, 0, 0, 0.1)", // 라이트모드 음영
          fontFamily: "Fira Code, monospace",
        }}

        showLineNumbers
        PreTag="div"
        language={match[1]}
        wrapLines
        lineProps={(lineNumber) => {
          const style = {
            display: "table",
            backgroundColor: "transparent",
            width: "100%",
          };

          if (addLines?.includes(lineNumber)) {
            return { style: { ...style, backgroundColor: "#afa62d30" } };
          }

          if (removeLines?.includes(lineNumber)) {
            return { style: { ...style, backgroundColor: "#5c3232" } };
          }

          return { style };
        }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },

  Callout,
  YouTubePlayer,
};

export default function ({ children }: PropsWithChildren) {
  return <MDXProvider components={customComponents as any}>{children}</MDXProvider>;
}
