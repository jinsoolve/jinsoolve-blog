// src/utils/algolia-queries.js
const crypto = require("crypto");

const mdxQuery = `
  query {
    allPosts: allMdx(
      filter: {
        frontmatter: {
          # published가 false가 아닌 것만 (true 또는 undefined)
          published: { ne: false }
          # 특정 제목 제외
          title: { nin: ["김진수 포트폴리오", "김진수에 대하여"] }
        }
        # ✅ MDX에서는 fileAbsolutePath 대신 internal.contentFilePath 사용
        internal: { contentFilePath: { regex: "/\\\\/posts\\\\//" } }
      }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        id
        body
        frontmatter {
          slug
          title
          description
          categories
          tags
        }
        internal {
          contentFilePath
        }
      }
    }
  }
`;

const unnestFrontmatter = (node) => {
  const { frontmatter, body, ...rest } = node;

  const contentDigest = crypto
    .createHash("md5")
    .update(JSON.stringify(node))
    .digest("hex");

  return {
    ...frontmatter,                 // slug, title, description, categories, tags
    body,                           // 본문(요약이 필요하면 excerpt로 교체 가능)
    ...rest,                        // id 등
    internal: {
      contentFilePath: node.internal.contentFilePath,
      contentDigest,
    },
    // 필요하면 URL/섹션 필드까지 여기서 만들어둠
    url: `/posts/${frontmatter.slug}`,
    section: "posts",
  };
};

const queries = [
  {
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // 인덱스명
    query: mdxQuery,
    transformer: ({ data }) => data.allPosts.nodes.map(unnestFrontmatter),
    settings: {
      attributesToRetrieve: [
        "title",
        "body",
        "slug",
        "tags",
        "categories",
        "description",
        "url",
        "section",
      ],
      attributesToHighlight: [
        "title",
        "body",
        "slug",
        "tags",
        "categories",
        "description",
      ],
      attributesToSnippet: ["body:20", "description:20"],
      searchableAttributes: [
        "unordered(title)",
        "unordered(description)",
        "unordered(body)",
        "unordered(tags)",
        "unordered(categories)",
        "url"
      ],
      attributesForFaceting: ["section", "categories", "tags"],
    },
  },
];

module.exports = queries;