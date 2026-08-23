import { Search2Icon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useMediaQuery,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

type SearchRuntimeComponent = typeof import("./SearchRuntime").default;
let searchRuntimePromise: Promise<{ default: SearchRuntimeComponent }> | null = null;

const loadSearchRuntime = () => {
  if (!searchRuntimePromise) {
    searchRuntimePromise = import("./SearchRuntime");
  }

  return searchRuntimePromise;
};

const Search = () => {
  const [SearchRuntime, setSearchRuntime] =
    useState<SearchRuntimeComponent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [isMobile] = useMediaQuery("(max-width: 630px)");

  const openSearch = useCallback(async () => {
    if (SearchRuntime || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const module = await loadSearchRuntime();
      setSearchRuntime(() => module.default);
    } catch (error) {
      searchRuntimePromise = null;
      console.error("검색 모듈을 불러오지 못했습니다.", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [SearchRuntime]);

  if (SearchRuntime) {
    return <SearchRuntime initialOpen initialFocused />;
  }

  if (isMobile) {
    return (
      <InputGroup size="lg" width="100%" mt="10">
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.500" />
        </InputLeftElement>
        <Input
          aria-label="검색 열기"
          placeholder="제목이나 내용으로 검색..."
          readOnly
          borderRadius="lg"
          borderWidth="2px"
          bg="white"
          _dark={{ bg: "gray.800" }}
          shadow="md"
          pl="3rem"
          onClick={openSearch}
          onFocus={openSearch}
        />
      </InputGroup>
    );
  }

  return (
    <IconButton
      aria-label="Open search"
      icon={<Search2Icon />}
      top="-20px"
      onClick={openSearch}
      isLoading={isLoading}
      size="lg"
      bg="white"
      _dark={{ bg: "gray.800" }}
      rounded="full"
      _hover={{
        bg: "blackAlpha.200",
        _dark: { bg: "whiteAlpha.200" },
      }}
    />
  );
};

export default Search;
