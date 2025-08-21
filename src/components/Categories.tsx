import { Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { graphql, Link, useStaticQuery } from "gatsby";

import { ALL_POSTS_CATEGORY_NAME, koreanTagNames } from "../constants";
import { convertSlugToTitle } from "../utils/string";

interface CategoriesProps {
  currentCategory: string;
}

export default function categories({ currentCategory }: CategoriesProps) {
  const data = useStaticQuery(graphql`
    query categories {
      allMdx(
        filter: { frontmatter: { title: { nin: ["김진수 포트폴리오", "About Me"] }, published: { ne: false }, locale: { eq: null } } }
      ) {
        group(field: { frontmatter: { categories: SELECT } }) {
          categoryPostCount: totalCount
          category: fieldValue
        }
        allPostCount: totalCount
      }
    }
  `);

  const currentCategoryPostCount = data.allMdx.group.find(
    (group: { category: string; categoryPostCount: number }) => group.category === currentCategory,
  )?.categoryPostCount;

  return (
    <Flex marginTop="80px" direction="column" width="100%" alignItems="center">
      {/* Title + Count */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <Heading
          fontStyle="italic"
          fontSize={{ base: currentCategory === ALL_POSTS_CATEGORY_NAME ? "40px" : "30px", md: "60px" }}
          fontWeight="800"
          letterSpacing={-1.5}
        >
          {convertSlugToTitle(currentCategory)}.
        </Heading>
        <Text
          fontSize={{ base: "12px", md: "16px" }}
          fontStyle="italic"
          color="gray.500"
          fontWeight="200"
        >
          ({currentCategory === ALL_POSTS_CATEGORY_NAME ? data.allMdx.allPostCount : currentCategoryPostCount})
        </Text>
      </motion.div>

      {/* category List */}
      <Flex direction="column">
        <Flex
          as="nav"
          columnGap="10px"
          rowGap="10px"
          flexWrap="wrap"
          marginTop="40px"
          padding={{ base: "0 20px", md: "0px" }}
          width="100%"
          maxWidth="600px"
          justifyContent="center"
        >
          <Link to="/">
            <Flex justifyContent="center" alignItems="flex-start">
              <Text
                fontSize={{ base: "14px", md: "18px" }}
                fontWeight={currentCategory === ALL_POSTS_CATEGORY_NAME ? 700 : 400}
                _hover={{ textDecoration: "underline" }}
              >
                ALL CATEGORIES.
              </Text>
              <Text fontSize="12px" fontWeight={currentCategory === ALL_POSTS_CATEGORY_NAME ? 700 : 300}>
                ({data.allMdx.allPostCount})
              </Text>
            </Flex>
          </Link>
        </Flex>
        <Flex
          as="nav"
          columnGap="10px"
          rowGap="10px"
          flexWrap="wrap"
          marginTop="10px"
          padding={{ base: "0 20px", md: "0px" }}
          width="100%"
          maxWidth="600px"
          justifyContent="center"
        >
          {Object.values(data.allMdx.group).map((group) => {
            const { category, categoryPostCount } = group as {
              category: string;
              categoryPostCount: number;
            };
            return (
              <Link key={category} to={`/categories/${category}`}>
                <Flex justifyContent="center" alignItems="flex-start">
                  <Text
                    fontSize={{ base: "14px", md: "18px" }}
                    fontWeight={currentCategory === category ? 700 : 400}
                    _hover={{ textDecoration: "underline" }}
                  >
                    {koreanTagNames[category!] || category}
                  </Text>
                  <Text fontSize="12px" fontWeight={currentCategory === category ? 700 : 300}>
                    ({categoryPostCount})
                  </Text>
                </Flex>
              </Link>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}
