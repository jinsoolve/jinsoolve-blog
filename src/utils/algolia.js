const crypto = require("crypto");

const mdxQuery = `
  query {
    allPosts: allMdx(filter: { frontmatter: { title: { nin: ["김진수 포트폴리오", "김진수에 대하여"] } } }) {
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
    ...frontmatter,
    body,
    ...rest,
    internal: {
      contentFilePath: node.internal.contentFilePath,
      contentDigest,
    },
  };
};

const queries = [
  {
    query: mdxQuery,
    transformer: ({ data }) =>
      data.allPosts.nodes.map(unnestFrontmatter),
    settings: {
      attributesToRetrieve: ["title", "body", "slug", "tags", "categories", "description"],
      attributesToHighlight: ["title", "body", "slug", "tags", "categories", "description"], // 강조 처리할 필드 추가
    },
  },
];

module.exports = queries;