import { Search2Icon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

type SearchRuntimeComponent = typeof import("./SearchRuntime").default;
let searchRuntimePromise: Promise<{ default: SearchRuntimeComponent }> | null = null;

const loadSearchRuntime = () => {
  if (!searchRuntimePromise) searchRuntimePromise = import("./SearchRuntime");
  return searchRuntimePromise;
};

interface SearchProps {
  enableShortcut?: boolean;
  onNavigate?: () => void;
  variant?: "icon" | "field";
}

const Search = ({ enableShortcut = false, onNavigate, variant = "icon" }: SearchProps) => {
  const [SearchRuntime, setSearchRuntime] = useState<SearchRuntimeComponent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const openSearch = useCallback(async () => {
    if (SearchRuntime) {
      setIsOpen(true);
      return;
    }
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const module = await loadSearchRuntime();
      setSearchRuntime(() => module.default);
      setIsOpen(true);
    } catch (error) {
      searchRuntimePromise = null;
      console.error("검색 모듈을 불러오지 못했습니다.", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [SearchRuntime]);

  useEffect(() => {
    if (!enableShortcut) return undefined;

    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        void openSearch();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [enableShortcut, openSearch]);

  const trigger =
    variant === "field" ? (
      <InputGroup size="lg" width="100%" mt="10">
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.500" />
        </InputLeftElement>
        <Input
          ref={fieldRef}
          aria-label="검색 열기"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          role="button"
          placeholder="제목, 태그, 본문을 검색하세요"
          readOnly
          cursor="pointer"
          borderRadius="lg"
          borderWidth="2px"
          bg="white"
          _dark={{ bg: "gray.800" }}
          shadow="md"
          pl="3rem"
          pr="3rem"
          onClick={() => void openSearch()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void openSearch();
            }
          }}
        />
        {isLoading && (
          <InputRightElement pointerEvents="none">
            <Spinner size="sm" />
          </InputRightElement>
        )}
      </InputGroup>
    ) : (
      <IconButton
        ref={buttonRef}
        aria-label="검색 열기"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="검색 (Ctrl/Cmd + K)"
        icon={<Search2Icon />}
        onClick={() => void openSearch()}
        isLoading={isLoading}
        boxSize="44px"
        minW="44px"
        flexShrink={0}
        bg="white"
        _dark={{ bg: "gray.800" }}
        rounded="full"
        _hover={{
          bg: "blackAlpha.200",
          _dark: { bg: "whiteAlpha.200" },
        }}
      />
    );

  return (
    <>
      {trigger}
      {SearchRuntime && (
        <SearchRuntime
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNavigate={onNavigate}
          finalFocusRef={variant === "field" ? fieldRef : buttonRef}
        />
      )}
    </>
  );
};

export default Search;
