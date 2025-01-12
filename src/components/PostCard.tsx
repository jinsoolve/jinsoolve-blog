import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { GatsbyImage } from "gatsby-plugin-image";
import { useMemo } from "react";

import { useColorModeValue } from "@chakra-ui/react";

interface PostCardProps {
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  categories: readonly (string | null)[];
  thumbnail?: IGatsbyImageData;
  excerpt?: string;
}

const PostCard = ({
                    createdAt,
                    description,
                    slug,
                    thumbnail,
                    title,
                    updatedAt,
                    excerpt,
                  }: PostCardProps) => {
  const diffMs = useMemo(
    () => new Date().getTime() - new Date(createdAt).getTime(),
    [createdAt]
  );
  const isNewPost = useMemo(
    () => Math.floor(diffMs / (1000 * 60 * 60 * 24)) <= 10,
    [diffMs]
  );

  const borderColor = useColorModeValue("gray.50", "#444548");
  const hoverBorderColor = useColorModeValue("blue.500", "blue.400");
  const boxShadowColor = useColorModeValue(
    "0 4px 6px rgba(0, 0, 0, 0.3)",
    "0 4px 6px rgba(255, 255, 255, 0.3)"
  );
  const cardHeight = useMemo(() => {
    if (!thumbnail) {
      return { base: "190px", sm_md: "380px" };
    }
    return "380px";
  }, [thumbnail]);

  return (
    <Link to={`/posts/${slug}`}>
      <Box
        as="article"
        transition="all 0.25s ease"
        position="relative"
        borderRadius="20px"
        overflow="hidden"
        width="300px"
        maxWidth="90vw"
        minHeight={cardHeight}
        height="100%"
        boxShadow="xl"
        borderWidth="2px"
        borderColor={borderColor}
        _hover={{
          borderColor: hoverBorderColor,
          boxShadow: "xl",
          cursor: "pointer",
        }}
      >
        {/* 썸네일 */}
        <GatsbyImage
          objectFit="cover"
          style={{
            maxHeight: "171px",
            height: "45%",
            width: "100%"
          }}
          image={thumbnail}
          alt={`${slug} cover image`}
        />

        {/* 메타 정보와 제목 */}
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={thumbnail ? "55%" : "100%"}
          padding="20px"
        >
          <Box>
            <Heading fontSize="20px" fontWeight="700" marginBottom="8px">
              {title}
            </Heading>
            <Text fontSize="16px" color="gray.600" noOfLines={2} marginBottom="10px">
              {description || excerpt}
            </Text>
          </Box>

          {/* 날짜 및 New Post 태그 */}
          <Flex justifyContent="space-between" alignItems="flex-start" marginTop="10px">
            <Text fontSize="14px" color="gray.500">
              {updatedAt ? `${updatedAt} (updated)` : createdAt}
            </Text>
            <Box
              backgroundColor="blue.400"
              color="white"
              borderRadius="12px"
              padding="4px 8px"
              fontSize="12px"
              fontWeight="bold"
              visibility={isNewPost ? "visible" : "hidden"} // 공간 유지하면서 숨김 처리
            >
              NEW POST
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default PostCard;