import { Flex } from "@chakra-ui/react";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import FeaturedPostSection from "../components/FeaturedPostSection";
import MainLayout from "../components/MainLayout";
import Pagenation from "../components/Pagenation";
import PostGrid from "../components/PostGrid";
import Profile from "../components/Profile";
import ShortPostSection from "../components/ShortPostSection";
import Categories from "../components/Categories";
import { ALL_POSTS_CATEGORY_NAME, DOMAIN } from "../constants";

export const query = graphql`
  fragment MdxContent on Mdx {
    frontmatter {
      thumbnail {
        childImageSharp {
          gatsbyImageData
        }
      }
      title
      updatedAt
      createdAt
      description
      slug
      categories
      tags
    }
  }

  query AllPostPageTemplate($limit: Int, $skip: Int) {
    # locale은 null인것만 가져옴 (ko)
    allMdx(
      filter: {
        frontmatter: {
          title: { nin: ["김진수 포트폴리오", "김진수에 대하여"] }
          categories: { nin: "short" }
          locale: { eq: null }
        }
      }
      sort: { frontmatter: { createdAt: DESC } }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      nodes {
        ...MdxContent
      }

      pageInfo {
        currentPage
        pageCount
      }
    }

    ogimage: imageSharp(fluid: { originalName: { eq: "og-image.png" } }) {
      gatsbyImageData
    }

    profileImage: imageSharp(fluid: { originalName: { eq: "profile.png" } }) {
      gatsbyImageData
    }

    # locale은 null인것만 가져옴 (ko)
    shortPosts: allMdx(
      filter: { frontmatter: { categories: { in: "short" }, locale: { eq: null } } }
      sort: { frontmatter: { createdAt: DESC } }
      limit: 15
    ) {
      nodes {
        frontmatter {
          title
          updatedAt
          createdAt
          slug
          tags
        }
      }
    }

    # locale은 null인것만 가져옴 (ko)
    featuredPosts: allMdx(
      filter: { frontmatter: { featured: { eq: true }, locale: { eq: null } } }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        ...MdxContent
      }
    }
  }
`;

interface AllPostPageTemplateProps {
  data: GatsbyTypes.AllPostPageTemplateQuery;
}

export default function AllPostPageTemplate({ data }: AllPostPageTemplateProps) {
  const currentPage = data.allMdx.pageInfo.currentPage;
  const pageCount = data.allMdx.pageInfo.pageCount;
  const featuredPosts = data.featuredPosts.nodes;
  const shortPosts = data.shortPosts.nodes;

  return (
    <MainLayout>
      <Categories currentCategory={ALL_POSTS_CATEGORY_NAME} />

      {/*<Flex*/}
      {/*  width="100%"*/}
      {/*  maxWidth={{ base: "95%", md: "600px", lg: "100%" }}*/}
      {/*  direction={{ base: "column", lg: "row" }}*/}
      {/*  marginTop="40px"*/}
      {/*  gap={{ base: "20px", lg: "60px" }}*/}
      {/*>*/}
      {/*  <FeaturedPostSection posts={featuredPosts} />*/}
      {/*  <ShortPostSection posts={shortPosts} />*/}
      {/*</Flex>*/}

      <PostGrid posts={data.allMdx.nodes} />
      {pageCount > 1 && <Pagenation currentPage={currentPage} pageCount={pageCount} />}
      <Profile />
    </MainLayout>
  );
}

export const Head: HeadFC<Queries.AllPostPageTemplateQuery> = ({ data }) => {
  const ogimage = data.ogimage?.gatsbyImageData!;
  const description = "머신러닝과 알고리즘을 공부하는 김진수 입니다.";
  const title = "Jinsoolve 블로그";

  return (
    <>
      {/* HTML Meta categories */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Facebook Meta categories */}
      <meta property="og:url" content={DOMAIN} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      {/*  Twitter Meta categories  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="junghyeonsu.com" />
      <meta property="twitter:url" content={DOMAIN} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
