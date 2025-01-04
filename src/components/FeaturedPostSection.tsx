import { Box, Flex, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

import FeaturedPostCard from "./FeaturedPostCard";

interface FeaturedPostSectionProps {
  posts: GatsbyTypes.AllPostPageTemplateQuery["featuredPosts"]["nodes"];
}

const FeaturedPostSection = ({ posts }: FeaturedPostSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mouseNearLeft, setMouseNearLeft] = useState(false);
  const [mouseNearRight, setMouseNearRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.offsetWidth;
    const newScrollPosition =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setScrollPosition(newScrollPosition);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX;

    // 좌측 버튼 범위 (왼쪽 끝으로부터 50px 이내)
    if (mouseX - containerRect.left < 50) {
      setMouseNearLeft(true);
    } else {
      setMouseNearLeft(false);
    }

    // 우측 버튼 범위 (오른쪽 끝으로부터 50px 이내)
    if (containerRect.right - mouseX < 50) {
      setMouseNearRight(true);
    } else {
      setMouseNearRight(false);
    }
  };

  const { colorMode } = useColorMode()

  return (
    <Box
      width="80%"
      maxWidth="1200px"
      mx="auto"
      py="20px"
      position="relative" // 버튼이 이 컨테이너 기준으로 배치됨
    >
      {/* Heading 위치 조정 */}
      <Heading fontStyle="italic" marginBottom="20px" marginTop="-20px">
        Featured.
      </Heading>

      {/* 콘텐츠 영역 */}
      <Box
        ref={scrollContainerRef}
        display="flex"
        overflowX="auto"
        scrollSnapType="x mandatory"
        scrollBehavior="smooth"
        gap="20px"
        css={{
          paddingBottom: "12px",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colorMode === "dark" ? "#555" : "#aaa", // 다크모드와 라이트모드 색상 설정
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: colorMode === "dark" ? "#aaa" : "gray", // 다크모드와 라이트모드 색상 설정
          },
        }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.frontmatter?.slug!}
            style={{
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              width: "300px",
            }}
          >
            <FeaturedPostCard
              createdAt={post.frontmatter?.createdAt!}
              description={post.frontmatter?.description!}
              title={post.frontmatter?.title!}
              slug={post.frontmatter?.slug!}
              updatedAt={post.frontmatter?.updatedAt!}
              categories={post.frontmatter?.categories!}
              thumbnail={
                post.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!
              }
            />
          </motion.div>
        ))}
      </Box>

      {/* 좌우 화살표 버튼 */}
      <IconButton
        aria-label="Scroll Left"
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        left="-50px" // 콘텐츠 왼쪽 바깥쪽으로 배치
        zIndex={9999}
        onClick={() => handleScroll("left")}
        icon={<LeftArrowIcon />}
      />
      <IconButton
        aria-label="Scroll Right"
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        right="-50px" // 콘텐츠 오른쪽 바깥쪽으로 배치
        zIndex={9999}
        onClick={() => handleScroll("right")}
        icon={<RightArrowIcon />}
      />
    </Box>
  );
};

const LeftArrowIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6L9 12L15 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrowIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FeaturedPostSection;