import { Box, Flex, Heading, Text, useColorMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { koreanTagNames } from "../constants";
import React, { useState, useEffect, useRef } from "react";

interface PostContentTitleProps {
  readingTime: string;
  post: GatsbyTypes.PostPageQuery["post"];
  showThumbnail?: boolean; // ✅ 추가: 썸네일 표시 여부를 제어하는 prop
}

const ResponsiveBox = ({ title }: { title: string }) => {
  const [fontSize, setFontSize] = useState(40);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    const resizeBox = () => {
      if (boxRef.current) {
        const { width } = boxRef.current.getBoundingClientRect();
        const newHeight = width * 0.95; // 16:9 비율
        setHeight(newHeight);
        const adjustedFontSize = Math.min((width / title.length) * 1.75, newHeight / 1.5);
        setFontSize(Math.max(20, Math.min(adjustedFontSize, 60)));
      }
    };

    resizeBox();
    window.addEventListener("resize", resizeBox);
    return () => window.removeEventListener("resize", resizeBox);
  }, [title]);

  return (
    <Box
      ref={boxRef}
      backgroundColor="white"
      display="flex"
      alignItems="start"
      justifyContent="center"
      width="100%"
      borderRadius="20px"
      height={height ? `${height}px` : "auto"}
      padding="10% 7%"
    >
      <Box height="100%" width="100%" display="flex" alignItems="start">
        <Heading
          style={{ fontSize: `${fontSize}px` }}
          fontWeight="700"
          color="black"
          fontFamily="SBAggro"
          lineHeight="1.5"
        >
          {title}
        </Heading>
      </Box>
    </Box>
  );
};

const PostContentTitle = ({ post, readingTime, showThumbnail = true }: PostContentTitleProps) => {
  const { colorMode } = useColorMode();
  const flexDirection = useBreakpointValue({ base: "column", xl: "row" });
  const boxShadowColor = useColorModeValue(
    "0 4px 6px rgba(0, 0, 0, 0.3)",
    "0 4px 6px rgba(255, 255, 255, 0.3)"
  );

  return (
    <Flex
      width="100%"
      position="relative"
      flexDirection="column"
      alignItems="baseline"
      isolation="isolate"
    >
      {/* 제목 및 메타데이터 */}
      <Flex
        alignItems={flexDirection === "column" ? "start" : "baseline"}
        flexDirection={flexDirection}
        columnGap="15px"
        rowGap="5px"
      >
        <Heading as="h1" fontSize={36} fontWeight={900} wordBreak="break-word">
          {post?.frontmatter?.title}
        </Heading>
        <Text fontSize="12px" marginBottom="3">
          {readingTime}
        </Text>
      </Flex>

      {/* 카테고리 및 날짜 */}
      <Flex columnGap="14px" rowGap="10px" alignItems="end" flexWrap="wrap">
        <Box
          color={colorMode === "dark" ? "gray.50" : "gray.900"}
          borderColor={colorMode === "dark" ? "gray.50" : "gray.900"}
          border="2px solid"
          borderRadius="10px"
          padding="6px 10px"
          fontSize="14px"
          fontWeight="800"
          width="fit-content"
        >
          {post?.frontmatter?.updatedAt
            ? `${post.frontmatter.updatedAt} updated`
            : post.frontmatter.createdAt}
        </Box>
        {post?.frontmatter?.categories?.map((category) => (
          <Link key={category} to={`/categories/${category}`}>
            <Box
              color={colorMode === "dark" ? "gray.50" : "gray.900"}
              borderColor={colorMode === "dark" ? "gray.50" : "gray.900"}
              border="2px solid"
              borderRadius="10px"
              padding="6px 10px"
              fontSize="14px"
              fontWeight="800"
              width="fit-content"
            >
              {koreanTagNames[category!] || category}
            </Box>
          </Link>
        ))}
      </Flex>

      {/* ✅ 썸네일 표시 여부를 prop으로 제어 */}
      {showThumbnail && post?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData && (
        <Box
          display="flex"
          flexDirection="column"
          maxHeight="700px"
          justifyContent="center"
          alignItems="center"
          isolation="isolate"
          borderRadius="20px"
          overflow="hidden"
          boxShadow={boxShadowColor}
          marginTop="20px"
        >
          <GatsbyImage
            image={post.frontmatter.thumbnail.childImageSharp.gatsbyImageData}
            alt={post.frontmatter.title || "Post Thumbnail"}
          />
        </Box>
      )}
    </Flex>
  );
};

export default PostContentTitle;