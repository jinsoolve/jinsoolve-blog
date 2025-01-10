import { Box, Flex, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React, { useState, useRef } from "react";

import Giscus from "../components/Giscus";
import Locales from "../components/Locales";
import PostContentTitle from "../components/PostContentTitle";
import PostLayout from "../components/PostLayout";
import Profile from "../components/Profile";
import RelatedPosts from "../components/RelatedPosts";
import TableOfContents from "../components/TableOfContents";
import { DOMAIN } from "../constants";
import { useBreakpointValue } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

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
  const [isTOCVisible, setTOCVisible] = useState(false); // TOC 표시 여부 상태
  const locales = data.otherLocalePost.nodes.map((node) => node.frontmatter?.locale || "ko");
  const currentLocale = data.post?.frontmatter?.locale || "ko";
  const currentSlug = data.post?.frontmatter?.slug!;
  const isLargeScreen = useBreakpointValue({ base: false, "1.75xl": true });

  const startX = useRef<number | null>(null);


  // 드래그 시작
  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
  };

  // 드래그 종료 및 동작
  const handleDragEnd = (event: React.MouseEvent | React.TouchEvent) => {
    if (startX.current === null) return;

    const clientX =
      "touches" in event ? event.changedTouches[0].clientX : event.clientX;
    const offset = clientX - startX.current;

    if (offset < -50) {
      setTOCVisible(true); // 왼쪽으로 드래그하면 TOC 표시
    } else if (offset > 50) {
      setTOCVisible(false); // 오른쪽으로 드래그하면 TOC 숨김
    }

    startX.current = null; // 초기화
  };

  return (
    <PostLayout>
      <Flex direction="column" width="100%">
        {/* ContentTitle */}
        <PostContentTitle readingTime={pageContext.readingTime.text} post={data.post} />

        {/* 작은 화면에서만 ContentTitle 아래 TOC 렌더링 */}
        {!isLargeScreen && data.post?.myTableOfContents && (
          <Box as="nav" marginTop="40px">
            <TableOfContents tableOfContents={data.post.myTableOfContents} />
          </Box>
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

        {/* TOC 드래그로 표시 */}
        <>
          {/* TOC 컴포넌트 */}
          <MotionBox
            drag="x"
            dragConstraints={{ left: -300, right: 0 }} // 드래그 범위 제한
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ x: isTOCVisible ? 0 : "100%" }}
            animate={{ x: isTOCVisible ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            position="fixed"
            top={0}
            right={0}
            width="300px"
            height="100vh"
            bg="gray.100"
            boxShadow="lg"
            zIndex={100}
            padding="20px"
          >
            <Box> {/* 여기에서 TOC 내용을 렌더링 */}
              <TableOfContents tableOfContents={data.post?.myTableOfContents} />
            </Box>
          </MotionBox>

          {/* 드래그 감지 및 아이콘 버튼 */}
          <Box
            position="fixed"
            top="50%"
            right={isTOCVisible ? "300px" : "0"} // TOC 위치에 따라 버튼 이동
            transform="translateY(-50%)"
            zIndex={101}
          >
            <IconButton
              icon={isTOCVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              aria-label="Toggle TOC"
              onClick={() => setTOCVisible(!isTOCVisible)} // 버튼 클릭으로 열고 닫기
              size="lg"
              borderRadius="full"
              bg="gray.200"
              _hover={{ bg: "gray.300" }}
              onMouseDown={handleDragStart} // 드래그 지원
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
            />
          </Box>
        </>
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

      {/*  Twitter Meta categories  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={`${DOMAIN}/posts/${data.post?.frontmatter?.slug}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)}></meta>
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