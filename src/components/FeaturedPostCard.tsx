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

  const ResponsiveBox = ({ title }: { title: string }) => {
    const [fontSize, setFontSize] = useState(40);
    const [paddingY, setPaddingY] = useState<string>("10%");
    const [paddingX, setPaddingX] = useState<string>("7%");
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | undefined>();
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []);

    useEffect(() => {
      const resizeBox = () => {
        if (boxRef.current && windowWidth !== null) {
          const { width } = boxRef.current.getBoundingClientRect();
          const newHeight = width * 1.2; // 16:9 비율
          setHeight(newHeight);

          const adjustedFontSize = Math.min((width / title.length) * 1.75, newHeight / 1.5);
          setFontSize(Math.max(20, Math.min(adjustedFontSize, 60))); // 최소 20, 최대 60
        }
      };

      resizeBox(); // 초기 크기 설정
    }, [windowWidth, title]); // 종속성에 hover 관련 상태 제외

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
        padding={`${paddingY} ${paddingX}`}
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
          height="55%"
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
          <Flex justifyContent="space-between" alignItems="center" marginTop="10px">
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