import React, { useState, useEffect } from "react";
import type { BoxProps, ComponentDefaultProps, HeadingProps, TextProps } from "@chakra-ui/react";
import { Box, Heading, Text, useColorMode, Tooltip, IconButton } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";
import { MDXProvider } from "@mdx-js/react";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import Callout from "./Callout";
import { InternalLink } from "./InternalLink";
import YouTubePlayer from "./YouTubePlayer";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();

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
        top="12px"
        right="8px"
        aria-label="Copy code"
        backgroundColor={colorMode === "dark" ? "gray.800" : "gray.200"} // 모드별 색상
        color={colorMode === "dark" ? "white" : "gray.900"} // 모드별 색상
        _hover={{
          backgroundColor: colorMode === "dark" ? "gray.600" : "gray.400", // 모드별 호버 색상
        }}
        _active={{
          backgroundColor: colorMode === "dark" ? "gray.700" : "gray.500", // 모드별 클릭 색상
        }}
        borderRadius="10px"
      />
    </Tooltip>
  );
};

const InlineCode = ({ children }: { children: string }) => {
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? oneDark : oneLight;

  const inlineStyle = {
    backgroundColor: colorMode === "dark" ? "gray.900" : "gray.50", // 필요 시 주석 해제
    color: colorMode === "dark" ? "white" : "gray.900",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "550",
    textDecoration: "underline", // 밑줄 추가
    textDecorationColor: colorMode === "dark" ? "blue.400" : "blue.500", // 밑줄 색상 설정
    textDecorationThickness: "2px", // 밑줄 두께 설정
    textUnderlineOffset: "5px", // 밑줄과 텍스트 사이 간격
  };

  return (
    <Text as="code" sx={inlineStyle}>
      {children}
    </Text>
  );
};

const CodeBlock = (props: any) => {
  const { className, children } = props;
  const match = /language-(\w+)/.exec(className || "");
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? oneDark : oneLight;
  const language = match ? match[1] : "text"; // 언어가 없을 경우 기본값 "text"
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setFontSize(13);
      } else if (width < 1024) {
        setFontSize(14);
      } else {
        setFontSize(15);
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);

  if (!match) {
    // 인라인 코드일 경우 InlineCode 컴포넌트 사용
    return <InlineCode>{children}</InlineCode>;
  }

  return (
    <Box
      position="relative"
      marginTop="10px"
      borderRadius="10px"
      overflow="hidden"
      mb="20px"
      boxShadow={
        colorMode === "dark"
          ? "0px 4px 12px rgba(0, 0, 0, 0.6)"
          : "0px 4px 12px rgba(0, 0, 0, 0.2)"
      }
    >
      {/* 상단 바 */}
      <Box
        bg={theme['code[class*="language-"]']?.background || "inherit"}
        height="40px"
        px="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between" // 좌우 배치 정렬
        borderBottom={`1px solid ${colorMode === "dark" ? "gray.700" : "gray.400"}`}
        paddingLeft="20px"
        paddingTop="25px"
        paddingBottom="25px"
      >
        {/* Mac 버튼 + 언어명 그룹 */}
        <Box display="flex" alignItems="baseline">
          {/* Mac 버튼 */}
          <Box display="flex" gap="8px">
            <Box width="12px" height="12px" borderRadius="full" bg="red.500" />
            <Box width="12px" height="12px" borderRadius="full" bg="yellow.500" />
            <Box width="12px" height="12px" borderRadius="full" bg="green.500" />
          </Box>

          {/* 언어명 표시 (Mac 버튼 오른쪽) */}
          <Box
            fontSize="14px"
            fontWeight="bold"
            textTransform="uppercase"
            color={colorMode === "dark" ? "whiteAlpha.800" : "gray.700"}
            padding="2px 12px"
            borderRadius="5px"
            textAlign="left"
          >
            {language}
          </Box>
        </Box>

        {/* 복사 버튼 */}
        <CopyButton text={String(children).replace(/\n$/, "")} />
      </Box>

      {/* 코드 영역 */}
      <Box>
        <SyntaxHighlighter
          style={theme}
          customStyle={{
            margin: "0px",
            borderRadius: "0px 0px 10px 10px",
            fontFamily: "Fira Code, monospace",
            fontSize: `${fontSize}px`,
          }}
          showLineNumbers
          lineNumberStyle={{
            width: "42px",
            textAlign: "right",
            paddingRight: "18px",
            fontSize: `${fontSize - 2}px`,
          }}
          PreTag="div"
          language={language}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

const customComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" fontSize={36} mt="80px" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" fontSize={32} mt="60px" mb="30px" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" fontSize={24} mt="60px" mb="20px" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" fontSize={20} mt="40px" mb="20px" {...props} />,
  p: (props: TextProps) => <Text fontSize={16} mt="20px" lineHeight="1.8" {...props} />,
  li: (props: BoxProps) => (
    <Box
      as="li"
      sx={{
        wordBreak: "break-word", // 텍스트가 너무 길 경우 줄바꿈
        marginLeft: "24px",
        lineHeight: "1.8",
      }}
      m={"4px 0"}
      fontSize={16}
      {...props}
    />
  ),
  ol: (props: BoxProps) => (
    <Box
      as="ol"
      sx={{
        listStylePosition: "inside", // 숫자 위치를 텍스트와 맞춤
        listStyleType: "decimal", // 숫자 리스트 스타일
        textIndent: "-1.2em", // 첫 줄의 들여쓰기 제거
        "* > ol": {
          margin: 0,
        },
      }}
      {...props}
    />
  ),
  ul: (props: BoxProps) => (
    <Box
      as="ul"
      sx={{
        listStylePosition: "inside", // 숫자 위치를 텍스트와 맞춤
        listStyleType: "disc", // 기본 bullet 스타일
        // marginLeft: "0px",
        textIndent: "-1.2em", // 첫 줄의 들여쓰기 제거
        "* > ul": {
          margin: 0,
          // padding: 0,
        },
      }}
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
  code: CodeBlock,
  Callout,
  YouTubePlayer,
};

export default function ({ children }: PropsWithChildren) {
  return <MDXProvider components={customComponents as any}>{children}</MDXProvider>;
}