import React, { useRef, useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  VStack,
  Text,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits } from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID!,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY!
);

// SearchBox 컴포넌트
const SearchBox = ({ onQueryChange, isMobile, autoFocus }: {
  onQueryChange: (query: string) => void;
  isMobile: boolean;
  autoFocus: boolean;
}) => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query || "");
  const [isComposing, setIsComposing] = useState(false);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputValue(value);
    refine(value);
    onQueryChange(value);
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    const value = e.currentTarget.value;
    refine(value);
    onQueryChange(value);
  };

  return (
    <InputGroup
      size="lg"
      position={isMobile ? "absolute" : "fixed"}
      top={isMobile ? "40%" : "25px"}
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
        onInput={handleInput} // onInput을 활용하여 입력 중에도 처리
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onMouseDown={(e) => e.stopPropagation()}
        placeholder="제목이나 내용으로 검색..."
        borderRadius="lg"
        borderWidth="2px"
        width="100%"
        bg="white"
        _dark={{ bg: "gray.800" }}
        shadow="md"
        autoFocus={autoFocus}
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
    if (!query.trim()) return value; // 쿼리가 비어 있으면 강조 표시를 하지 않음

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
      position="absolute"
      top={isMobile ? "calc(100% + 35px)" : "calc(100% + 55px)"} // SearchBox 바로 아래 5px 위치
      left={isMobile ? "50%" : "unset"} // 모바일은 중앙 정렬
      transform={isMobile ? "translateX(-50%)" : "unset"} // 모바일은 중앙 정렬을 위한 transform
      right={isMobile ? "unset" : "-10"} // 데스크톱은 SearchBox의 오른쪽 끝에 맞춤
      zIndex="20"
      width={isMobile ? "90vw" : "500px"}
      maxHeight="70vh"
      overflowY="auto"
    >
      <Text fontSize="md" fontWeight="bold" mb={2}>
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
              as="a"
              key={hit.objectID}
              href={`/posts/${hit.slug}`}
              p={4}
              bg="white"
              borderColor="white"
              boxShadow="lg"
              _dark={{ bg: "gray.800", borderColor: "gray.800", boxShadow: "dark-lg" }}
              borderWidth="1.5px"
              borderRadius="md"
              width="100%"
              _hover={{ bg: "gray.100", _dark: { bg: "gray.700" }, cursor: "pointer" }}
              onMouseDown={(e) => e.stopPropagation()} // 추가: 클릭 이벤트 전파 방지
              // onClick={() => setIsSearchOpen(false)} // 클릭 후 검색창 닫기
            >
              <Text fontSize="md" fontWeight="bold" _hover={{ textDecoration: "none" }}>
                {matchingField?.field === "title"
                  ? truncateHighlightedValue(hit.title, query, true)
                  : hit.title}
              </Text>
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
  const [isMobile] = useMediaQuery("(max-width: 630px)");

  const handleFocus = () => setIsFocused(true);

  const handleQueryChange = (query: string) => {
    console.log("Updated Query:", query); // 디버깅용
    setQuery(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsFocused(false);
  };

  // 추가: 검색창 외부 클릭 감지
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!document.getElementById("search-container")?.contains(target)) {
      setIsFocused(false);
      setIsSearchOpen(false);
    }
  };

  React.useEffect(() => {
    if (isFocused) {
      document.addEventListener("click", handleClickOutside); // 외부 클릭 감지 시작
    } else {
      document.removeEventListener("click", handleClickOutside); // 외부 클릭 감지 종료
    }
    return () => {
      document.removeEventListener("click", handleClickOutside); // 컴포넌트 언마운트 시 정리
    };
  }, [isFocused]);

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
        id="search-container" // 추가: 외부 클릭 감지를 위한 ID
        position="relative"
        zIndex="20"
        mx="auto"
        mt="10"
        maxW={isMobile ? "100%" : "600px"}
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
        ) : (
          <>
            {/* 데스크톱: 아이콘은 유지, SearchBox는 아이콘 위에 덮임 */}
            <IconButton
              aria-label="Open search"
              icon={<Search2Icon />}
              top="-20px"
              onClick={toggleSearch}
              size="lg"
              bg="white"
              _dark={{ bg: "gray.800" }}
              rounded="full"
              _hover={{
                bg: "blackAlpha.200",
                _dark: { bg: "whiteAlpha.200" },
              }}
            />
            {isSearchOpen && (
              <Box position="absolute" top="0" left="0" width="100%" zIndex="30">
                <InstantSearch searchClient={searchClient} indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME!}>
                  <SearchBox
                    onQueryChange={handleQueryChange}
                    isMobile={isMobile}
                    autoFocus={isSearchOpen && !isMobile}
                  />
                  {isFocused && query.trim() && <Hits query={query} isMobile={isMobile} />}
                </InstantSearch>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Search;
