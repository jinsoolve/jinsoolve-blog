import { Box, Flex, Heading, Text, useColorMode, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { koreanTagNames } from "../constants";

interface PostContentTitleProps {
  readingTime: string;
  post: GatsbyTypes.PostPageQuery["post"];
}

const PostContentTitle = ({ post, readingTime }: PostContentTitleProps) => {
  const { colorMode } = useColorMode();
  // 좁은 화면에서는 column(세로), 넓은 화면에서는 row(가로)로 전환
  const flexDirection = useBreakpointValue({ base: "column", xl: "row" });
  const boxShadowColor = useColorModeValue(
    "0 4px 6px rgba(0, 0, 0, 0.3)", // 라이트모드 음영
    "0 4px 6px rgba(255, 255, 255, 0.3)" // 다크모드 음영
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
        flexDirection={flexDirection} // 반응형 레이아웃 전환
        columnGap="15px"
        rowGap="5px" // 세로 정렬일 때 간격
      >
        <Heading
          as="h1"
          fontSize={36}

          fontWeight={900}
          wordBreak="break-word"
        >
          {post?.frontmatter?.title}
        </Heading>
        <Text
          fontSize="12px"

          marginBottom="3"
        >
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
              key={category}
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
      <Box height="10px" />  {/* 여기에 간격을 추가합니다. */}

      <Flex columnGap="10px" rowGap="10px" alignItems="baseline" flexWrap="wrap">
        {post?.frontmatter?.tags?.map((tag) => (
          <Link key={tag} to={`/tags/${tag}`}>
            <Box
              key={tag}
              color={colorMode === "dark" ? "gray.50" : "gray.900"}
              borderColor={colorMode === "dark" ? "gray.50" : "gray.900"}
              border="2px solid"
              borderRadius="20px"
              padding="6px"
              fontSize="14px"
              fontWeight="800"
              width="fit-content"
            >
              {koreanTagNames[tag!] || tag}
            </Box>
          </Link>
        ))}
      </Flex>

      <Box
        display="flex"
        flexDirection="column"
        // width="100%"
        // height="100%"
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
          image={post?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!}
          alt={post?.frontmatter?.title!}
        />
      </Box>
      {/*{post?.frontmatter?.thumbnailSource && (*/}
      {/*  <Text fontSize="12px" textAlign="center" width="100%">*/}
      {/*    이미지 출처: {post?.frontmatter?.thumbnailSource}*/}
      {/*  </Text>*/}
      {/*)}*/}
    </Flex>
  );
};

export default PostContentTitle;
