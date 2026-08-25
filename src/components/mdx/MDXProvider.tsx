import React, { useState } from "react";
import type { BoxProps, ComponentDefaultProps, HeadingProps, TextProps } from "@chakra-ui/react";
import { Box, Heading, Text, useColorMode, Tooltip, IconButton } from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { PrismLight } from "react-syntax-highlighter";
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import { MDXProvider } from "@mdx-js/react";
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  PropsWithChildren,
} from "react";
import Callout from "./Callout";
import { InternalLink } from "./InternalLink";

PrismLight.registerLanguage("cpp", cpp);
PrismLight.registerLanguage("python", python);
PrismLight.registerLanguage("py", python);

const SyntaxHighlighter = PrismLight as unknown as React.ComponentType<any>;

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
        icon={copied ? <CheckIcon /> : <CopyIcon />}
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

const MdxImage = ({
  loading,
  decoding,
  fetchPriority,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const isAboutHero =
    props.alt === "header" &&
    props.src?.startsWith("https://capsule-render.vercel.app/");

  return (
    <img
      {...props}
      loading={isAboutHero ? "eager" : loading ?? "lazy"}
      decoding={decoding ?? "async"}
      fetchPriority={isAboutHero ? "high" : fetchPriority}
    />
  );
};

const CodeBlock = (props: any) => {
  const { className, children } = props;
  const match = /language-(\w+)/.exec(className || "");
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? oneDark : oneLight;
  const language = match ? match[1] : "text"; // 언어가 없을 경우 기본값 "text"
  const code = String(children).replace(/\n$/, "");
  const codeFontSize = "clamp(13px, calc(11px + 0.4vw), 15px)";
  const codeBackground = String(
    theme['code[class*="language-"]']?.background || "inherit",
  );
  const lineNumbers = code.split("\n").map((_, index) => index + 1);

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
        style={{
          background: codeBackground,
        }}
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
        <CopyButton text={code} />
      </Box>

      {/* 코드 영역 */}
      <Box display="flex" alignItems="stretch" background={codeBackground}>
        <Box
          as="div"
          aria-hidden="true"
          flexShrink={0}
          background={codeBackground}
          color={colorMode === "dark" ? "gray.500" : "gray.500"}
          px={{ base: "6px", md: "8px" }}
          py="1em"
          fontFamily="Fira Code, monospace"
          fontSize={codeFontSize}
          lineHeight="1.5"
          textAlign="right"
          userSelect="none"
          pointerEvents="none"
        >
          {lineNumbers.map((lineNumber) => (
            <Box key={lineNumber} height="1.5em" lineHeight="1.5em" whiteSpace="nowrap">
              <Box as="span" fontSize="0.85em" fontStyle="italic">
                {lineNumber}
              </Box>
            </Box>
          ))}
        </Box>

        <Box minWidth={0} flex="1" overflowX="auto" overflowY="hidden">
          <SyntaxHighlighter
            style={theme}
            customStyle={{
              boxSizing: "border-box",
              margin: "0px",
              minWidth: "100%",
              width: "max-content",
              overflow: "visible",
              padding: "1em 1em 1em 8px",
              borderRadius: "0px 0px 10px 0px",
              fontFamily: "Fira Code, monospace",
              fontSize: codeFontSize,
              lineHeight: "1.5",
            }}
            PreTag="div"
            language={language}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  );
};

const customComponents = {
  h1: (props: HeadingProps) => <Heading as="h1" fontSize={36} mt="80px" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" fontSize={30} mt="60px" mb="0px" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" fontSize={24} mt="60px" mb="0px" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" fontSize={18} mt="40px" mb="0px" {...props} />,
  p: (props: TextProps) => <Text fontSize={16} m="10px 0px" lineHeight="1.8" {...props} />,
  li: (props: BoxProps) => (
    <Box
      as="li"
      sx={{
        wordBreak: "break-word", // 텍스트가 너무 길 경우 줄바꿈
        lineHeight: "1.6",
        "& > p:first-of-type": {
          display: "inline",
          margin: 0,
        },
      }}
      my="4px"
      fontSize={16}
      {...props}
    />
  ),
  ol: (props: BoxProps) => (
    <Box
      as="ol"
      sx={{
        listStylePosition: "outside", // 마커와 첫 문단을 같은 줄에 배치
        listStyleType: "decimal", // 숫자 리스트 스타일
        paddingLeft: "1.5em",
        marginTop: "13px",
        marginBottom: "13px",
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
        listStylePosition: "outside", // 마커와 첫 문단을 같은 줄에 배치
        listStyleType: "disc", // 기본 bullet 스타일
        paddingLeft: "1.5em",
        "* > ul": {
          margin: 0,
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
  img: MdxImage,
  blockquote: (props: ComponentDefaultProps) => {
    const children = props.children;
    return <Callout>{children}</Callout>;
  },
  code: CodeBlock,
  Callout,
};

export default function ({ children }: PropsWithChildren) {
  return (
    <MDXProvider components={customComponents as any}>
      {children as any}
    </MDXProvider>
  );
}
