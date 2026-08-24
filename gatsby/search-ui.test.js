const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const readSource = (relativePath) =>
  fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");

test("검색 트리거는 클릭 전후 같은 위치와 DOM을 유지한다", () => {
  const search = readSource("src/components/header/Search.tsx");

  assert.doesNotMatch(search, /top=["']-20px["']/);
  assert.doesNotMatch(search, /useMediaQuery/);
  assert.match(search, /\{trigger\}[\s\S]*\{SearchRuntime &&/);
  assert.match(search, /boxSize="44px"/);
  assert.match(search, /aria-expanded=\{isOpen\}/);
});

test("모바일 트리거의 focus 복귀는 검색 모달을 다시 열지 않는다", () => {
  const search = readSource("src/components/header/Search.tsx");

  assert.doesNotMatch(search, /onFocus=.*openSearch/);
  assert.match(search, /event\.key === "Enter" \|\| event\.key === " "/);
});

test("검색 결과 강조는 HTML 주입 없이 React 텍스트로 렌더링한다", () => {
  const runtime = readSource("src/components/header/SearchRuntime.tsx");

  assert.doesNotMatch(runtime, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(runtime, /algolia|instantsearch/i);
  assert.match(runtime, /role="combobox"/);
  assert.match(runtime, /role="listbox"/);
  assert.match(runtime, /role="option"/);
  assert.match(runtime, /maxLength=\{160\}/);
});

test("검색 모달은 포털에서도 현재 색상 모드의 배경을 명시적으로 사용한다", () => {
  const runtime = readSource("src/components/header/SearchRuntime.tsx");

  assert.match(runtime, /useColorModeValue\("white", "gray\.800"\)/);
  assert.match(runtime, /bg=\{panelBackground\}/);
  assert.match(runtime, /color=\{panelColor\}/);
  assert.match(runtime, /borderColor=\{panelBorderColor\}/);
});
