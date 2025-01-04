import { Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "gatsby";

interface ShortPostSectionProps {
  posts: GatsbyTypes.AllPostPageTemplateQuery["shortPosts"]["nodes"];
}

const ShortPostSection = ({ posts }: ShortPostSectionProps) => {
  return (
    <Flex
      marginTop={{ base: "100px", lg: "0px" }}
      marginLeft={{ base: "18vw", md: "150px", lg: "0px" }}
      width={{ base: "100%", lg: "240px" }}
      direction="column"
      alignSelf={{ base: "center", lg: "flex-start" }} // 좁을 때만 중앙정렬
    >
      <Heading fontStyle="italic" _hover={{ textDecoration: "underline" }}>
        <Link to="/categories/short">Shorts.</Link>
      </Heading>
      <Flex
        direction="column"
        as="ul"
        maxHeight="570px"
        overflowY="auto"
        overscrollBehavior="contain"
        marginTop="20px"
        gap={{ base: "10px", lg: "20px" }}
      >
        {posts.map((post) => (
          <Link to={`/posts/${post.frontmatter?.slug!}`} key={post.frontmatter?.slug!}>
            <Flex direction="column" as="li" _hover={{ textDecoration: "underline" }}>
              <Text fontSize="12px" opacity={0.6}>
                {post.frontmatter?.createdAt}
              </Text>
              <Text fontSize="14px">{post.frontmatter?.title}</Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default ShortPostSection;
