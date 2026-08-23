const path = require("path");
const { createContentMetadata } = require("./gatsby/content-metadata");
const {
  getPostPath,
  publicKoPostFilter,
  publicPostFilter,
} = require("./gatsby/content-policy");

const PostPageTemplate = path.resolve(`./src/templates/PostPage.tsx`);
const TagPageTemplate = path.resolve(`./src/templates/TagPage.tsx`);
const CategoryPageTemplate = path.resolve(`./src/templates/CategoryPage.tsx`);
const FeaturedPageTemplate = path.resolve(`./src/templates/FeaturedPage.tsx`);
const PortfolioPageTemplate = path.resolve(`./src/templates/PortfolioPage.tsx`);
const AllPostPageTemplate = path.resolve(`./src/templates/AllPostPage.tsx`);
const AllFeaturedPostPageTemplate = path.resolve(
  `./src/templates/AllFeaturedPostPage.tsx`
);
const AllCategoryPostPageTemplate = path.resolve(
  `./src/templates/AllCategoryPostPage.tsx`
);
const AllTagPostPageTemplate = path.resolve(
  `./src/templates/AllTagPostPage.tsx`
);

const contentMetadataCache = new Map();

const getContentMetadata = (source) => {
  const contentDigest = source.internal.contentDigest;
  const cachedMetadata = contentMetadataCache.get(source.id);

  if (!cachedMetadata || cachedMetadata.contentDigest !== contentDigest) {
    const metadata = createContentMetadata(source.body);
    contentMetadataCache.set(source.id, { contentDigest, metadata });
    return metadata;
  }

  return cachedMetadata.metadata;
};

exports.onCreateWebpackConfig = ({ actions, plugins, reporter, stage }) => {
  const webpackConfig = {
    plugins: [
      plugins.provide({
        React: "react",
      }),
    ],
  };

  if (stage === "build-javascript" || stage === "build-html") {
    webpackConfig.devtool = false;
  }

  actions.setWebpackConfig(webpackConfig);

  reporter.info(`Provided React in all files`);
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type ContentReadingTime {
      minutes: Float!
      text: String!
      time: Float!
      words: Int!
    }

    type MdxContentMetadata {
      readingTime: ContentReadingTime!
      tableOfContents: JSON!
    }

    type Mdx implements Node {
      contentMetadata: MdxContentMetadata!
    }

    "frontmatter에 published 필드를 선언해 GraphQL에서 필터 가능하도록 함"
    type MdxFrontmatter {
      published: Boolean
      thumbnail: File @fileByRelativePath
    }
  `);
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Mdx: {
      contentMetadata: {
        type: "MdxContentMetadata!",
        resolve: getContentMetadata,
      },
    },
  });
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      allPosts: allMdx(
        filter: { ${publicPostFilter} }
      ) {
        nodes {
          id
          frontmatter {
            slug
            categories
            locale
          }
          internal {
            contentFilePath
          }
        }
      }

      allCategories: allMdx(
        filter: { ${publicKoPostFilter} }
      ) {
        group(field: { frontmatter: { categories: SELECT } }) {
          category: fieldValue
          totalCount
        }
      }

      allTags: allMdx(
        filter: { ${publicKoPostFilter} }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          tag: fieldValue
          totalCount
        }
      }

      portfolio: mdx(
        frontmatter: {
          title: { eq: "김진수 포트폴리오" }
          published: { ne: false }
        }
      ) {
        id
        frontmatter {
          slug
        }
        internal {
          contentFilePath
        }
      }

      about_me: mdx(
        frontmatter: {
          title: { eq: "About Me" }
          published: { ne: false }
        }
      ) {
        id
        frontmatter {
          slug
        }
        internal {
          contentFilePath
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // TODO: 현재 문제점
  // 메인(pages/index.tsx) 페이지랑 태그 템플릿 페이지가 역할이 겹침
  // Categories/all-posts로 만들고
  // 메인 페이지는 진짜 메인 느낌나도록 따로 만들까 고민중

  const POST_PER_PAGE = 9;

  // ALL POSTS 페이지네이션 생성
  const posts = result.data.allPosts.nodes;
  // ko로 작성된 혹은 locale이 없는 포스트만 뽑아서 페이지네이션 해줘야 함
  const koPosts = posts.filter((post) => !post.frontmatter.locale);
  const standardKoPosts = koPosts.filter(
    (post) => !post.frontmatter.categories?.includes("short")
  );

  const allPostsNumPages = Math.ceil(koPosts.length / POST_PER_PAGE);
  const standardPostsNumPages = Math.ceil(
    standardKoPosts.length / POST_PER_PAGE
  );

  Array.from({ length: standardPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: AllPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
      },
    });
  });

  // allFeaturedPosts All Page
  Array.from({ length: standardPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/allFeaturedPosts/` : `/allFeaturedPosts/${i + 1}`,
      component: AllFeaturedPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
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
      },
    });
  });

  // allFeaturedPosts 페이지네이션 생성
  const allFeaturedPosts = result.data.allCategories.group;
  allFeaturedPosts.forEach(({ category, totalCount }) => {
    const allFeaturedPostsNumPages = Math.ceil(totalCount / POST_PER_PAGE);

    Array.from({ length: allFeaturedPostsNumPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/allFeaturedPosts/${category}`
            : `/allFeaturedPosts/${category}/${i + 1}`,
        component: FeaturedPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          category,
        },
      });
    });
  });

  // Categories 페이지네이션 생성
  const categories = result.data.allCategories.group;
  categories.forEach(({ category, totalCount }) => {
    const allCategoriesNumPages = Math.ceil(totalCount / POST_PER_PAGE);

    // 각 카테고리별로 페이지네이션
    Array.from({ length: allCategoriesNumPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/categories/${category}`
            : `/categories/${category}/${i + 1}`,
        component: CategoryPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          category,
        },
      });
    });
  });

  // Tags 페이지네이션 생성
  const tags = result.data.allTags.group;
  tags.forEach(({ tag, totalCount }) => {
    const allTagsNumPages = Math.ceil(totalCount / POST_PER_PAGE);

    // 각 태그별로 페이지네이션
    Array.from({ length: allTagsNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/tags/${tag}` : `/tags/${tag}/${i + 1}`,
        component: TagPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          tag,
        },
      });
    });
  });

  // 모든 포스트 페이지 생성 (쿼리에서 이미 published: false 제외됨)
  result.data.allPosts.nodes.forEach((node) => {
    const pagePath = getPostPath(node.frontmatter);

    createPage({
      path: pagePath,
      component: `${PostPageTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        categories: node.frontmatter.categories,
        slug: node.frontmatter.slug,
        id: node.id,
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
    },
  });
};
