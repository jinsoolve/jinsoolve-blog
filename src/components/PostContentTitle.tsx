import { Box, Flex, Heading, Text, useColorMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { koreanTagNames } from "../constants";
import { useState, useEffect, useRef } from "react";

interface PostContentTitleProps {
  readingTime: string;
  post: GatsbyTypes.PostPageQuery["post"];
}

const ResponsiveBox = ({ title }: { title: string }) => {
  const [fontSize, setFontSize] = useState(40);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeFont = () => {
      if (boxRef.current) {
        const { width, height } = boxRef.current.getBoundingClientRect();
        const adjustedFontSize = Math.min((width / title.length) * 1.75, height / 1.5);
        setFontSize(Math.max(20, Math.min(adjustedFontSize, 60))); // 최소 20, 최대 60
      }
    };

    resizeFont();
    window.addEventListener("resize", resizeFont);
    return () => window.removeEventListener("resize", resizeFont);
  }, [title]);

  return (
    <Box
      ref={boxRef}
      backgroundColor="white"
      display="flex"
      padding="0px 20px"
      alignItems="start"
      justifyContent="center"
      minHeight="550px"
      width="100%"
      borderRadius="20px"
    >
      <Box
        height="100%"
        width="100%"
        padding="40px"
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
          <ResponsiveBox title={post?.frontmatter?.title || "No Title Available"} />
        )}
      </Box>
    </Flex>
  );
};

export default PostContentTitle;