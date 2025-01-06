import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  VStack,
  Text,
  Link,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits } from "react-instantsearch-hooks-web";

// Algolia 클라이언트 설정
const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID!,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY!
);

// SearchBox 컴포넌트
const SearchBox = ({ onQueryChange, isMobile, autoFocus }: {
  onQueryChange: (query: string) => void;
  isMobile: boolean;
  autoFocus: boolean; // autoFocus를 props로 받음
}) => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query || "");
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (!isComposing) {
      refine(value);
      onQueryChange(value);
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    refine(e.currentTarget.value);
    onQueryChange(e.currentTarget.value);
  };

  return (
    <InputGroup
      size="lg"
      position={isMobile ? "absolute" : "fixed"}
      top={isMobile ? "50%" : "20px"}
      left={isMobile ? "50%" : "unset"}
      transform={isMobile ? "translate(-50%, -50%)" : "unset"}
      right={isMobile ? "unset" : "40px"}
      width={isMobile ? "90vw" : "300px"}
      maxW="none"
    >
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.500" />
      </InputLeftElement>
      <Input
        value={inputValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="제목이나 내용으로 검색..."
        borderRadius="lg"
        borderWidth="2px"
        width="100%"
        bg="white"
        _dark={{ bg: "gray.800" }}
        shadow="md"
        autoFocus={autoFocus} // autoFocus 속성을 동적으로 설정
        pl="3rem"
      />
    </InputGroup>
  );
};

// Hits 컴포넌트
const Hits = ({ query, isMobile }: { query: string; isMobile: boolean }) => {
  const { hits } = useHits();
  const MAX_AROUND = 50;

  const truncateHighlightedValue = (value: string, query: string, noLimit = false) => {
    const queryIndex = value.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) return value;

    if (noLimit) {
      const match = value.substring(queryIndex, queryIndex + query.length);
      return (
        <>
          {value.substring(0, queryIndex)}
          <strong>{match}</strong>
          {value.substring(queryIndex + query.length)}
        </>
      );
    }

    const prefix = value.substring(Math.max(0, queryIndex - MAX_AROUND), queryIndex);
    const match = value.substring(queryIndex, queryIndex + query.length);
    const suffix = value.substring(queryIndex + query.length, Math.min(value.length, queryIndex + query.length + MAX_AROUND));

    return (
      <>
        {prefix ? `...${prefix}` : ""}
        <strong>{match}</strong>
        {suffix ? `${suffix}...` : ""}
      </>
    );
  };

  const findFirstMatchingField = (hit: any, query: string) => {
    const fieldsToCheck = ["title", "slug", "description", "body", "tags", "categories"];

    if (!query) return null;

    for (const field of fieldsToCheck) {
      let fieldValue = hit[field];

      if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(", ");
      }

      if (typeof fieldValue === "string" && fieldValue.toLowerCase().includes(query.toLowerCase())) {
        return { field, value: fieldValue };
      }
    }

    return null;
  };

  return (
    <VStack
      align="start"
      bg="white"
      _dark={{ bg: "gray.800" }}
      p={4}
      rounded="lg"
      spacing={4}
      position={isMobile ? "absolute" : "fixed"}
      top={isMobile ? "480px" : "100px"}
      left={isMobile ? "50%" : "unset"}
      transform={isMobile ? "translate(-50%, -50%)" : "unset"}
      right={isMobile ? "unset" : "40px"}
      zIndex="20"
      width={isMobile ? "90vw" : "500px"}
      height="70vh"
      overflowY="auto"
    >
      <Text fontSize="sm" fontWeight="bold" mb={2}>
        검색 결과 {hits.length}개
      </Text>

      {hits.length === 0 ? (
        <Text fontSize="md">검색 결과 없음</Text>
      ) : (
        hits.map((hit: any) => {
          const matchingField = findFirstMatchingField(hit, query);
          const descriptionFallback = hit.description
            ? truncateHighlightedValue(hit.description, query)
            : "설명이 없습니다.";

          return (
            <Box
              key={hit.objectID}
              p={4}
              bg="white"
              borderColor="white"
              boxShadow="lg"
              _dark={{ bg: "gray.800", borderColor: "gray.800", boxShadow: "dark-lg" }}
              borderWidth="1.5px"
              borderRadius="md"
              width="100%"
            >
              <Link href={`/posts/${hit.slug}`} fontSize="md" _hover={{ textDecoration: "none" }}>
                {matchingField?.field === "title"
                  ? truncateHighlightedValue(hit.title, query, true)
                  : hit.title}
              </Link>
              <Text mt={2} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                {matchingField && matchingField.field !== "title"
                  ? truncateHighlightedValue(matchingField.value, query)
                  : descriptionFallback}
              </Text>
            </Box>
          );
        })
      )}
    </VStack>
  );
};

// Search 컴포넌트
const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 580px)");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      setIsSearchOpen(false);
    }
  };

  const handleQueryChange = (query: string) => {
    console.log("Updated Query:", query); // 디버깅용
    setQuery(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsFocused(false);
  };

  return (
    <Box position="relative">
      {/* 백그라운드 블러 */}
      {isFocused && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.7)"
          backdropFilter="blur(4px)"
          zIndex="10"
          onClick={toggleSearch}
        />
      )}

      <Box
        position="relative"
        zIndex="20"
        mx="auto"
        mt="10"
        maxW={isMobile ? "100%" : "600px"}
        onBlur={handleBlur}
        onFocus={handleFocus}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {isMobile ? (
          // 모바일: 항상 SearchBox 표시
          <InstantSearch searchClient={searchClient} indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME!}>
            <SearchBox onQueryChange={handleQueryChange} isMobile={isMobile} />
            {isFocused && query.trim() && <Hits query={query} isMobile={isMobile} />}
          </InstantSearch>
        ) : isSearchOpen ? (
          // 데스크톱: SearchBox 활성화
          <InstantSearch searchClient={searchClient} indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME!}>
            <SearchBox onQueryChange={handleQueryChange} isMobile={isMobile} autoFocus={isSearchOpen && !isMobile} />
            {isFocused && query.trim() && <Hits query={query} isMobile={isMobile} />}
          </InstantSearch>
        ) : (
          // 데스크톱: 아이콘 표시
          <IconButton
            aria-label="Open search"
            icon={<Search2Icon />}
            onClick={toggleSearch}
            top="-20px"
            size="lg"
            bg="white"
            _dark={{ bg: "gray.800" }}
            rounded="full"
          />
        )}
      </Box>
    </Box>
  );
};

export default Search;