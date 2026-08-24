import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";

import MainLayout from "../components/MainLayout";
import Pagenation from "../components/Pagenation";
import PostGrid from "../components/PostGrid";
import Profile from "../components/Profile";
import Categories from "../components/DefaultCategories";
import FeaturedPostSection from "../components/FeaturedPostSection";
import { Box, Flex, Container } from "@chakra-ui/react";
import { DOMAIN } from "../constants";
import ShortPostSection from "../components/ShortPostSection";

export const query = graphql`
  query FeaturedPageTemplate($category: String!, $limit: Int, $skip: Int) {
    allMdx(
      sort: { frontmatter: { createdAt: DESC } }
      filter: { frontmatter: { categories: { in: [$category] }, published: { ne: false }, locale: { eq: null } } }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        frontmatter {
          thumbnail {
            childImageSharp {
              gatsbyImageData(
                width: 290
                height: 171
                layout: CONSTRAINED
                sizes: "(max-width: 660px) 80vw, 290px"
                outputPixelDensities: [1, 2]
                transformOptions: { fit: COVER }
              )
            }
          }
          title
          updatedAt
          createdAt
          description
          slug
        }
        excerpt(pruneLength: 100)
      }

      pageInfo {
        currentPage
        pageCount
      }
    }
    ogimage: file(relativePath: { eq: "og-image.png" }) {
      publicURL
    }
    
     # locale은 null인것만 가져옴 (ko)
    shortPosts: allMdx(
      filter: { 
        frontmatter: { 
          categories: { in: [$category] },
          published: { ne: false }, 
          locale: { eq: null }
        }
      },
      sort: { frontmatter: { createdAt: DESC } }
      limit: 15
    ) {
      nodes {
        frontmatter {
          title
          createdAt
          slug
          categories
        }
      }
    }

    featuredPosts: allMdx(
      filter: { frontmatter: { categories: { in: [$category] }, published: { ne: false }, featured: { eq: true }, locale: { eq: null } } }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        frontmatter {
          thumbnail {
            childImageSharp {
              gatsbyImageData(
                width: 290
                height: 171
                layout: CONSTRAINED
                sizes: "(max-width: 660px) 80vw, 290px"
                outputPixelDensities: [1, 2]
                transformOptions: { fit: COVER }
              )
            }
          }
          title
          updatedAt
          createdAt
          description
          slug
        }
        excerpt(pruneLength: 100)
      }
    }
  }
`;

interface CategoriesProps {
  pageContext: {
    category: string;
  };
  data: Queries.FeaturedPageTemplateQuery;
}

export default function CategoriesTemplate({ pageContext, data }: CategoriesProps) {
  const currentPage = data.allMdx.pageInfo.currentPage;
  const pageCount = data.allMdx.pageInfo.pageCount;
  const featuredPosts = data.featuredPosts.nodes;
  const shortPosts = data.shortPosts.nodes.filter((post) => {
    const categories = post.frontmatter?.categories;
    return Boolean(
      categories?.includes(pageContext.category) &&
      categories.includes("short"),
    );
  });
  const baseUrl = "/allFeaturedPosts/" + pageContext.category;
  const isLarge = shortPosts.length == 0;

  return (
    <MainLayout>
      <Categories currentCategory={pageContext.category} />

      {featuredPosts.length > 0 && (
        <Flex
          width="100%"
          maxWidth={{ base: "85%", md: "800px", lg: "85%", xl: "100%" }}
          direction={{ base: "column", lg: "row" }}
          justifyContent="center"
          alignItems={{ base: "center", lg: "flex-start" }}  // 좁을 때 중앙정렬
          marginTop="40px"
          gap={{ base: "20px", lg: "60px" }}
        >
          <FeaturedPostSection posts={featuredPosts} isLarge={isLarge} />
          {shortPosts.length > 0 && (
            <ShortPostSection posts={shortPosts} isLarge />
          )}
        </Flex>
      )}

      {pageContext.category !== "short" && featuredPosts.length == 0 && shortPosts.length > 0 && (
        <Flex
          width="100%"
          maxWidth={{ base: "95%", md: "800px", lg: "85%" }}
          direction={{ base: "column", lg: "row" }}
          justifyContent="center"
          alignItems={{ base: "center", lg: "flex-start" }}  // 좁을 때 중앙정렬
          marginTop="40px"
          gap={{ base: "20px", lg: "60px" }}
        >
          <ShortPostSection posts={shortPosts} isLarge />
        </Flex>
      )}

      <PostGrid posts={data.allMdx.nodes} />
      {pageCount > 1 && (
        <Pagenation currentPage={currentPage} pageCount={pageCount} baseUrl={baseUrl} />
      )}
      <Profile />
    </MainLayout>
  );
}

export const Head: HeadFC<Queries.CategoryPageTemplateQuery, CategoriesProps["pageContext"]> = ({
                                                                                                  data,
                                                                                                  pageContext,
                                                                                                }) => {
  const ogimage = data.ogimage?.publicURL ?? undefined;
  const description = "머신러닝과 알고리즘을 공부하는 김진수입니다.";
  const title = "Jinsoolve 블로그";
  const category = pageContext.category;

  return (
    <>
      {/* HTML Meta categories */}
      <title>
        {title} - {category}
      </title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Facebook Meta categories */}
      <meta property="og:url" content={DOMAIN} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogimage} />
      {/*  Twitter Meta categories  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={DOMAIN} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogimage} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content={category} />
    </>
  );
};
