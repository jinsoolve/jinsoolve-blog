import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

import FeaturedPostCard from "./FeaturedPostCard";

interface FeaturedPostSectionProps {
  posts: GatsbyTypes.AllPostPageTemplateQuery["featuredPosts"]["nodes"];
  isLarge?: boolean; // boolean prop 추가 (optional)
}

const FeaturedPostSection = ({ posts, isLarge = false }: FeaturedPostSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  // 반응형으로 버튼 위치 조정
  const arrowPosition = useBreakpointValue({ base: "-30px", md: "-40px" });

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

  return (
    <Box
      // width={isLarge ? "90%" : "80%"} // boolean 값에 따라 width 변경
      width="90%"
      maxWidth={isLarge ? "1200px" : "660px"}
      mx="auto"
      py="20px"
      position="relative" // 버튼이 이 컨테이너 기준으로 배치됨
      margin="0px"
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
          paddingBottom: "16px",
          scrollbarColor: `${colorMode === "dark" ? "#555 transparent" : "#aaa transparent"}`, // 평소 투명
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: "6px",
            backgroundColor: "transparent", // 기본 투명
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent", // 기본 투명
            borderRadius: "4px",
            transition: "background-color 0.3s ease",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: colorMode === "dark" ? "#555" : "#aaa", // 마우스 호버 시 색상 활성화
          },
          "&:hover::-webkit-scrollbar": {
            backgroundColor: "transparent", // 마우스 호버 시 배경 활성화
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
        left={arrowPosition}
        onClick={() => handleScroll("left")}
        bg="inherit"             // 배경색 제거
        icon={<LeftArrowIcon />} // 아이콘 컴포넌트 사용
        width="30px"
        height="30px"
        p="0"
        minW="unset"
        minH="unset"
        _hover={{ color: "blue.500" }}  // 호버 시 아이콘 색상만 변경
        _active={{ bg: "inherit", transform: "none" }} // 클릭 반응 제거
        _focus={{ boxShadow: "none" }}                 // 포커스 반응 제거
      />
      <IconButton
        aria-label="Scroll Right"
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        right={arrowPosition} // 반응형으로 위치 조정
        onClick={() => handleScroll("right")}
        bg="inherit"
        icon={<RightArrowIcon />}
        width="36px"     // 버튼 크기 조정
        height="36px"    // 버튼 크기 조정
        p="0"            // 패딩 제거 (버튼 크기 최소화)
        minW="unset"     // 최소 너비 제거 (Chakra 기본값 무시)
        minH="unset"     // 최소 높이 제거 (Chakra 기본값 무시)
        _hover={{ color: "blue.500" }}  // 호버 시 아이콘 색상만 변경
        _active={{ bg: "inherit", transform: "none" }} // 클릭 반응 제거
        _focus={{ boxShadow: "none" }}                 // 포커스 반응 제거
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
      d="M15 6L9 12L15 20"
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