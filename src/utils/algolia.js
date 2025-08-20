// src/utils/algolia-queries.js
const crypto = require("crypto");

const mdxQuery = `
  query {
    allPosts: allMdx(
      filter: {
        frontmatter: {
          published: { ne: false }
          title: { nin: ["김진수 포트폴리오", "김진수에 대하여"] }
        }
        # MDX에서는 fileAbsolutePath 대신 internal.contentFilePath 사용
        internal: { contentFilePath: { regex: "/posts/" } }
      }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        id
        # body는 매우 커질 수 있으니 excerpt를 기본으로 사용
        excerpt(pruneLength: 500)
        frontmatter {
          slug
          title
          description
          categories
          tags
        }
        internal { contentFilePath }
      }
    }
  }
`;

const unnestFrontmatter = (node) => {
  const { frontmatter, excerpt, id, internal, ...rest } = node;

  // partial update용 digest (노드 내용 기반)
  const contentDigest = crypto
    .createHash("md5")
    .update(JSON.stringify({ id, frontmatter, excerpt }))
    .digest("hex");

  return {
    // ✅ Algolia 교체/부분 업데이트에 필수
    objectID: id,

    // 표시/검색용 필드
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    categories: frontmatter.categories ?? [],
    tags: frontmatter.tags ?? [],

    // 본문은 excerpt로 — 필요하면 길이/필드 조정 가능
    body: excerpt,

    // 라우팅/구분
    url: `/posts/${frontmatter.slug}`,
    section: "posts",

    // 내부 필드(부분 업데이트 매칭)
    internal: {
      contentFilePath: internal.contentFilePath,
      contentDigest,
    },

    // 혹시 사용할 수도 있는 잔여 필드
    ...rest,
  };
};

const queries = [
  {
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    query: mdxQuery,
    transformer: ({ data }) => {
      const rows = data.allPosts.nodes.map(unnestFrontmatter);
      console.log(`[algolia] allPosts count = ${data.allPosts.nodes.length}`);
      console.log(`[algolia] rows to push = ${rows.length}`);
      if (rows[0]) console.log(`[algolia] sample keys = ${Object.keys(rows[0]).join(',')}`);
      return rows;
    },
    settings: {
      searchableAttributes: [
        "unordered(title)",
        "unordered(description)",
        "unordered(body)",
        "unordered(tags)",
        "unordered(categories)",
        "url",
      ],
      attributesToSnippet: ["body:20", "description:20"],
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
      attributesForFaceting: ["section", "categories", "tags"],
    },
  },
];

module.exports = queries;