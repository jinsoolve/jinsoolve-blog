const assert = require("node:assert/strict");
const test = require("node:test");

const {
  getPopularTerms,
  getRecentDocuments,
  normalizeSearchText,
  searchDocuments,
  toChoseong,
} = require("../src/utils/local-search");

const document = (overrides) => ({
  id: overrides.id,
  url: `/posts/${overrides.id}`,
  slug: overrides.id,
  locale: "ko",
  title: overrides.title,
  description: overrides.description ?? "",
  categories: overrides.categories ?? [],
  tags: overrides.tags ?? [],
  createdAt: overrides.createdAt ?? "2025/01/01",
  updatedAt: null,
  featured: false,
  readingMinutes: 2,
  headings: overrides.headings ?? [],
  content: overrides.content ?? "",
});

const documents = [
  document({
    id: "ml-title",
    title: "머신러닝 기초",
    categories: ["ML"],
    tags: ["인공지능"],
    content: "경사 하강법을 설명합니다.",
  }),
  document({
    id: "body-only",
    title: "겨울 방학 회고",
    content: "이번 방학에는 머신러닝 기초를 공부했습니다.",
  }),
  document({
    id: "nlp",
    title: "자연어 처리 입문",
    tags: ["NLP"],
    headings: [{ text: "Word2Vec 임베딩", anchor: "#my-heading-1" }],
    content: "단어를 벡터로 표현합니다.",
    createdAt: "2025/03/01",
  }),
];

test("정확한 제목 일치를 본문 일치보다 먼저 반환한다", () => {
  const results = searchDocuments(documents, "머신러닝 기초");
  assert.equal(results[0].id, "ml-title");
  assert.ok(results[0].score > results[1].score);
});

test("공백 없는 한글, 초성, 가벼운 오타를 검색한다", () => {
  assert.equal(searchDocuments(documents, "자연어처리")[0].id, "nlp");
  assert.equal(searchDocuments(documents, "ㅁㅅㄹㄴ")[0].id, "ml-title");
  assert.equal(searchDocuments(documents, "머신러닝 기초오")[0].id, "ml-title");
});

test("영문 대소문자와 NFKC 문자를 동일하게 정규화한다", () => {
  assert.equal(normalizeSearchText("  Ｗｏｒｄ２Ｖｅｃ  "), "word2vec");
  const result = searchDocuments(documents, "word2vec")[0];
  assert.equal(result.id, "nlp");
  assert.equal(result.resultUrl, "/posts/nlp#my-heading-1");
});

test("짧은 영문은 독립 단어·동의어만 검색해 substring 오염을 막는다", () => {
  const aiDocuments = [
    document({ id: "training", title: "Training Tips", content: "training pipeline" }),
    document({ id: "airtable", title: "Airtable 사용법" }),
    document({
      id: "artificial-intelligence",
      title: "새로운 기술",
      tags: ["인공지능"],
      content: "인공지능 모델을 설명합니다.",
    }),
  ];

  const results = searchDocuments(aiDocuments, "AI");
  assert.equal(results[0].id, "artificial-intelligence");
  assert.equal(
    results.some(({ id }) => id === "training" || id === "airtable"),
    false,
  );
});

test("가장 높은 섹션 점수의 anchor와 snippet을 함께 사용한다", () => {
  const sectionDocument = document({
    id: "sections",
    title: "섹션 테스트",
    headings: [
      { text: "target", anchor: "#my-heading-1" },
      { text: "exact target", anchor: "#my-heading-2" },
    ],
  });

  const result = searchDocuments([sectionDocument], "exact target")[0];
  assert.equal(result.resultUrl, "/posts/sections#my-heading-2");
  assert.equal(result.snippet, "섹션 · exact target");
});

test("아주 긴 검색어도 엔진 경계에서 제한한다", () => {
  const longQuery = Array.from({ length: 5000 }, (_, index) => `token${index}`).join(" ");
  const startedAt = performance.now();
  searchDocuments(documents, longQuery);
  assert.ok(performance.now() - startedAt < 250);
});

test("최근 글과 자주 쓰는 분류를 안정적으로 제안한다", () => {
  assert.equal(getRecentDocuments(documents, 1)[0].id, "nlp");
  assert.deepEqual(getPopularTerms(documents, 3).sort(), ["ML", "NLP", "인공지능"].sort());
  assert.equal(toChoseong("머신러닝"), "ㅁㅅㄹㄴ");
});
