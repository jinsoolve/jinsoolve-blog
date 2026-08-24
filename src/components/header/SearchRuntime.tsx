import { Search2Icon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { navigate, withPrefix } from "gatsby";
import type { RefObject } from "react";
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import type {
  LocalSearchIndex,
  LocalSearchResult,
  SearchMatchField,
} from "../../utils/local-search";
import {
  getHighlightTerms,
  getPopularTerms,
  getRecentDocuments,
  prepareSearchDocuments,
  searchDocuments,
} from "../../utils/local-search";

const SEARCH_INDEX_VERSION = 1;
const RESULT_LIMIT = 10;
const RESULT_LIST_ID = "local-search-results";

let searchIndexPromise: Promise<LocalSearchIndex> | null = null;

const requestSearchIndex = () =>
  fetch(withPrefix("/search-index.json"), {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    credentials: "same-origin",
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`검색 인덱스 요청 실패 (${response.status})`);
    }

    const index = (await response.json()) as LocalSearchIndex;
    if (index.version !== SEARCH_INDEX_VERSION || !Array.isArray(index.documents)) {
      throw new Error("지원하지 않는 검색 인덱스 형식입니다.");
    }

    return index;
  });

const fetchSearchIndex = () => {
  if (process.env.NODE_ENV === "development") return requestSearchIndex();

  if (!searchIndexPromise) {
    searchIndexPromise = requestSearchIndex();
  }

  return searchIndexPromise;
};

