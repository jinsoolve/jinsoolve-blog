const path = require("path");
const readingTime = require(`reading-time`);

const PostPageTemplate = path.resolve(`./src/templates/PostPage.tsx`);
const TagPageTemplate = path.resolve(`./src/templates/TagPage.tsx`);
const CategoryPageTemplate = path.resolve(`./src/templates/CategoryPage.tsx`);
const FeaturedPageTemplate = path.resolve(`./src/templates/FeaturedPage.tsx`);
const PortfolioPageTemplate = path.resolve(`./src/templates/PortfolioPage.tsx`);
const AllPostPageTemplate = path.resolve(`./src/templates/AllPostPage.tsx`);
const AllFeaturedPostPageTemplate = path.resolve(`./src/templates/AllFeaturedPostPage.tsx`);
const AllCategoryPostPageTemplate = path.resolve(`./src/templates/AllCategoryPostPage.tsx`);
const AllTagPostPageTemplate = path.resolve(`./src/templates/AllTagPostPage.tsx`);

const WORDS_PER_MINUTE = 500;

exports.onCreateWebpackConfig = ({ actions, plugins, reporter }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        React: "react",
      }),
    ],
  });

  reporter.info(`Provided React in all files`);
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type MyTableOfContents {
      depth: Int
      title: String
      url: String
      items: [MyTableOfContents]
    }

    type Mdx implements Node {
      myTableOfContents: JSON
    }
  `);
};

exports.createResolvers = async ({ createResolvers }) => {
  const { unified } = await import("unified");
  const remarkParse = (await import("remark-parse")).default;
  const remarkSlug = (await import("remark-slug")).default;
  const { visit } = await import("unist-util-visit");

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // 공백 -> 하이픈
      .replace(/[^a-z0-9가-힣\-]+/g, ""); // 알파벳/숫자/한글/하이픈 외 제거

  createResolvers({
    Mdx: {
      myTableOfContents: {
        type: "JSON",
        resolve: async (source) => {
          const headers = [];
          const markdownContent = source.body;

          try {
            const katex = (await import("katex")).default; // 동적 import

            const processor = unified()
              .use(remarkParse) // Markdown을 AST로 변환
              .use(remarkSlug); // 기본 slug 지원

            const tree = processor.parse(markdownContent);

            visit(tree, "heading", (node) => {
              const text = node.children
                .map((child) => {
                  if (child.type === "inlineMath") {
                    // KaTeX 렌더링
                    return katex.renderToString(child.value, { throwOnError: false });
                  }
                  return child.value || "";
                })
                .join("");

              const id = slugify(text);

              if (id) {
                headers.push({
                  depth: node.depth,
                  title: text, // KaTeX 렌더링 결과를 포함한 텍스트
                  url: `#${id}`,
                });
              }
            });

            const buildHierarchy = (nodes, depth = 1) => {
              const result = [];
              while (nodes.length > 0) {
                const current = nodes[0];
                if (current.depth < depth) break;
                if (current.depth === depth) {
                  nodes.shift();
                  const children = buildHierarchy(nodes, depth + 1);
                  result.push({
                    depth: current.depth,
                    title: current.title,
                    url: current.url,
                    items: children.length > 0 ? children : undefined,
                  });
                } else {
                  break;
                }
              }
              return result;
            };

            const toc = buildHierarchy(headers);
            return { items: toc };
          } catch (error) {
            console.error("Error processing myTableOfContents:", error);
            return null;
          }
        },
      },
    },
  });
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      allPosts: allMdx(filter: { frontmatter: { title: { nin: ["김진수 포트폴리오", "김진수에 대하여"] } } }) {
        nodes {
          id
          body
          frontmatter {
            slug
            categories
            tags
            locale
          }
          internal {
            contentFilePath
          }
          myTableOfContents
        }
      }

      allFeaturedPosts: allMdx {
        group(field: { frontmatter: { categories: SELECT } }) {
          category: fieldValue
          nodes {
            id
          }
        }
      }

      allCategories: allMdx {
        group(field: { frontmatter: { categories: SELECT } }) {
          category: fieldValue
          nodes {
            id
          }
        }
      }

      allTags: allMdx {
        group(field: { frontmatter: { tags: SELECT } }) {
          tag: fieldValue
          nodes {
            id
          }
        }
      }

      portfolio: mdx(frontmatter: { title: { eq: "김진수 포트폴리오" } }) {
        id
        body
        frontmatter {
          slug
        }
        internal {
          contentFilePath
        }
      }

      about_me: mdx(frontmatter: { title: { eq: "김진수에 대하여" } }) {
        id
        body
        frontmatter {
          slug
        }
        internal {
          contentFilePath
        }
      }
    }
  `);

  // TODO: 현재 문제점
  // 메인(pages/index.tsx) 페이지랑 태그 템플릿 페이지가 역할이 겹침
  // Categories/all-posts로 만들고
  // 메인 페이지는 진짜 메인 느낌나도록 따로 만들까 고민중

  const POST_PER_PAGE = 10;

  // ALL POSTS 페이지네이션 생성
  const posts = result.data.allPosts.nodes;
  // ko로 작성된 혹은 locale이 없는 포스트만 뽑아서 페이지네이션 해줘야 함
  const koPosts = posts.filter((post) => !post.frontmatter.locale);

  const allPostsNumPages = Math.ceil(koPosts.length / POST_PER_PAGE);
  Array.from({ length: allPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: AllPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages: allPostsNumPages,
        currentPage: i + 1,
      },
    });
  });

  // allFeaturedPosts All Page
  Array.from({ length: allPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/allFeaturedPosts/` : `/allFeaturedPosts/${i + 1}`,
      component: AllFeaturedPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages: allPostsNumPages,
        currentPage: i + 1,
      },
    });
  });

  // Categories All Page
  Array.from({ length: allPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/categories/` : `/categories/${i + 1}`,
      component: AllCategoryPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages: allPostsNumPages,
        currentPage: i + 1,
      },
    });
  });

  // Tag All Page
  Array.from({ length: allPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/tags/` : `/tags/${i + 1}`,
      component: AllTagPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages: allPostsNumPages,
        currentPage: i + 1,
      },
    });
  });

  // allFeaturedPosts 페이지네이션 생성
  const allFeaturedPosts = result.data.allFeaturedPosts.group;
  allFeaturedPosts.forEach(({ category, nodes }) => {
    const allFeaturedPostsNumPages = Math.ceil(nodes.length / POST_PER_PAGE);

    Array.from({ length: allFeaturedPostsNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/allFeaturedPosts/${category}` : `/allFeaturedPosts/${category}/${i + 1}`,
        component: FeaturedPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numPages: allFeaturedPostsNumPages,
          currentPage: i + 1,
          category, // 수정된 부분
        },
      });
    });
  });

  // Categories 페이지네이션 생성
  const categories = result.data.allCategories.group;
  categories.forEach(({ category, nodes }) => {
    const allCategoriesNumPages = Math.ceil(nodes.length / POST_PER_PAGE);

    // 각 태그별로 페이지네이션 해줘야 함
    Array.from({ length: allCategoriesNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/categories/${category}` : `/categories/${category}/${i + 1}`,
        component: CategoryPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numPages: allCategoriesNumPages,
          currentPage: i + 1,
          category,
        },
      });
    });
  });

  // Tags 페이지네이션 생성
  const tags = result.data.allTags.group;
  tags.forEach(({ tag, nodes }) => {
    const allTagsNumPages = Math.ceil(nodes.length / POST_PER_PAGE);

    // 각 태그별로 페이지네이션 해줘야 함
    Array.from({ length: allTagsNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/tags/${tag}` : `/tags/${tag}/${i + 1}`,
        component: TagPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numPages: allTagsNumPages,
          currentPage: i + 1,
          tag,
        },
      });
    });
  });

  // 모든 포스트 페이지 생성
  result.data.allPosts.nodes.forEach((node) => {
    const locale = node.frontmatter.locale;
    const path = !locale
      ? `/posts/${node.frontmatter.slug}`
      : `/${locale}/posts/${node.frontmatter.slug}`;

    createPage({
      path,
      component: `${PostPageTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        categories: node.frontmatter.categories,
        tags: node.frontmatter.tags,
        slug: node.frontmatter.slug,
        id: node.id,
        myTableOfContents: node.myTableOfContents,
        readingTime: readingTime(node.body, { wordsPerMinute: WORDS_PER_MINUTE }),
      },
    });
  });

  // 포트폴리오 페이지 생성
  const portfolio = result.data.portfolio;

  createPage({
    path: `/portfolio`,
    component: `${PortfolioPageTemplate}?__contentFilePath=${portfolio.internal.contentFilePath}`,
    context: {
      slug: portfolio.frontmatter.slug,
      id: portfolio.id,
      readingTime: readingTime(result.data.portfolio.body, { wordsPerMinute: WORDS_PER_MINUTE }),
    },
  });

  // about 페이지 생성
  const about_me = result.data.about_me;

  createPage({
    path: `/about`,
    component: `${PortfolioPageTemplate}?__contentFilePath=${about_me.internal.contentFilePath}`,
    context: {
      slug: about_me.frontmatter.slug,
      id: about_me.id,
      readingTime: readingTime(result.data.about_me.body, { wordsPerMinute: WORDS_PER_MINUTE }),
    },
  });
};
