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
  const flexDirection = useBreakpointValue({ base: "column", "1.75xl": "column" });
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
        marginBottom="5"
      >
        <Heading as="h1" fontSize={36} fontWeight={900} wordBreak="break-word">
          {post?.frontmatter?.title}
        </Heading>
      </Flex>

      <Flex columnGap="14px" rowGap="10px" flexDirection="column" alignItems="start">
        {/* 카테고리 그룹 */}
        <Flex columnGap="14px" rowGap="10px" alignItems="center" flexWrap="wrap">
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
                _hover={{
                  color: colorMode === "dark" ? "blue.500" : "blue.400",
                  borderColor: colorMode === "dark" ? "blue.500" : "blue.400",
                }}
              >
                {koreanTagNames[category!] || category}
              </Box>
            </Link>
          ))}
        </Flex>

        {/* 태그 그룹 */}
        <Flex columnGap="10px" rowGap="10px" flexWrap="wrap">
          {post?.frontmatter?.tags?.map((tag) => (
            <Link key={tag} to={`/tags/${tag}`}>
              <Box
                color={colorMode === "dark" ? "gray.200" : "gray.900"}
                backgroundColor={colorMode === "dark" ? "#2f2f33" : "gray.100"}
                borderRadius="10px"
                padding="6px"
                fontSize="14px"
                fontWeight="600"
                width="fit-content"
                _hover={{
                  backgroundColor: colorMode === "dark" ? "#535357" : "gray.200",
                }}
              >
                {koreanTagNames[tag!] || tag}
              </Box>
            </Link>
          ))}
        </Flex>
      </Flex>

      <Flex
        width="100%"
        alignItems={flexDirection === "column" ? "end" : "baseline"}
        flexDirection={flexDirection}
        columnGap="15px"
        rowGap="5px"
      >
        <Text fontSize={15} fontWeight={400} mt={1}>
          {post?.frontmatter?.updatedAt
            ? `Updated At: ${post.frontmatter.updatedAt}`
            : `Created At: ${post.frontmatter.createdAt}`}
        </Text>
        <Text fontSize="15px">
          {readingTime}
        </Text>
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