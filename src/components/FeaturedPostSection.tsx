import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

import FeaturedPostCard from "./FeaturedPostCard";

interface FeaturedPostSectionProps {
  posts: GatsbyTypes.AllPostPageTemplateQuery["featuredPosts"]["nodes"];
}

const FeaturedPostSection = ({ posts }: FeaturedPostSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <Box width="80%" maxWidth="1200px" mx="auto" py="20px" position="relative">
      <Flex justifyContent="space-between" alignItems="center" mb="20px">
        <Heading fontStyle="italic">Featured.</Heading>
      </Flex>

      <Box
        ref={scrollContainerRef}
        display="flex"
        overflowX="auto"
        scrollSnapType="x mandatory"
        scrollBehavior="smooth"
        gap="20px"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
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
              thumbnail={post.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!}
            />
          </motion.div>
        ))}
      </Box>

      {/* Navigation Buttons */}
      <IconButton
        aria-label="Scroll Left"
        position="absolute"
        top="50%"
        left="10px"
        transform="translateY(-50%)"
        zIndex={1}
        onClick={() => handleScroll("left")}
        icon={<LeftArrowIcon />}
      />
      <IconButton
        aria-label="Scroll Right"
        position="absolute"
        top="50%"
        right="10px"
        transform="translateY(-50%)"
        zIndex={1}
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