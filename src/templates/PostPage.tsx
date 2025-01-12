import { Box, Flex, IconButton, useBreakpointValue, Icon, useColorMode } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { MdList, MdOutlineMenu } from "react-icons/md";

import Giscus from "../components/Giscus";
import Locales from "../components/Locales";
import PostContentTitle from "../components/PostContentTitle";
import PostLayout from "../components/PostLayout";
import Profile from "../components/Profile";
import RelatedPosts from "../components/RelatedPosts";
import TableOfContents from "../components/TableOfContents";
import { DOMAIN } from "../constants";

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
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null); // 아이콘 버튼을 참조
  const currentLocale = data.post?.frontmatter?.locale || "ko";
  const currentSlug = data.post?.frontmatter?.slug!;
  const isLargeScreen = useBreakpointValue({ base: false, "1.75xl": true });
  const iconSize = useBreakpointValue({ base: "6", md: "8" }); // base에서는 6px, md에서는 8px

  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const [TOC_MAX_WIDTH, setTocMaxWidth] = useState(300); // 기본값

  const {colorMode} = useColorMode();

  // 화면 너비 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 630); // 580px 이하에서 모바일 메뉴로 전환
    };

    // 초기 상태 설정
    handleResize();

    // 윈도우 크기 변경 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (tocRef.current &&
        !tocRef.current.contains(event.target as Node)) ||
        (buttonRef.current &&
        !buttonRef.current.contains(event.target as Node))
      ) {
        setIsTOCOpen(false);
      }
    };

    if (isTOCOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTOCOpen]);

  useEffect(() => {
    const handleTOCScroll = (event: WheelEvent) => {
      if (!tocRef.current) return;

      const toc = tocRef.current;
      const isScrollingInTOC =
        toc.contains(event.target as Node) &&
        toc.scrollHeight > toc.clientHeight;

      if (isScrollingInTOC) {
        // TOC 내부에서만 스크롤 허용
        const isAtTop = toc.scrollTop === 0;
        const isAtBottom =
          Math.ceil(toc.scrollTop + toc.clientHeight) >= toc.scrollHeight;

        if (isAtTop && event.deltaY < 0) {
          event.preventDefault();
        } else if (isAtBottom && event.deltaY > 0) {
          event.preventDefault();
        }
      }
    };

    if (isTOCOpen) {
      // TOC가 열렸을 때 wheel 이벤트 리스너 추가
      document.addEventListener("wheel", handleTOCScroll, { passive: false });
    }

    return () => {
      // TOC가 닫히면 wheel 이벤트 리스너 제거
      document.removeEventListener("wheel", handleTOCScroll);
    };
  }, [isTOCOpen]);

  return (
    <PostLayout tableOfContents={isLargeScreen ? data.post?.myTableOfContents : undefined}>
      <Flex direction="column" width="100%">
        {/* ContentTitle */}
        <PostContentTitle readingTime={pageContext.readingTime.text} post={data.post} />

        {/* 작은 화면에서 TOC 버튼과 Collapse */}
        {!isLargeScreen && data.post?.myTableOfContents && (
          <>
            {/* TOC 버튼 */}
            <motion.div
              initial={{ right: "0px" }}
              animate={{ right: isTOCOpen ? "0px" : "0px" }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                bottom: isMobile ? "40px" : "70px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >

              <IconButton
                aria-label="Toggle TOC"
                borderRadius="full"
                size="lg"
                right={{ base: "12px", sm: "15px", md: "30px" }}
                onClick={() => setIsTOCOpen(!isTOCOpen)}
                variant="ghost"
                _hover={{ bg: "transparent", color: "blue.400" }}
                _focus={{ boxShadow: "none", bg: "transparent" }}
                display={isTOCOpen ? "none" : "block"}
                icon={
                  <Flex alignItems="center" justifyContent="center">
                    {isTOCOpen ? (
                      <>
                        <ChevronRightIcon boxSize="20px" ml={-1} />
                        <Icon as={MdOutlineMenu} boxSize="24px" ml={-1} /> {/* React Icons의 List 아이콘 사용 */}
                      </>
                    ) : (
                      <>
                        <ChevronLeftIcon boxSize="20px" ml={-1} />
                        <Icon as={MdOutlineMenu} boxSize="24px" ml={-1} /> {/* React Icons의 List 아이콘 사용 */}
                      </>
                    )}
                  </Flex>
                }
              />
            </motion.div>

            {/* TOC 슬라이드 */}
            <motion.div
              initial={{ right: "-300px" }}
              animate={{ right: isTOCOpen ? "0px" : "-300px" }}
              transition={{ duration: 0.3 }}
              ref={tocRef} // ref 추가
              style={{
                position: "fixed",
                top: 0,
                height: "100vh",
                width: "300px",
                maxWidth: "80vw",
                zIndex: 10,
                overflowY: "auto", // 세로 스크롤 활성화
                overflowX: "hidden", // 가로 스크롤 숨김
              }}
            >
              <Box
                backgroundColor="white"
                boxShadow="md"
                position="relative"
                height="100%"
                width="300px"
                _dark={{
                  backgroundColor: "gray.800",
                }}
              >
                {/* Close 버튼 */}
                <IconButton
                  aria-label="Close TOC"
                  icon={<CloseIcon />}
                  position="absolute"
                  top="10px"
                  right="10px"
                  onClick={() => setIsTOCOpen(false)} // 닫기 버튼 동작
                  size="sm"
                  backgroundColor="transparent"
                  color="black"
                  _dark={{
                    color: "white",
                  }}
                />
                <Box
                  pt={"60px"}
                  pb={"20px"}
                  pl={"20px"}
                  width="300px"
                  backgroundColor="white"
                  _dark={{
                    backgroundColor: "gray.800",
                  }}
                >
                  <TableOfContents tableOfContents={data.post.myTableOfContents} />
                </Box>
              </Box>
            </motion.div>
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
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:url" content={`${DOMAIN}/posts/${data.post?.frontmatter?.slug}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      <meta property="og:locale" content={metaLocale} />
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