const MATCH_FIELD_LABELS: Record<SearchMatchField, string> = {
  title: "제목",
  tags: "태그",
  categories: "카테고리",
  heading: "본문 섹션",
  description: "설명",
  slug: "주소",
  content: "본문",
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  const terms = getHighlightTerms(query);
  if (!query.trim() || terms.length === 0) return <>{text}</>;

  const expression = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "giu");
  const normalizedTerms = new Set(terms.map((term) => term.toLowerCase()));

  return (
    <>
      {text.split(expression).map((part, index) =>
        normalizedTerms.has(part.toLowerCase()) ? (
          <Box
            as="mark"
            key={`${part}-${index}`}
            bg="yellow.200"
            color="inherit"
            _dark={{ bg: "yellow.600" }}
            borderRadius="sm"
            px="0.5"
          >
            {part}
          </Box>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

const formatDate = (value: string | null) => (value ? value.replaceAll("/", ".") : "날짜 없음");

interface SearchResultItemProps {
  active: boolean;
  index: number;
  query: string;
  result: LocalSearchResult;
  onNavigate: React.Dispatch<LocalSearchResult>;
  onSelect: React.Dispatch<React.SetStateAction<number>>;
}

const SearchResultItem = ({
  active,
  index,
  query,
  result,
  onNavigate,
  onSelect,
}: SearchResultItemProps) => {
  const matchedField = result.matchedFields[0];

  return (
    <Box
      as="button"
      id={`local-search-option-${index}`}
      role="option"
      aria-selected={active}
      type="button"
      width="100%"
      textAlign="left"
      px={{ base: 4, md: 5 }}
      py="4"
      bg={active ? "blackAlpha.100" : "transparent"}
      _dark={{ bg: active ? "whiteAlpha.100" : "transparent" }}
      borderLeftWidth="3px"
      borderLeftColor={active ? "blue.400" : "transparent"}
      transition="background-color 120ms ease, border-color 120ms ease"
      _hover={{ bg: "blackAlpha.100", _dark: { bg: "whiteAlpha.100" } }}
      onMouseEnter={() => onSelect(index)}
      onClick={() => onNavigate(result)}
    >
      <Flex align="start" justify="space-between" gap="4">
        <Box minW="0" flex="1">
          <HStack spacing="2" mb="1.5">
            {matchedField && (
              <Badge colorScheme="blue" variant="subtle" flexShrink="0">
                {MATCH_FIELD_LABELS[matchedField]}
              </Badge>
            )}
            {result.featured && (
              <Badge colorScheme="purple" variant="subtle" flexShrink="0">
                Featured
              </Badge>
            )}
            {result.locale !== "ko" && (
              <Badge variant="outline" flexShrink="0">
                {result.locale.toUpperCase()}
              </Badge>
            )}
          </HStack>

          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="800" noOfLines={1}>
            <HighlightedText text={result.title} query={query} />
          </Text>
          <Text
            mt="1.5"
            color="gray.600"
            _dark={{ color: "gray.300" }}
            fontSize="sm"
            lineHeight="1.65"
            noOfLines={2}
          >
            <HighlightedText text={result.snippet} query={query} />
          </Text>

          <Flex mt="2.5" align="center" wrap="wrap" gap="2">
            {result.categories.slice(0, 2).map((category) => (
              <Tag key={category} size="sm" variant="subtle" colorScheme="gray">
                {category}
              </Tag>
            ))}
            <Text fontSize="xs" color="gray.500">
              {formatDate(result.updatedAt || result.createdAt)} · {result.readingMinutes}분
            </Text>
          </Flex>
        </Box>
        <Text
          display={{ base: "none", md: active ? "block" : "none" }}
          color="gray.500"
          fontSize="xs"
          pt="2"
          flexShrink="0"
        >
          Enter ↵
        </Text>
      </Flex>
    </Box>
  );
};

interface SearchRuntimeProps {
  finalFocusRef?: RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: () => void;
}

const SearchRuntime = ({ finalFocusRef, isOpen, onClose, onNavigate }: SearchRuntimeProps) => {
  // Resolve portal surface colors from React's color-mode context instead of
  // depending on the modal theme's CSS-variable override timing.
  const panelBackground = useColorModeValue("white", "gray.800");
  const panelColor = useColorModeValue("gray.900", "gray.50");
  const panelBorderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const sectionBorderColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);
  const wasOpen = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [documents, setDocuments] = useState<LocalSearchIndex["documents"]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const loadIndex = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const index = await fetchSearchIndex();
      prepareSearchDocuments(index.documents);
      setDocuments(index.documents);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "검색 데이터를 불러오지 못했습니다.",
      );
    }
  }, []);

  useEffect(() => {
    const justOpened = isOpen && !wasOpen.current;
    wasOpen.current = isOpen;

    if (justOpened && (status === "idle" || process.env.NODE_ENV === "development")) {
      void loadIndex();
    }
  }, [isOpen, loadIndex, status]);

  const hasQuery = deferredQuery.trim().length > 0;
  const results = useMemo(
    () =>
      hasQuery
        ? searchDocuments(documents, deferredQuery, { limit: RESULT_LIMIT })
        : getRecentDocuments(documents, 6),
    [deferredQuery, documents, hasQuery],
  );
  const popularTerms = useMemo(() => getPopularTerms(documents), [documents]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery, documents]);

  useEffect(() => {
    if (!isOpen || results.length === 0) return;
    document
      .getElementById(`local-search-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, results.length]);

  const selectTerm = (term: string) => {
    setInputValue(term);
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleNavigate = (result: LocalSearchResult) => {
    onClose();
    onNavigate?.();
    void navigate(result.resultUrl);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing.current || (event.nativeEvent as KeyboardEvent).isComposing) return;

    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current === 0 ? results.length - 1 : current - 1));
    } else if (event.key === "Enter") {
      const currentResults =
        inputValue === deferredQuery
          ? results
          : inputValue.trim()
          ? searchDocuments(documents, inputValue, { limit: RESULT_LIMIT })
          : getRecentDocuments(documents, 6);
      const selectedResult =
        inputValue === deferredQuery ? currentResults[activeIndex] : currentResults[0];

      if (selectedResult) {
        event.preventDefault();
        handleNavigate(selectedResult);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInputValue(value);
    if (!isComposing.current && !(event.nativeEvent as InputEvent).isComposing) {
      setQuery(value);
    }
  };

  const retry = () => {
    searchIndexPromise = null;
    void loadIndex();
  };

  const activeDescendant = results[activeIndex] ? `local-search-option-${activeIndex}` : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={inputRef}
      finalFocusRef={finalFocusRef}
      scrollBehavior="inside"
      size="xl"
      isCentered={false}
      preserveScrollBarGap
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(8px)" />
      <ModalContent
        bg={panelBackground}
        color={panelColor}
        my={{ base: 0, md: "9vh" }}
        mx={{ base: 0, md: 4 }}
        maxW={{ base: "100vw", md: "760px" }}
        h={{ base: "100dvh", md: "auto" }}
        minH={{ base: "100dvh", md: "0" }}
        maxH={{ base: "100dvh", md: "80vh" }}
        borderRadius={{ base: 0, md: "2xl" }}
        overflow="hidden"
        borderWidth={{ base: 0, md: "1px" }}
        borderColor={panelBorderColor}
        boxShadow="2xl"
      >
        <Flex align="center" px={{ base: 4, md: 6 }} minH={{ base: "68px", md: "76px" }}>
          <Search2Icon boxSize="5" color="blue.400" flexShrink="0" />
          <Input
            ref={inputRef}
            role="combobox"
            aria-label="블로그 글 검색"
            aria-autocomplete="list"
            aria-controls={status === "ready" ? RESULT_LIST_ID : undefined}
            aria-expanded={isOpen}
            aria-activedescendant={activeDescendant}
            value={inputValue}
            maxLength={160}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              isComposing.current = true;
            }}
            onCompositionEnd={(event) => {
              isComposing.current = false;
              setInputValue(event.currentTarget.value);
              setQuery(event.currentTarget.value);
            }}
            variant="unstyled"
            placeholder="제목, 태그, 본문을 검색하세요"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="600"
            ml="4"
            pr="3"
          />
          <Kbd display={{ base: "none", md: "inline-flex" }} color="gray.500" mr="3">
            ESC
          </Kbd>
          <CloseButton aria-label="검색 닫기" onClick={onClose} flexShrink="0" />
        </Flex>

        <Divider borderColor={sectionBorderColor} />

        <ModalBody p="0" overflowY="auto">
          {status === "loading" && (
            <VStack py="20" spacing="4" aria-live="polite">
              <Spinner size="lg" color="blue.400" thickness="3px" />
              <Text color="gray.500">검색 인덱스를 준비하고 있습니다…</Text>
            </VStack>
          )}

          {status === "error" && (
            <VStack py="16" px="6" spacing="4" textAlign="center" role="alert">
              <Text fontWeight="800" fontSize="lg">
                검색 데이터를 불러오지 못했습니다
              </Text>
              <Text color="gray.500" fontSize="sm">
                {errorMessage}
              </Text>
              <Box
                as="button"
                type="button"
                onClick={retry}
                px="5"
                py="2.5"
                borderRadius="full"
                bg="blue.500"
                color="white"
                fontWeight="700"
                _hover={{ bg: "blue.600" }}
              >
                다시 시도
              </Box>
            </VStack>
          )}

          {status === "ready" && (
            <>
              {!hasQuery && popularTerms.length > 0 && (
                <Box px={{ base: 4, md: 6 }} pt="5" pb="3">
                  <Text
                    fontSize="xs"
                    fontWeight="800"
                    letterSpacing="wider"
                    color="gray.500"
                    textTransform="uppercase"
                    mb="3"
                  >
                    추천 검색어
                  </Text>
                  <Flex wrap="wrap" gap="2">
                    {popularTerms.map((term) => (
                      <Tag
                        as="button"
                        type="button"
                        key={term}
                        size="md"
                        borderRadius="full"
                        cursor="pointer"
                        onClick={() => selectTerm(term)}
                        _hover={{ bg: "blue.100", _dark: { bg: "blue.800" } }}
                      >
                        {term}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              )}

              <Flex px={{ base: 4, md: 6 }} pt="4" pb="2" align="center" justify="space-between">
                <Text fontWeight="800" fontSize="sm">
                  {hasQuery ? "검색 결과" : "최근 글"}
                </Text>
                <Text fontSize="xs" color="gray.500" aria-live="polite" aria-atomic="true">
                  {hasQuery
                    ? results.length === RESULT_LIMIT
                      ? `상위 ${RESULT_LIMIT}개 표시`
                      : `${results.length}개 찾음`
                    : `${documents.length}개 글에서 검색`}
                </Text>
              </Flex>

              {results.length > 0 ? (
                <Box id={RESULT_LIST_ID} role="listbox" aria-label="검색 결과">
                  {results.map((result, index) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      query={deferredQuery}
                      index={index}
                      active={index === activeIndex}
                      onSelect={setActiveIndex}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </Box>
              ) : (
                <VStack py="16" px="6" spacing="3" textAlign="center" aria-live="polite">
                  <Text fontSize="2xl">🔎</Text>
                  <Text fontWeight="800">일치하는 글이 없습니다</Text>
                  <Text color="gray.500" fontSize="sm">
                    단어를 줄이거나 카테고리·태그 이름으로 다시 검색해 보세요.
                  </Text>
                </VStack>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter
          display={{ base: "none", md: "flex" }}
          py="3"
          px="6"
          borderTopWidth="1px"
          borderColor={sectionBorderColor}
          justifyContent="space-between"
          color="gray.500"
          fontSize="xs"
        >
          <HStack spacing="4">
            <Text>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> 이동
            </Text>
            <Text>
              <Kbd>Enter</Kbd> 열기
            </Text>
            <Text>
              <Kbd>Esc</Kbd> 닫기
            </Text>
          </HStack>
          <Text>로컬 검색 · 외부 전송 없음</Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchRuntime;
