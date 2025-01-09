// @refresh reset
import { Box, Flex, Button, Collapse, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import Giscus from "../components/Giscus";
import Locales from "../components/Locales";
import PostContentTitle from "../components/PostContentTitle";
import PostLayout from "../components/PostLayout";
import Profile from "../components/Profile";
import RelatedPosts from "../components/RelatedPosts";
import TableOfContents from "../components/TableOfContents";
import { DOMAIN } from "../constants";
import { fadeInFromLeft } from "../framer-motions";

import { useBreakpointValue } from "@chakra-ui/react";

export const query = graphql`
  query PostPage($id: String!, $categories: [String!]!, $slug: String!) {
    post: mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
        locale
        description
        categories
        tags
        createdAt
        updatedAt
        thumbnail {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      myTableOfContents
    }
    otherLocalePost: allMdx(filter: { frontmatter: { slug: { eq: $slug } } }) {
      nodes {
        frontmatter {
          locale
        }
      }
    }
    relatedPosts: allMdx(
      filter: { frontmatter: { categories: { in: $categories }, locale: { eq: null } }, id: { ne: $id } }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        frontmatter {
          slug
          title
          description
          categories
          tags
          createdAt
          updatedAt
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
`;

interface PostTemplateProps {
  children: React.ReactNode;
  data: GatsbyTypes.PostPageQuery;
  pageContext: {
    readingTime: {
      minutes: number;
      text: string;
      time: number;
      words: number;
    };
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ children, data, pageContext }) => {
  const locales = data.otherLocalePost.nodes.map((node) => node.frontmatter?.locale || "ko");
  const currentLocale = data.post?.frontmatter?.locale || "ko";
  const currentSlug = data.post?.frontmatter?.slug!;
  const isLargeScreen = useBreakpointValue({ base: false, "1.75xl": true });
  const [isTOCOpen, setIsTOCOpen] = useState(false);

  return (
    <PostLayout tableOfContents={isLargeScreen ? data.post?.myTableOfContents : undefined}>
      <Flex direction="column" width="100%">
        {/* ContentTitle */}
        <PostContentTitle readingTime={pageContext.readingTime.text} post={data.post} />

        {/* 작은 화면에서 TOC 버튼과 Collapse */}
        {!isLargeScreen && data.post?.myTableOfContents && (
          <>
            {/* 우측 상단 고정 아이콘 버튼 */}
            <IconButton
              aria-label="Toggle TOC"
              icon={<ChevronLeftIcon boxSize={6} />}
              position="fixed"
              top="50%"
              right="0"
              transform="translateY(-50%)"
              borderRadius="full"
              zIndex="20"
              onClick={() => setIsTOCOpen(!isTOCOpen)}
            />

            {/* TOC 슬라이드 애니메이션 */}
            <Box
              position="fixed"
              top="0"
              right={isTOCOpen ? "0" : "-300px"}
              height="100vh"
              width="300px"
              bg="gray.800"
              boxShadow="md"
              transition="right 0.3s ease-in-out"
              zIndex="10"
              padding="20px"
            >
              <TableOfContents tableOfContents={data.post.myTableOfContents} />
              <Button mt="20px" onClick={() => setIsTOCOpen(false)}>
                Close TOC
              </Button>
            </Box>
          </>
        )}


        {/* 다국어 지원 */}
        {locales.length > 1 && (
          <Locales currentSlug={currentSlug} locales={locales} currentLocale={currentLocale} />
        )}

        {/* 본문 */}
        <Box
          marginTop="40px"
          sx={{
            img: {
              borderRadius: "10px",
            },
          }}
        >
          {children}
        </Box>

        {/* 관련 글, 프로필, 댓글 */}
        <RelatedPosts relatedPosts={data.relatedPosts} />
        <Profile />
        <Giscus />
      </Flex>
    </PostLayout>
  );
};

export const Head: HeadFC<Queries.PostPageQuery> = ({ data }) => {
  const locale = data.post?.frontmatter?.locale! || "ko";
  const title =
    locale === "ko"
      ? `${data.post?.frontmatter?.title!} - Jinsoolve 블로그`
      : `${data.post?.frontmatter?.title!} - Jinsoolve Blog`;
  const description = data.post?.frontmatter?.description!;
  const ogimage = data.post?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!;
  const metaLocale = locale === "ko" ? "ko_KR" : "en_US";
  const devCategory = locale === "ko" ? "개발" : "Development";

  return (
    <>
      {/* HTML Meta categories */}
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Facebook Meta categories */}
      <meta property="og:url" content={`${DOMAIN}/posts/${data.post?.frontmatter?.slug}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      <meta property="og:locale" content={metaLocale} />

      {/* Twitter Meta categories */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={`${DOMAIN}/posts/${data.post?.frontmatter?.slug}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content={`${devCategory} | ${data.post?.frontmatter?.categories![0]}`} />
      <meta
        name="article:published_time"
        content={`${data.post?.frontmatter?.createdAt?.replace(/[/]/g, "-")}T09:00:00.000Z`}
      />
    </>
  );
};

export default PostTemplate;