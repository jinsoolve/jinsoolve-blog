const FIELD_WEIGHTS = Object.freeze({
  title: 5.5,
  tags: 4,
  categories: 3.5,
  heading: 3.25,
  description: 2.5,
  slug: 2,
  content: 1,
});

const SYNONYMS = Object.freeze({
  ai: ["인공지능", "artificial intelligence", "머신러닝", "machine learning", "deep learning"],
  ml: ["머신러닝", "machine learning"],
  nlp: ["자연어 처리", "natural language processing"],
  llm: ["대규모 언어 모델", "language model"],
  ps: ["알고리즘", "problem solving", "백준"],
});

const CHOSEONG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const MAX_QUERY_LENGTH = 160;
const MAX_QUERY_TOKENS = 12;
const preparedDocumentCache = new WeakMap();

const normalizeSearchText = (value = "") =>
  String(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[^\p{L}\p{N}_+#]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const unique = (values) => [...new Set(values.filter(Boolean))];
const isShortAsciiToken = (token) => /^[a-z0-9]{1,2}$/.test(token);
const includesWholeWord = (value, token) => ` ${value} `.includes(` ${token} `);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findRawMatchIndex = (value, normalizedTerm) => {
  const parts = normalizedTerm.split(" ").filter(Boolean).map(escapeRegExp);
  if (parts.length === 0) return -1;

  const separator = "[\\s\\p{P}\\p{S}_]*";
  return new RegExp(parts.join(separator), "iu").exec(value)?.index ?? -1;
};

const toChoseong = (value = "") =>
  [...String(value)]
    .map((character) => {
      const codePoint = character.codePointAt(0);
      if (codePoint >= 0xac00 && codePoint <= 0xd7a3) {
        return CHOSEONG[Math.floor((codePoint - 0xac00) / 588)];
      }
      return character;
    })
    .join("")
    .replace(/\s+/g, "");

const getQueryInfo = (query) => {
  const cappedQuery = String(query).slice(0, MAX_QUERY_LENGTH);
  const normalized = normalizeSearchText(cappedQuery);
  const tokens = unique(normalized.split(" ")).slice(0, MAX_QUERY_TOKENS);
  const aliasPairs = tokens.flatMap((token) =>
    (SYNONYMS[token] ?? []).map((alias) => ({
      token,
      alias: normalizeSearchText(alias),
    })),
  );
  const aliases = unique(aliasPairs.map(({ alias }) => alias));
  const rawCompact = cappedQuery.replace(/\s+/g, "");

  return {
    normalized,
    compact: normalized.replace(/\s+/g, ""),
    tokens,
    aliases,
    aliasPairs,
    choseong: rawCompact && /^[ㄱ-ㅎ]+$/.test(rawCompact) ? rawCompact : "",
  };
};

const boundedLevenshtein = (left, right, maximum) => {
  const leftCharacters = [...left];
  const rightCharacters = [...right];

  if (Math.abs(leftCharacters.length - rightCharacters.length) > maximum) {
    return maximum + 1;
  }

  let previous = rightCharacters.map((_, index) => index + 1);
  previous.unshift(0);

  for (let leftIndex = 1; leftIndex <= leftCharacters.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0];

    for (let rightIndex = 1; rightIndex <= rightCharacters.length; rightIndex += 1) {
      const substitutionCost =
        leftCharacters[leftIndex - 1] === rightCharacters[rightIndex - 1] ? 0 : 1;
      const distance = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
      current.push(distance);
      rowMinimum = Math.min(rowMinimum, distance);
    }

    if (rowMinimum > maximum) return maximum + 1;
    previous = current;
  }

  return previous[rightCharacters.length];
};

const fuzzyMatch = (token, words) => {
  const tokenLength = [...token].length;
  if (tokenLength < 3) return false;

  const maximum = tokenLength >= 6 ? 2 : 1;
  return words.some((word) => {
    const wordLength = [...word].length;
    return (
      Math.abs(wordLength - tokenLength) <= maximum &&
      boundedLevenshtein(token, word, maximum) <= maximum
    );
  });
};

const prepareText = (value, includeWords) => {
  const normalized = normalizeSearchText(value);
  return {
    normalized,
    compact: normalized.replace(/\s+/g, ""),
    words: includeWords ? unique(normalized.split(" ")) : null,
  };
};

const getPreparedDocument = (document) => {
  const cachedDocument = preparedDocumentCache.get(document);
  if (cachedDocument) return cachedDocument;

  const preparedDocument = {
    fields: [
      ["title", prepareText(document.title, true), true],
      ["tags", prepareText(document.tags.join(" "), true), true],
      ["categories", prepareText(document.categories.join(" "), true), true],
      ["description", prepareText(document.description, true), true],
      ["slug", prepareText(document.slug, false), false],
      ["content", prepareText(document.content, false), false],
    ],
    headings: document.headings.map((heading) => ({
      ...heading,
      preparedText: prepareText(heading.text, true),
    })),
    choseong: toChoseong([document.title, ...document.categories, ...document.tags].join(" ")),
  };

  preparedDocumentCache.set(document, preparedDocument);
  return preparedDocument;
};

const prepareSearchDocuments = (documents) => {
  documents.forEach(getPreparedDocument);
};

const scoreText = (preparedText, queryInfo, allowFuzzy = false) => {
  const { compact, normalized } = preparedText;
  if (!normalized) return { score: 0, coveredTokens: [] };

  const words = preparedText.words;
  const coveredTokens = [];
  let score = 0;
  const shortAsciiPhrase = queryInfo.tokens.length === 1 && isShortAsciiToken(queryInfo.normalized);

  if (normalized === queryInfo.normalized) score += 42;
  else if (shortAsciiPhrase && normalized.startsWith(`${queryInfo.normalized} `)) score += 25;
  else if (shortAsciiPhrase && includesWholeWord(normalized, queryInfo.normalized)) score += 19;
  else if (!shortAsciiPhrase && normalized.startsWith(queryInfo.normalized)) score += 25;
  else if (!shortAsciiPhrase && normalized.includes(queryInfo.normalized)) score += 19;
  else if (
    !shortAsciiPhrase &&
    queryInfo.compact.length >= 2 &&
    compact.includes(queryInfo.compact)
  ) {
    score += 16;
  }

  queryInfo.tokens.forEach((token) => {
    if (words?.includes(token)) {
      score += 9;
      coveredTokens.push(token);
    } else if (!isShortAsciiToken(token) && words?.some((word) => word.startsWith(token))) {
      score += 6;
      coveredTokens.push(token);
    } else if (
      isShortAsciiToken(token) ? includesWholeWord(normalized, token) : normalized.includes(token)
    ) {
      score += 4;
      coveredTokens.push(token);
    } else if (allowFuzzy && words && fuzzyMatch(token, words)) {
      score += 2;
      coveredTokens.push(token);
    }
  });

  queryInfo.aliasPairs.forEach(({ alias, token }) => {
    if (normalized.includes(alias)) {
      score += 6;
      coveredTokens.push(token);
    }
  });

  return { score, coveredTokens };
};

const findSnippet = (document, queryInfo, preferredField, matchedHeading) => {
  if (preferredField === "heading" && matchedHeading) return `섹션 · ${matchedHeading}`;

  const candidates = [document.description, document.content].filter(Boolean);
  const matchTerms = unique([...queryInfo.aliases, queryInfo.normalized, ...queryInfo.tokens]);

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeSearchText(candidate);
    const matchedTerm = matchTerms.find((term) => normalizedCandidate.includes(term));
    if (!matchedTerm) continue;

    const rawIndex = findRawMatchIndex(candidate, matchedTerm);
    const start = Math.max(0, rawIndex >= 0 ? rawIndex - 70 : 0);
    const end = Math.min(candidate.length, start + 180);
    return `${start > 0 ? "…" : ""}${candidate.slice(start, end).trim()}${
      end < candidate.length ? "…" : ""
    }`;
  }

  return (
    document.description ||
    `${document.content.slice(0, 180)}${document.content.length > 180 ? "…" : ""}`
  );
};

