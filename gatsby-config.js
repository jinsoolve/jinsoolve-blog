// gatsby-config.js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const path = require("path");
const { getPostPath, publicPostFilter } = require("./gatsby/content-policy");

const SITE_METADATA = Object.freeze({
  title: "Jinsoolve 블로그",
  description: "머신러닝과 알고리즘을 공부하는 김진수 입니다.",
  siteUrl: "https://jinsoolve.netlify.app",
});

const wrapESMPlugin = (name) =>
  function wrapESM(opts) {
    return async (...args) => {
      const mod = await import(name);
      const plugin = mod.default(opts);
      return plugin(...args);
    };
  };

const rehypeCustomSlug = require("./src/utils/rehype-custom-slug.js");

module.exports = {
  siteMetadata: SITE_METADATA,
  graphqlTypegen: true,
  trailingSlash: `always`,
  flags: { DEV_SSR: false },

  plugins: [
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800, // 생성할 최대 폭
              showCaptions: true,
              withWebp: true, // webp만 유지
              withAvif: false, // AVIF 비활성 (메모리/시간 절약)
              linkImagesToOriginal: false, // 원본 링크 비활성
              backgroundColor: "transparent",
              quality: 70,
            },
          },
          { resolve: `gatsby-remark-katex`, options: { strict: "ignore" } },
        ],
        mdxOptions: {
          remarkPlugins: [
            [require(`remark-gfm`), { singleTilde: false }],
            wrapESMPlugin(`remark-breaks`),
          ],
          rehypePlugins: [
            rehypeCustomSlug,
            [
              wrapESMPlugin(`rehype-autolink-headings`),
              {
                behavior: "append",
                content: {
                  type: `element`,
                  tagName: `span`,
                  properties: { className: `heading-anchor-icon` },
                  children: [{ type: `text`, value: `#` }],
                },
              },
            ],
          ],
        },
      },
    },
    // --- 파일 소스 ---
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `portfolio`,
        path: path.resolve(__dirname, "./portfolio"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `about-me`, path: path.resolve(__dirname, "./about") },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: path.resolve(__dirname, "./content"),
        ignore: [`**/templates/**`], // content/templates 무시
      },
    },
    // --- 파일 소스 끝 ---

    "gatsby-plugin-image",
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `dominantColor`,
          quality: 70,
          breakpoints: [640, 960, 1280],
          backgroundColor: `transparent`,
        },
        failOn: `none`,
        stripMetadata: true,
      },
    },
    "gatsby-transformer-sharp",

    { resolve: "@chakra-ui/gatsby-plugin", options: { resetCSS: true } },

    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) =>
              allMdx.nodes.map((node) => {
                const url = `${site.siteMetadata.siteUrl}${getPostPath(node.frontmatter)}`;

                return {
                  ...node.frontmatter,
                  title: node.frontmatter.title,
                  description: node.frontmatter.description,
                  date: new Date(node.frontmatter.createdAt),
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": node.body }],
                };
              }),
            query: `
{
  allMdx(
    filter: { ${publicPostFilter} }
    sort: {frontmatter: {createdAt: DESC}}
  ) {
  nodes {
    frontmatter { title createdAt description slug locale }
    body
  }
}
}
`,
            output: "/rss.xml",
            title: "jinsoolve blog's RSS Feed",
          },
        ],
      },
    },

    {
      resolve: `gatsby-plugin-gtag`,
      options: { trackingId: "G-6P098S0HE9", head: true },
    },
    {
      resolve: `gatsby-plugin-clarity`,
      options: { clarity_project_id: "guzda4dk44", enable_on_dev_env: false },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: { icon: "src/assets/favicon.png" },
    },
  ],
};
