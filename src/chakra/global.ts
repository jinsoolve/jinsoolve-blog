export default {
  html: {
    scrollPaddingTop: "75px",
  },

  body: {
    transition: "background-color 0.2s ease, color 0.2s ease",
  },

  "h1:hover .heading-anchor-icon, h2:hover .heading-anchor-icon, h3:hover .heading-anchor-icon": {
    opacity: 1,
  },

  blockquote: {
    p: {
      marginTop: "0px",
    },
  },

  ".heading-anchor-icon": {
    marginLeft: "10px",
    opacity: 0,
    color: "blue.600",
    transition: "all 0.2s ease-in-out",
  },

  ".gatsby-resp-image-figcaption": {
    fontSize: "14px",
    textAlign: "center",

    color: "gray.500",

    marginTop: "16px",
  },

  ".frac-line": {
    borderColor: "currentColor",
    borderWidth: "0.8px",
  },
  ".katex": {
    overflowX: "auto",
    overflowY: "hidden",
  },
  // react-syntax-highlighter 줄 번호 스타일
  ".react-syntax-highlighter-line-number": {
    userSelect: "none",
    pointerEvents: "none",
  },
};
