const EXCLUDED_POST_TITLES = Object.freeze(["김진수 포트폴리오", "About Me"]);

const publicPostFilter = `
  frontmatter: {
    title: { nin: [${EXCLUDED_POST_TITLES.map((title) => JSON.stringify(title)).join(", ")}] }
    published: { ne: false }
  }
`;

const publicKoPostFilter = `
  frontmatter: {
    title: { nin: [${EXCLUDED_POST_TITLES.map((title) => JSON.stringify(title)).join(", ")}] }
    published: { ne: false }
    locale: { eq: null }
  }
`;

const isPublicPost = ({ title, published }) =>
  published !== false && !EXCLUDED_POST_TITLES.includes(title);

const getPostPath = ({ locale, slug }) =>
  locale ? `/${locale}/posts/${slug}` : `/posts/${slug}`;

module.exports = {
  getPostPath,
  isPublicPost,
  publicKoPostFilter,
  publicPostFilter,
};
