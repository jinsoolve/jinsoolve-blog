import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { GatsbyImage } from "gatsby-plugin-image";
import { useMemo, useState, useEffect, useRef } from "react";

import { koreanTagNames } from "../constants";
import { useColorModeValue } from "@chakra-ui/react";
import defaultThumbnailImage from "../assets/default-thumbnail.png"; // 기본 이미지 경로

interface PostCardProps {
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  categories: readonly (string | null)[];
  thumbnail?: IGatsbyImageData;
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
        const newHeight = width * 0.8; // 16:9 비율
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

const PostCard = ({
                    createdAt,
                    description,
                    slug,
                    categories,
                    thumbnail,
                    title,
                    updatedAt,
                  }: PostCardProps) => {
  const diffMs = useMemo(
    () => new Date().getTime() - new Date(createdAt).getTime(),
    [createdAt]
  );
  const isNewPost = useMemo(
    () => Math.floor(diffMs / (1000 * 60 * 60 * 24)) <= 10,
    [diffMs]
  );
  const [isHovered, setIsHovered] = useState(false);

  const boxShadowColor = useColorModeValue(
    "0 4px 6px rgba(0, 0, 0, 0.3)", // 라이트모드 음영
    "0 4px 6px rgba(255, 255, 255, 0.3)" // 다크모드 음영
  );

  return (
    <Link
      to={`/posts/${slug}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        as="article"
        transition="all 0.25s ease"
        position="relative"
        _hover={{ boxShadow: "lg", cursor: "pointer" }}
        borderRadius="20px"
        overflow="hidden"
        width="100%"
        height={{ base: "100%", sm: "280px", md: "316px" }}
        isolation="isolate"
        boxShadow={boxShadowColor}
      >
        {/* Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height={{ base: "100%", sm: "280px", md: "316px" }}
          backgroundColor={"blackAlpha.600"}
          zIndex={2}
          transition="opacity 0.25s ease"
          opacity={isHovered ? 1 : 0}
        >
          {/* Description */}
          <Flex
            position="absolute"
            bottom={0}
            left={0}
            margin="20px"
            direction="column"
            alignItems="start"
          >
            <Text fontSize={16} color="white" noOfLines={2}>
              {description}
            </Text>
          </Flex>
          {/* Right Top Arrow Icon */}
          <Center
            position="absolute"
            top={0}
            right={0}
            margin="20px"
            backgroundColor="white"
            borderRadius="50%"
            width="40px"
            height="40px"
          >
            <svg
              fill="#000000"
              width="30px"
              height="30px"
              viewBox="-6 -6.5 24 24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin"
            >
              <path d="M7.828 2.414H2.243a1 1 0 1 1 0-2h8a.997.997 0 0 1 1 1v8a1 1 0 0 1-2 0V3.828l-6.779 6.779A1 1 0 0 1 1.05 9.192l6.778-6.778z" />
            </svg>
          </Center>

          {/* Categories */}
          <Flex
            position="absolute"
            direction="column"
            left={0}
            top={0}
            margin="20px"
            gap="10px"
          >
            {categories?.map((category) => (
              <Box
                key={category}
                border="white 2px solid"
                borderRadius="20px"
                color="white"
                padding="10px"
                fontSize="14px"
                fontWeight="800"
                width="fit-content"
              >
                {koreanTagNames[category!] || category}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Image or Fallback Content */}
        <Box display="block" as="span" width="100%" height="100%" borderRadius={2}>
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

      {/* title + categories + new Post */}
      <Flex direction="column" alignItems="start">
        <Flex gap="10px" marginTop="16px">
          <Box
            color="black.900"
            borderColor="black.900"
            border="3px solid"
            borderRadius="20px"
            padding="8px"
            fontSize="14px"
            fontWeight="800"
            width="fit-content"
          >
            {updatedAt ? `${updatedAt} (updated)` : createdAt}
          </Box>

          {isNewPost && (
            <Box
              color="black.900"
              borderColor="black.900"
              border="3px solid"
              borderRadius="20px"
              padding="8px"
              fontSize="14px"
              fontWeight="800"
              width="fit-content"
              zIndex={1}
            >
              NEW POST
            </Box>
          )}
        </Flex>
        <Heading marginTop="10px" fontSize="24px" fontWeight="700">
          {title}
        </Heading>
      </Flex>
    </Link>
  );
};

export default PostCard;