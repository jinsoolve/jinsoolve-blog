import { Box, Center, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { useMemo, useState, useEffect, useRef } from "react";

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
          const newHeight = width * 0.95; // 16:9 비율
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
    <Link
      to={`/posts/${slug}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        as="article"
        position="relative"
        borderRadius="20px"
        overflow="hidden"
        width="100%"
        height={{ base: "100%", sm: "380px", md: "480px" }}
        transition="box-shadow 0.25s ease"
        boxShadow={boxShadowColor}
        _hover={{ boxShadow: "lg", cursor: "pointer" }}
      >
        {/* Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          backgroundColor="blackAlpha.600"
          zIndex={2}
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.25s ease"
        >
          {/* Description */}
          <Flex position="absolute" bottom={4} left={4} color="white" direction="column">
            <Text fontSize={16} noOfLines={2}>
              {description}
            </Text>
          </Flex>

          {/* Categories */}
          <Flex position="absolute" top={4} left={4} gap={2}>
            {categories?.map((category) => (
              <Box
                key={category}
                border="2px solid white"
                borderRadius="20px"
                padding="5px 10px"
                fontSize="14px"
                fontWeight="800"
                color="white"
              >
                {koreanTagNames[category!] || category}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Thumbnail or Fallback */}
        <Box width="100%" height="100%">
          {thumbnail ? (
            <GatsbyImage
              objectFit="cover"
              style={{ height: "100%", width: "100%" }}
              image={thumbnail}
              alt={`${slug} cover image`}
            />
          ) : (
            <ResponsiveBox title={title} />
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Flex direction="column" alignItems="start" marginTop={4}>
        <Flex gap={2}>
          <Box
            border="3px solid"
            borderRadius="20px"
            padding="8px"
            fontSize="14px"
            fontWeight="800"
          >
            {updatedAt ? `${updatedAt} (updated)` : createdAt}
          </Box>
          <Box
            border="3px solid"
            borderRadius="20px"
            padding="8px"
            fontSize="14px"
            fontWeight="800"
          >
            FEATURED POST
          </Box>
          {isNewPost && (
            <Box
              border="3px solid"
              borderRadius="20px"
              padding="8px"
              fontSize="14px"
              fontWeight="800"
            >
              NEW POST
            </Box>
          )}
        </Flex>
        <Heading marginTop={2} fontSize="24px" fontWeight="700">
          {title}
        </Heading>
      </Flex>
    </Link>
  );
};

export default FeaturedPostCard;