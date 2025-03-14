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
    margin: "auto !important",
  },

  // react-syntax-highlighter 줄 번호 스타일
  ".react-syntax-highlighter-line-number": {
    minWidth: "35px !important",
    userSelect: "none",
    pointerEvents: "none",
  },

  "@font-face": {
    fontFamily: "SBAggro",
    src: "url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroM.woff') format('woff')",
    fontWeight: "normal",
    fontStyle: "normal",
  },

  // Bold 텍스트에 밑줄 스타일 추가
  "b, strong": {
    textDecoration: "underline",
    textDecorationColor: "blue.400",
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
    _light: {
      color: "black", // 라이트 모드에서 텍스트 색상
    },
    _dark: {
      color: "white", // 다크 모드에서 텍스트 색상
    },
  },

  img: {
    marginTop: "20px",
    marginBottom: "-10px",
    marginRight: "auto",
    marginLeft: "auto",
  },

  ".toc-title": {
    fontFamily: "'Pretendard', sans-serif !important",
    fontSize: "16px",
    margin: "8px 0",
    lineHeight: "1.5",
    fontWeight: "bold",
  },

  // "li > ol": {
  //   listStyleType: "lower-alpha", // 하위 레벨 숫자 리스트 스타일 (예: a, b, c...)
  // },
  // "li > ul": {
  //   listStyleType: "circle", // 하위 레벨 bullet point 스타일
  // },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
    border: "1px solid gray",
    marginTop: "15px",
  },

  "th, td": {
    border: "1px solid gray",
    padding: "4px 0px",
  },

  // th: {
  //   backgroundColor: "#f4f4f4",
  //   fontWeight: "bold",
  // },
};