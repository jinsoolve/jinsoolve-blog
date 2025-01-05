const crypto = require('crypto');

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
  const { frontmatter, ...rest } = node;

  // ✅ contentDigest 추가
  const contentDigest = crypto
    .createHash('md5')
    .update(JSON.stringify(node))
    .digest('hex');

  return {
    ...frontmatter,
    ...rest,
    internal: {
      contentFilePath: node.internal.contentFilePath,
      contentDigest, // ✅ 여기에 추가
    },
  };
};

const queries = [
  {
    query: mdxQuery,
    transformer: ({ data }) =>
      data.allPosts.nodes.map(unnestFrontmatter),
  },
];

module.exports = queries;