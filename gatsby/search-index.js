const fs = require("fs/promises");
const path = require("path");
const readingTime = require("reading-time");

const { getPostPath, isPublicPost, publicPostFilter } = require("./content-policy");

const SEARCH_INDEX_VERSION = 1;
const MAX_BODY_LENGTH = 16000;
const WORDS_PER_MINUTE = 500;

const SEARCH_INDEX_QUERY = `
  query LocalSearchIndex {
    allSearchPosts: allMdx(
      filter: { ${publicPostFilter} }
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
          locale
          createdAt
          updatedAt
          featured
          published
        }
      }
    }
  }
`;

const stripInlineMarkdown = (value = "") =>
  String(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\\([\\`*{}[\]()#+\-.!_$>])/g, "$1");

const extractHeadings = (body = "") => {
  const lines = String(body).split(/\r?\n/);
  const headings = [];
  let fenceCharacter = null;
  let fenceLength = 0;
  let inMathBlock = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (trimmedLine === "$$") {
      inMathBlock = !inMathBlock;
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
      const text = stripInlineMarkdown(rawTitle).replace(/\s+/g, " ").trim();
      if (text) headings.push(text);
      continue;
    }

    const setextUnderline = lines[index + 1]?.match(/^\s{0,3}(=+|-+)\s*$/);
    if (trimmedLine && setextUnderline) {
      const text = stripInlineMarkdown(trimmedLine).replace(/\s+/g, " ").trim();
      if (text) headings.push(text);
      index += 1;
    }
  }

  return headings.map((text, index) => ({
    text,
    anchor: `#my-heading-${index + 1}`,
  }));
};

const stripMarkdown = (body = "") =>
  stripInlineMarkdown(body)
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/^\s*(?:import|export)\s.+$/gm, " ")
    .replace(/^\s{0,3}(?:`{3,}|~{3,}).*$/gm, " ")
    .replace(/https?:\/\/[^\s)]+/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, " ")
    .replace(/^\s*>+\s?/gm, " ")
    .replace(/^\s*[-+*]\s+/gm, " ")
    .replace(/^\s*\d+[.)]\s+/gm, " ")
    .replace(/[|]/g, " ")
    .replace(/\$\$?/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_BODY_LENGTH);

const toStringList = (value) =>
  Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];

const getReadingMinutes = (content) => {
  const { minutes } = readingTime(String(content), {
    wordsPerMinute: WORDS_PER_MINUTE,
  });
  return Math.max(1, Math.ceil(minutes));
};

const createSearchDocument = (node) => {
  const frontmatter = node.frontmatter ?? {};
  const slug = String(frontmatter.slug ?? "").trim();
  const title = String(frontmatter.title ?? "").trim();

  if (!slug || !title) {
    throw new Error(`검색 인덱스 문서에 title/slug가 없습니다: ${node.id}`);
  }

  const content = stripMarkdown(node.body);

  return {
    id: String(node.id),
    url: getPostPath(frontmatter),
    slug,
    locale: String(frontmatter.locale || "ko"),
    title,
    description: String(frontmatter.description ?? "").trim(),
    categories: toStringList(frontmatter.categories),
    tags: toStringList(frontmatter.tags),
    createdAt: frontmatter.createdAt || null,
    updatedAt: frontmatter.updatedAt || null,
    featured: frontmatter.featured === true,
    readingMinutes: getReadingMinutes(node.body),
    headings: extractHeadings(node.body),
    content,
  };
};

const compareDocuments = (left, right) => {
  const dateOrder = String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? ""));
  if (dateOrder !== 0) return dateOrder;
  return left.url.localeCompare(right.url);
};

const createSearchIndex = (nodes = []) => {
  const documents = nodes
    .filter((node) => isPublicPost(node.frontmatter ?? {}))
    .map(createSearchDocument)
    .sort(compareDocuments);
  const urls = new Set();

  documents.forEach((document) => {
    if (urls.has(document.url)) {
      throw new Error(`검색 인덱스 URL이 중복되었습니다: ${document.url}`);
    }
    urls.add(document.url);
  });

  return { version: SEARCH_INDEX_VERSION, documents };
};

const writeSearchIndex = async (index, outputPath) => {
  const temporaryPath = `${outputPath}.tmp`;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(temporaryPath, JSON.stringify(index), "utf8");
  await fs.rename(temporaryPath, outputPath);
};

const generateSearchIndex = async ({ graphql, reporter, outputDirectory }) => {
  const result = await graphql(SEARCH_INDEX_QUERY);

  if (result.errors) throw result.errors;

  const index = createSearchIndex(result.data.allSearchPosts.nodes);
  const outputPath = path.join(
    outputDirectory ?? path.join(process.cwd(), "public"),
    "search-index.json",
  );

  await writeSearchIndex(index, outputPath);
  reporter?.info(`로컬 검색 인덱스 생성 완료: ${index.documents.length}개 문서`);

  return index;
};

module.exports = {
  SEARCH_INDEX_QUERY,
  SEARCH_INDEX_VERSION,
  createSearchIndex,
  extractHeadings,
  generateSearchIndex,
  stripMarkdown,
};
