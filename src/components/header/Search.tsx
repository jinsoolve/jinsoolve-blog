import React, { useState } from "react";
import { Input, InputGroup, InputLeftElement, Box, VStack, Text, Link, IconButton, chakra } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits } from "react-instantsearch-hooks-web";

// Algolia 클라이언트 설정
const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID!,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY!
);

// const StyledStrong = chakra("strong", {
//   baseStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textDecoration: "underline",
//     textDecorationColor: "blue.400", // 밑줄 색깔 설정
//     textDecorationThickness: "2px", // 밑줄 두께 설정
//     textUnderlineOffset: "4px", // 밑줄 위치 조정
//   },
// });

// SearchBox 컴포넌트
const SearchBox = ({ onQueryChange }: { onQueryChange: (query: string) => void }) => {
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
      position="fixed"
      right="40px"
      top="20px"
      width="300px" // Input과 동일한 너비로 설정
      maxW="none" // 필요 없는 제한 제거
    >
      {/* 왼쪽에 아이콘 추가 */}
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
        width="300px"
        bg="white"
        _dark={{ bg: "gray.800" }}
        shadow="md"
        autoFocus
        pl="3rem" // 아이콘 때문에 왼쪽 여백 추가
      />
    </InputGroup>
  );
};

// Hits 컴포넌트
const Hits = ({ query }: { query: string }) => {
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
      maxW="90vw"
      width="500px" // 너비 설정
      // maxH="500px"
      height="70vh"
      position="fixed"
      top="100px"
      right="40px" // 화면 오른쪽에서 20px 떨어진 곳에서 끝나도록 설정
      zIndex="20"
      overflowY="auto"
      padding="20px 30px"
    >
      {/* 검색 결과 수 표시 */}
      <Text fontSize="sm" fontWeight="bold" mb={2}>
        검색 결과 {hits.length}개
      </Text>

      {hits.length === 0 ? (
        <Text fontSize="md">검색 결과 없음</Text>
      ) : (
        hits.map((hit: any) => {
          const matchingField = findFirstMatchingField(hit, query);
          const descriptionFallback = hit.description ? truncateHighlightedValue(hit.description, query) : "설명이 없습니다.";

          return (
            <Box
              key={hit.objectID}
              p={4}
              bg="white"
              borderColor="white"
              boxShadow="lg !important"
              _dark={{ bg: "gray.800", borderColor: "gray.800", boxShadow: "dark-lg !important" }}
              borderWidth="1.5px"
              borderRadius="md"
              width="100%"
              _hover={{
                cursor: "pointer !important",
                bg: "gray.100 !important", // 라이트 모드에서 hover 시 배경색
                borderColor: "blue.400 !important", // hover 시 borderColor
                _dark: {
                  bg: "gray.700 !important", // 다크 모드에서 hover 시 배경색
                  borderColor: "blue.400 !important", // 다크 모드에서 hover 시 borderColor
                },
              }}
            >
              <Link
                href={`/posts/${hit.slug}`}
                fontSize="md"
                _hover={{ textDecoration: "none" }}
              >
                {matchingField?.field === "title"
                  ? truncateHighlightedValue(hit.title, query, true)
                  : hit.title}
              </Link>

              {/* 매칭되는 필드가 없으면 description 표시 */}
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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      setIsSearchOpen(false);
    }
  };

  const handleQueryChange = (query: string) => {
    console.log("Updated Query:", query); // 디버깅: query 값 확인
    setQuery(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsFocused(false);
  };

  return (
    <Box position="relative">
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
        maxW="600px"
        onBlur={handleBlur}
        onFocus={handleFocus}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {isSearchOpen ? (
          <InstantSearch searchClient={searchClient} indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME!}>
            <SearchBox onQueryChange={handleQueryChange} />
            {isFocused && query.trim() && <Hits query={query} />}
          </InstantSearch>
        ) : (
          <IconButton
            aria-label="Open search"
            icon={<Search2Icon />}
            onClick={toggleSearch}
            size="lg"
            bg="white"
            top="-20px"
            width="40px"
            _dark={{ bg: "gray.800" }}
            rounded="full"
          />
        )}
      </Box>
    </Box>
  );
};

export default Search;