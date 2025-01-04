import { Box, Center, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { useMemo, useState, useEffect, useRef } from "react";
import defaultThumbnailImage from "../assets/default-thumbnail.jpg"; // 기본 이미지 경로

import { koreanTagNames } from "../constants";

interface FeaturedPostCardProps {
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  categories: readonly (string | null)[];
  thumbnail?: IGatsbyImageData;
}

const FeaturedPostCard = ({
                            createdAt,
                            description,
                            slug,
                            categories,
                            thumbnail,
                            title,
                            updatedAt,
                          }: FeaturedPostCardProps) => {
  const diffMs = useMemo(() => new Date().getTime() - new Date(createdAt).getTime(), [createdAt]);
  const isNewPost = useMemo(() => Math.floor(diffMs / (1000 * 60 * 60 * 24)) <= 10, [diffMs]);
  const [isHovered, setIsHovered] = useState(false);

  const boxShadowColor = useColorModeValue(
    "0 4px 6px rgba(0, 0, 0, 0.3)",
    "0 4px 6px rgba(255, 255, 255, 0.3)"
  );

  const borderColor = useColorModeValue("gray.50", "#444548");

  return (
    <Link to={`/posts/${slug}`}>
      <Box
        as="article"
        position="relative"
        borderRadius="20px"
        overflow="hidden"
        width="300px"
        height="380px"
        transition="all 0.25s ease"
        boxShadow="xl"
        borderWidth="2px"
        borderColor={borderColor}
        _hover={{
          borderColor: "blue.400",
          boxShadow: "xl",
          cursor: "pointer",
        }}
      >
        {/* 썸네일 */}
        {thumbnail ? (
          <GatsbyImage
            objectFit="cover"
            style={{ height: "45%", width: "100%" }}
            image={thumbnail}
            alt={`${slug} cover image`}
          />
        ) : (
          <GatsbyImage
            objectFit="cover"
            style={{ height: "45%", width: "100%" }}
            image={thumbnail}
            alt={`${slug} cover image`}
          />
          // <Box
          //   height="45%"
          //   width="100%"
          //   backgroundColor="gray.200"
          //   display="flex"
          //   alignItems="center"
          //   justifyContent="center"
          // >
          //   <Text color="gray.500" fontSize="16px">
          //     No Thumbnail
          //   </Text>
          // </Box>
        )}

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
              {description}
            </Text>
          </Box>

          {/* 날짜 및 New Post 태그 */}
          <Flex justifyContent="space-between" alignItems="center" marginTop="0px">
            <Text fontSize="14px" color="gray.500">
              {updatedAt ? `${updatedAt} (updated)` : createdAt}
            </Text>
            {isNewPost && (
              <Box
                backgroundColor="blue.400"
                color="white"
                borderRadius="12px"
                padding="4px 8px"
                fontSize="12px"
                fontWeight="bold"
              >
                NEW POST
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default FeaturedPostCard;