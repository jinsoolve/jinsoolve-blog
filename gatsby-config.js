// gatsby-config.js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const path = require("path");

// Algolia 쿼리 파일 (네가 만든 파일 경로와 맞춰줘)
const queries = require("./src/utils/algolia");

const SITE_METADATA = Object.freeze({
  title: "Jinsoolve 블로그",
  description: "머신러닝과 알고리즘을 공부하는 김진수 입니다.",
  siteUrl: "https://jinsoolve.netlify.app",
  algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
  algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  algoliaIndexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
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
          { resolve: "gatsby-remark-gifs" },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              wrapperStyle: `margin: 25px auto; z-index: 0; display: block;`,
              showCaptions: true,
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
    "gatsby-plugin-mdx-frontmatter",

    // --- 파일 소스 ---
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `portfolio`, path: path.resolve(__dirname, "./portfolio") },
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `categories`,
        path: path.resolve(__dirname, "./content/"),
        ignore: [`**/templates/**`],
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

    {
      resolve: "gatsby-plugin-typegen",
      options: {
        outputPath: `src/__generated__/gatsby-types.d.ts`,
        emitSchema: { "src/__generated__/gatsby-schema.graphql": true },
      },
    },

    { resolve: "@chakra-ui/gatsby-plugin", options: { resetCSS: true } },

    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        custom: {
          families: ["Pretendard"],
          urls: [
            "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css",
          ],
        },
      },
    },

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
              allMdx.nodes.map((node) => ({
                ...node.frontmatter,
                title: node.frontmatter.title,
                description: node.frontmatter.description,
                date: new Date(node.frontmatter.createdAt),
                url: `${site.siteMetadata.siteUrl}/posts/${node.frontmatter.slug}`,
                guid: `${site.siteMetadata.siteUrl}/posts/${node.frontmatter.slug}`,
                custom_elements: [{ "content:encoded": node.body }],
              })),
            query: `
{
  allMdx(sort: {frontmatter: {createdAt: DESC}}) {
  nodes {
    frontmatter { title createdAt description slug }
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

    { resolve: `gatsby-plugin-gtag`, options: { trackingId: "G-6P098S0HE9", head: true } },
    { resolve: `gatsby-plugin-clarity`, options: { clarity_project_id: "guzda4dk44", enable_on_dev_env: false } },
    { resolve: "gatsby-plugin-manifest", options: { icon: "src/assets/favicon.png" } },

    // 브라우저에서 필요(노출 OK)한 키만 allowList
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: [
          "GATSBY_ALGOLIA_APP_ID",
          "GATSBY_ALGOLIA_SEARCH_KEY",
          "GATSBY_ALGOLIA_INDEX_NAME",
        ],
      },
    },

    // ✅ Algolia 인덱싱 (빌드 시 자동 실행)
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        // Admin Key는 브라우저 노출 금지 → GATSBY_ 접두사 쓰지 않는 환경변수 권장
        apiKey: process.env.ALGOLIA_ADMIN_KEY || process.env.GATSBY_ALGOLIA_ADMIN_KEY,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
        queries, // ./src/utils/algolia의 쿼리 사용 (published != false && /posts/** 만)
        chunkSize: 10000,
        concurrentQueries: true,
        enablePartialUpdates: true,
        matchFields: ["internal.contentDigest"],
        // 프로덕션에서만 인덱싱
        skipIndexing: process.env.NODE_ENV !== "production",
      },
    },
  ],
};