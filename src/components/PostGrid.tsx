import { Grid, GridItem } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { fadeInFromLeft } from "../framer-motions";
import PostCard from "./PostCard";

interface PostGridProps {
  posts: GatsbyTypes.AllPostPageTemplateQuery["allMdx"]["nodes"];
}

const PostGrid = ({ posts }: PostGridProps) => {
  return (
    <motion.div {...fadeInFromLeft}>
      <Grid
        as="section"
        templateColumns={{ sm_md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        maxWidth={{ base: "95%", md: "600px", lg: "100%" }}
        margin={{ base: "120px auto" }}
        gap={6}
        rowGap={10}
        justifyContent="center"
      >
        {posts.map((posts) => {
          const cardData = {
            title: posts.frontmatter?.title!,
            description: posts.frontmatter?.description!,
            slug: posts.frontmatter?.slug!,
            thumbnail: posts.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!,
            createdAt: posts.frontmatter?.createdAt!,
            updatedAt: posts.frontmatter?.updatedAt!,
            categories: posts.frontmatter?.categories!,
            excerpt: posts.excerpt!,
          };

          return (
            <GridItem colSpan={{ lg: 1 }} key={posts.frontmatter?.slug} as="article">
              <PostCard {...cardData} />
            </GridItem>
          );
        })}
      </Grid>
    </motion.div>
  );
};

export default PostGrid;
