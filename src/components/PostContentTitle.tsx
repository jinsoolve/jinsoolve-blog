import { Box, Flex, Heading, Text, useColorMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { koreanTagNames } from "../constants";
import React, { useState, useEffect, useRef } from "react";

import defaultThumbnailImage from "../assets/default-thumbnail.jpg"; // 기본 이미지 경로

interface PostContentTitleProps {
  readingTime: string;
  post: GatsbyTypes.PostPageQuery["post"];
}

const ResponsiveBox = ({ title }: { title: string }) => {
  const [fontSize, setFontSize] = useState(40);
  const [paddingY, setPaddingY] = useState<string>("10%"); // 위아래 패딩 (%)
  const [paddingX, setPaddingX] = useState<string>("7%"); // 좌우 패딩 (%)
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    const resizeBox = () => {
      if (boxRef.current) {
        const { width } = boxRef.current.getBoundingClientRect();
        const newHeight = width * 0.95; // 16:9 비율
        setHeight(newHeight);

        const adjustedFontSize = Math.min((width / title.length) * 1.75, newHeight / 1.5);
        setFontSize(Math.max(20, Math.min(adjustedFontSize, 60))); // 최소 20, 최대 60
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
      padding={`${paddingY} ${paddingX}`} // 위아래와 좌우의 패딩을 % 단위로 적용
    >
      <Box
        height="100%"
        width="100%"
        display="flex"
        alignItems="start"
      >
        <Heading
          style={{
            fontSize: `${fontSize}px`,
          }}
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




const PostContentTitle = ({ post, readingTime }: PostContentTitleProps) => {
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
      <Flex
        alignItems={flexDirection === "column" ? "start" : "baseline"}
        flexDirection={flexDirection}
        columnGap="15px"
        rowGap="5px"
      >
        <Heading
          as="h1"
          fontSize={36}
          fontWeight={900}
          wordBreak="break-word"
        >
          {post?.frontmatter?.title}
        </Heading>
        <Text fontSize="12px" marginBottom="3">
          {readingTime}
        </Text>
      </Flex>

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
            ? `${post?.frontmatter?.updatedAt} updated`
            : post?.frontmatter?.createdAt}
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

      <Box height="10px" />

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
        {post?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData ? (
          <GatsbyImage
            image={post.frontmatter.thumbnail.childImageSharp.gatsbyImageData}
            alt={post.frontmatter.title || "Post Thumbnail"}
          />
        ) : (
          // <ResponsiveBox title={post?.frontmatter?.title || "No Title Available"} />
          <img
            src={defaultThumbnailImage}
            alt="Default Thumbnail"
            style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }} // 스타일 적용 가능
          />
        )}
      </Box>
    </Flex>
  );
};

export default PostContentTitle;