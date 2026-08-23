const readingTime = require("reading-time");

const WORDS_PER_MINUTE = 500;
let katexPromise;

const loadKatex = () => {
  if (!katexPromise) {
    katexPromise = import("katex").then((module) => module.default);
  }

  return katexPromise;
};

const INLINE_MATH_PATTERN = /(?<!\\)\$([^$\n]+?)(?<!\\)\$/g;

const extractHeadingText = async (rawTitle) => {
  const mathExpressions = [];
  let title = rawTitle.replace(INLINE_MATH_PATTERN, (_, expression) => {
    const placeholder = `CONTENTMATH${mathExpressions.length}PLACEHOLDER`;
    mathExpressions.push(expression);
    return placeholder;
  });

  title = title
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\\([\\`*{}[\]()#+\-.!_$>])/g, "$1");

  if (mathExpressions.length > 0) {
    const katex = await loadKatex();
    mathExpressions.forEach((expression, index) => {
      title = title.replace(
        `CONTENTMATH${index}PLACEHOLDER`,
        katex.renderToString(expression, { throwOnError: false }),
      );
    });
  }

  return title;
};

const extractHeadings = async (body) => {
  const lines = body.split(/\r?\n/);
  const headings = [];
  let fenceCharacter = null;
  let fenceLength = 0;
  let inMathBlock = false;
  let startIndex = 0;

  const firstContentIndex = lines.findIndex((line) => line.trim() !== "");
  if (firstContentIndex >= 0 && lines[firstContentIndex].trim() === "---") {
    const frontmatterEnd = lines.findIndex(
      (line, index) =>
        index > firstContentIndex &&
        (line.trim() === "---" || line.trim() === "..."),
    );
    if (frontmatterEnd > firstContentIndex) startIndex = frontmatterEnd + 1;
  }

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("$$")) {
      if (trimmedLine === "$$") inMathBlock = !inMathBlock;
      continue;
    }

    if (inMathBlock) continue;

    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);

    if (fence) {
      const character = fence[1][0];
      if (!fenceCharacter) {
        fenceCharacter = character;
        fenceLength = fence[1].length;
      } else if (
        character === fenceCharacter &&
        fence[1].length >= fenceLength &&
        line.slice(fence[0].length).trim() === ""
      ) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }

    if (fenceCharacter) continue;

    const atxHeading = line.match(/^\s{0,3}(#{1,6})[\t ]+(.+?)\s*$/);
    if (atxHeading) {
      const rawTitle = atxHeading[2].replace(/[\t ]+#+[\t ]*$/, "");
      headings.push({
        depth: atxHeading[1].length,
        title: await extractHeadingText(rawTitle),
      });
      continue;
    }

    const setextUnderline = lines[index + 1]?.match(/^\s{0,3}(=+|-+)\s*$/);
    if (line.trim() && setextUnderline) {
      headings.push({
        depth: setextUnderline[1][0] === "=" ? 1 : 2,
        title: await extractHeadingText(line.trim()),
      });
      index += 1;
    }
  }

  return headings;
};

const buildHierarchy = (headers) => {
  const root = { depth: 0, items: [] };
  const stack = [root];

  headers.forEach((header) => {
    while (stack.length > 1 && stack[stack.length - 1].depth >= header.depth) {
      stack.pop();
    }

    const item = {
      depth: header.depth,
      title: header.title,
      url: header.url,
      items: [],
    };

    stack[stack.length - 1].items.push(item);
    stack.push(item);
  });

  return root.items;
};

const createContentMetadata = async (body = "") => {
  const headers = (await extractHeadings(body)).map((heading, index) => ({
    ...heading,
    url: `#my-heading-${index + 1}`,
  }));

  return {
    readingTime: readingTime(body, { wordsPerMinute: WORDS_PER_MINUTE }),
    tableOfContents: { items: buildHierarchy(headers) },
  };
};

module.exports = { createContentMetadata };
