const assert = require("node:assert/strict");
const test = require("node:test");
const readingTime = require("reading-time");

const { createSearchIndex, extractHeadings, stripMarkdown } = require("./search-index");

const node = (overrides = {}) => ({
  id: overrides.id ?? "post-1",
  body: overrides.body ?? "# 머신러닝 소개\n\n[공식 문서](https://example.com)를 읽습니다.",
  frontmatter: {
    slug: "machine-learning",
    title: "머신러닝 소개",
    description: "머신러닝을 소개합니다.",
    categories: ["ML"],
    tags: ["머신러닝"],
    locale: null,
    createdAt: "2025/01/01",
    updatedAt: null,
    featured: false,
    published: true,
    ...overrides.frontmatter,
  },
});

test("Markdown 장식과 외부 URL을 제거하고 보이는 텍스트는 보존한다", () => {
  const text = stripMarkdown(`
import Demo from "./Demo"
# **제목**
[공식 문서](https://example.com/docs)를 보고 \`tensor\`를 사용한다.
<Demo value="secret" />
\`\`\`python
model.fit(data)
\`\`\`
  `);

  assert.match(text, /제목/);
  assert.match(text, /공식 문서/);
  assert.match(text, /tensor/);
  assert.match(text, /model\.fit/);
  assert.doesNotMatch(text, /https?:/);
  assert.doesNotMatch(text, /import Demo|secret/);
});

test("코드 펜스 안의 #은 제목으로 만들지 않는다", () => {
  assert.deepEqual(extractHeadings("# 진짜 제목\n```python\n# 주석\n```\n두 번째\n---"), [
    { text: "진짜 제목", anchor: "#my-heading-1" },
    { text: "두 번째", anchor: "#my-heading-2" },
  ]);
});

test("비공개·About·Portfolio를 제외하고 locale URL을 보존한다", () => {
  const index = createSearchIndex([
    node(),
    node({
      id: "post-en",
      frontmatter: { slug: "english", title: "English", locale: "en" },
    }),
    node({
      id: "draft",
      frontmatter: { slug: "draft", title: "Draft", published: false },
    }),
    node({
      id: "about",
      frontmatter: { slug: "about", title: "About Me" },
    }),
    node({
      id: "portfolio",
      frontmatter: { slug: "portfolio", title: "김진수 포트폴리오" },
    }),
  ]);

  assert.equal(index.documents.length, 2);
  assert.deepEqual(index.documents.map(({ url }) => url).sort(), [
    "/en/posts/english",
    "/posts/machine-learning",
  ]);
  assert.equal(index.documents[0].locale === "ko" || index.documents[1].locale === "ko", true);
  assert.equal(JSON.stringify(index).includes("contentFilePath"), false);
});

test("같은 입력은 결정적인 인덱스를 만들고 URL 중복은 거부한다", () => {
  const nodes = [node(), node({ id: "post-2", frontmatter: { slug: "two", title: "둘" } })];
  assert.equal(
    JSON.stringify(createSearchIndex(nodes)),
    JSON.stringify(createSearchIndex([...nodes].reverse())),
  );

  assert.throws(() => createSearchIndex([node(), node({ id: "duplicate" })]), /URL이 중복/);
});

test("읽기 시간은 잘린 검색 본문이 아니라 전체 원문으로 계산한다", () => {
  const body = "긴 한글 본문입니다. ".repeat(5000);
  const index = createSearchIndex([node({ body })]);
  const expectedMinutes = Math.ceil(readingTime(body, { wordsPerMinute: 500 }).minutes);

  assert.equal(index.documents[0].content.length, 16000);
  assert.equal(index.documents[0].readingMinutes, expectedMinutes);
});
