import { useBreakpointValue, Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import Giscus from "../components/Giscus";
import PostContentTitle from "../components/PostContentTitle";
import PostLayout from "../components/PostLayout";
import Profile from "../components/Profile";
import TableOfContents from "../components/TableOfContents";
import { DOMAIN } from "../constants";
import { fadeInFromLeft } from "../framer-motions";

export const query = graphql`
  query PortfolioPage($id: String!) {
    post: mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
        description
        createdAt
        updatedAt
        categories
        locale
        thumbnail {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      tableOfContents
    }
  }
`;

interface PortfolioTemplateProps {
  children: React.ReactNode;
  data: GatsbyTypes.PortfolioPageQuery;
  pageContext: {
    readingTime: {
      minutes: number;
      text: string;
      time: number;
      words: number;
    };
  };
}

const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({ children, data, pageContext }) => {
  const isLargeScreen = useBreakpointValue({ base: false, "1.75xl": true });

  return (
    <PostLayout tableOfContents={isLargeScreen ? data.post?.tableOfContents : undefined}>
      <motion.article style={{ width: "100%" }} {...fadeInFromLeft}>
        <Flex direction="column" width="100%">
          {/* 제목 */}
          <PostContentTitle
            readingTime={pageContext.readingTime.text}
            post={data.post}
            showThumbnail={false}
          />

          {/* 작은 화면에서 ContentTitle 아래 TOC 표시 */}
          {!isLargeScreen && data.post?.tableOfContents && (
            <Box as="nav" marginTop="40px">
              <TableOfContents tableOfContents={data.post.tableOfContents} />
            </Box>
          )}

          {/* 본문 */}
          <Box
            marginTop="50px"
            sx={{
              img: {
                borderRadius: "10px", // 모든 img 태그에 borderRadius 적용
              },
            }}
          >
            {children}
          </Box>

          {/* 프로필 & 댓글 */}
          <Profile />
          <Giscus />
        </Flex>
      </motion.article>
    </PostLayout>
  );
};

export const Head: HeadFC<GatsbyTypes.PortfolioPageQuery> = ({ data }) => {
  const title = `${data.post?.frontmatter?.title!} - Jinsoolve 블로그`;
  const description = data.post?.frontmatter?.description!;
  const ogimage = data.post?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!;
  const metaLocale = "ko_KR";
  const devCategory = "개발";

  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:url" content={`${DOMAIN}/${data.post?.frontmatter?.slug}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      <meta property="og:locale" content={metaLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={`${DOMAIN}/${data.post?.frontmatter?.slug}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content={`${devCategory}`} />
      <meta
        name="article:published_time"
        content={`${data.post?.frontmatter?.createdAt?.replace(/[/]/g, "-")}T09:00:00.000Z`}
      />
    </>
  );
};

export default PortfolioTemplate;