const parseDate = (value) => {
  if (!value) return 0;
  const timestamp = Date.parse(String(value).replaceAll("/", "-"));
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const searchDocuments = (documents, query, options = {}) => {
  const queryInfo = getQueryInfo(query);
  const limit = options.limit ?? 10;
  if (!queryInfo.normalized && !queryInfo.choseong) return [];

  return documents
    .map((document) => {
      const preparedDocument = getPreparedDocument(document);
      const coveredTokens = new Set();
      const matchedFields = [];
      let totalScore = 0;

      preparedDocument.fields.forEach(([field, preparedText, allowFuzzy]) => {
        const match = scoreText(preparedText, queryInfo, allowFuzzy);
        const weightedScore = match.score * FIELD_WEIGHTS[field];
        if (weightedScore > 0) {
          totalScore += weightedScore;
          matchedFields.push({ field, score: weightedScore });
          match.coveredTokens.forEach((token) => coveredTokens.add(token));
        }
      });

      let bestHeading = null;
      preparedDocument.headings.forEach((heading) => {
        const match = scoreText(heading.preparedText, queryInfo, true);
        const weightedScore = match.score * FIELD_WEIGHTS.heading;
        if (!bestHeading || weightedScore > bestHeading.score) {
          bestHeading = { ...heading, score: weightedScore };
        }
        match.coveredTokens.forEach((token) => coveredTokens.add(token));
      });

      if (bestHeading?.score > 0) {
        totalScore += bestHeading.score;
        matchedFields.push({ field: "heading", score: bestHeading.score });
      }

      if (queryInfo.choseong) {
        if (preparedDocument.choseong.includes(queryInfo.choseong)) {
          totalScore += 80;
          matchedFields.push({ field: "title", score: 80 });
        }
      }

      if (totalScore <= 0) return null;

      const coverage = queryInfo.tokens.length ? coveredTokens.size / queryInfo.tokens.length : 1;
      totalScore *= coverage === 1 ? 1.28 : 0.4 + coverage * 0.45;
      if (document.featured) totalScore += 0.75;

      matchedFields.sort((left, right) => right.score - left.score);
      const preferredField = matchedFields[0]?.field ?? "content";
      const resultUrl =
        preferredField === "heading" && bestHeading
          ? `${document.url}${bestHeading.anchor}`
          : document.url;

      return {
        ...document,
        resultUrl,
        score: totalScore,
        matchedFields: unique(matchedFields.map(({ field }) => field)),
        preferredField,
        matchedHeading: preferredField === "heading" ? bestHeading?.text : null,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return parseDate(right.createdAt) - parseDate(left.createdAt);
    })
    .slice(0, limit)
    .map(({ preferredField, matchedHeading, ...result }) => ({
      ...result,
      snippet: findSnippet(result, queryInfo, preferredField, matchedHeading),
    }));
};

const getRecentDocuments = (documents, limit = 6) =>
  [...documents]
    .sort((left, right) => parseDate(right.createdAt) - parseDate(left.createdAt))
    .slice(0, limit)
    .map((document) => ({
      ...document,
      resultUrl: document.url,
      score: 0,
      matchedFields: [],
      snippet:
        document.description ||
        `${document.content.slice(0, 180)}${document.content.length > 180 ? "…" : ""}`,
    }));

const getPopularTerms = (documents, limit = 7) => {
  const counts = new Map();
  documents.forEach((document) => {
    [...document.categories, ...document.tags].forEach((term) => {
      const value = String(term).trim();
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([term]) => term);
};

const getHighlightTerms = (query) => {
  const queryInfo = getQueryInfo(query);
  return unique([queryInfo.normalized, ...queryInfo.tokens])
    .filter((term) => term.length > 0)
    .sort((left, right) => right.length - left.length);
};

module.exports = {
  getHighlightTerms,
  getPopularTerms,
  getRecentDocuments,
  normalizeSearchText,
  prepareSearchDocuments,
  searchDocuments,
  toChoseong,
};
